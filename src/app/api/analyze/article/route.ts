import { NextResponse } from "next/server";
import { extractArticleContent, ExtractedArticle } from "@/lib/extractArticleContent";

interface SonarResponse {
  claim: string;
  truthfulness_score: number;
  verdict: "Likely True" | "Likely False" | "Mixed Evidence" | "Unverifiable";
  summary: string;
  explanation: string;
  follow_up_questions: string[];
  sources: { 
    title: string;
    url: string;
  }[];
}

export async function POST(request: Request) {
    try {
        const { url } = await request.json();
        if (!url) {
            return NextResponse.json({ error: "URL is required" }, { status: 400 });
        }

        const article = await extractArticleContent(url);
        if (!article) {
            return NextResponse.json({ error: "Failed to extract article content" }, { status: 500 });
        }

        const sonarMessages = [
  {
    role: 'system',
    content: `You are a precise fact-checking AI.

Your job is to:
1. Identify one major factual claim from the article.
2. Verify its accuracy using real-time web search.
3. Respond ONLY with a valid JSON object. Do NOT add any explanation, markdown, or formatting outside the JSON.
4. Maintain proper JSON structure and field types.`
  },
  {
    role: 'user',
    content: `Analyze the following article and return the result in JSON format.

Article Title: "${article.title}"
Source: ${article.source}

Content:
${article.content}

Return your analysis in the following exact structure:
{
  "claim": "...",
  "truthfulness_score": 0-100,
  "verdict": "Likely True" | "Likely False" | "Mixed Evidence" | "Unverifiable",
  "summary": "Concise summary of findings, no more than 4 sentences",
  "explanation": "...",
  "follow_up_questions": ["Question 1", "Question 2", "Question 3"],
  "sources": [{"title": "...", "url": "..."}, {"title": "...", "url": "..."}]
}`
  }
];


        try {
            const response = await fetch("https://api.perplexity.ai/chat/completions", {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${process.env.NEXT_PUBLIC_PERPLEXITY_API_KEY}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: sonarMessages,
                    model: "sonar-pro"
                })
            });
            
            const data = await response.json();
            
            let analysisContent = {};
            if (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
            try {
                // If the content is a string containing JSON
                const contentString = data.choices[0].message.content;
                
                // Check if it starts with a code block and extract just the JSON part
                if (contentString.includes('```json')) {
                const jsonPart = contentString.split('```json')[1].split('```')[0].trim();
                analysisContent = JSON.parse(jsonPart);
                } else if (contentString.startsWith('{') && contentString.endsWith('}')) {
                // Direct JSON string
                analysisContent = JSON.parse(contentString);
                } else {
                analysisContent = { error: "Invalid response format", rawContent: contentString };
                }
            } catch (error) {
                console.error("Error parsing analysis content:", error);
                analysisContent = { error: "Failed to parse analysis content", raw: data };
            }
            }

            return NextResponse.json({ article, analysis: analysisContent });
        } catch (error) {
            console.error("Error fetching from Perplexity API:", error);
            return NextResponse.json({ error: "Failed to fetch from Perplexity API" }, { status: 500 });
        }
    } catch (error) {
        console.error("Error processing request:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}