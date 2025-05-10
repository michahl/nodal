import { NextResponse } from "next/server";
import { extractArticleContent, ExtractedArticle } from "@/lib/extractArticleContent";

interface SonarResponse {
    answer: string;
    sources: { 
        title: string;
        url: string;
    }[];
}

interface ApiResponse {
    article?: ExtractedArticle;
    analysis?: SonarResponse;
    error?: string;
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
                content: `
                    You are an AI fact-checker assistant. Analyze the following article and extract any code claims made in it.
                    Then choose one central claim to evaluate using real-time web search.

                    Respond with a JSON object containing the following fields:

                    {
                        "claim": "string",
                        "truthfulness_score": number (0-100),
                        "verdict": "Likely True" | "Likely False" | "Mixed Evidence" | "Unverifiable",
                        "summary": "string",
                        "explanation": "string",
                        "follow_up_questions": ["string", "string", "string"],
                        "citations": [
                            {
                            "title": "string",
                            "url": "string"
                            }
                        ]
                    }
                `.trim(),
            }, {
                role: 'user',
                content: `
                    Analyze the article titled "${article.title}" from ${article.source}.
                    The article content is as follows:\n\n
                    ${article.content}
                `
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
                    model: "sonar-deep-research"
                })
            });
            
            const data = await response.json();
            return NextResponse.json({ article, analysis: data });
        } catch (error) {
            console.error("Error fetching from Perplexity API:", error);
            return NextResponse.json({ error: "Failed to fetch from Perplexity API" }, { status: 500 });
        }
    } catch (error) {
        console.error("Error processing request:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}