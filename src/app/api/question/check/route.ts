import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const cookieStore = cookies();
        const supabase = createClient(cookieStore);
    
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !user) {
            return NextResponse.json(
                { error: 'Unauthorized! Authentication required.' },
                { status: 401 }
            );
        }

        const { data: count, error: countError } = await supabase
            .from("knowledge_maps")
            .select('id', { count: "exact" })
            .eq("user_id", user.id)

        if (countError) {
            return NextResponse.json(
                { error: "Failed to fetch knowledge maps count" },
                { status: 500 }
            );
        }

        if ((count?.length || 0) >= 4) {
            return NextResponse.json(
                { error: "You have reached the maximum number of knowledge maps (4)" },
                { status: 403 }
            );
        }


        const { userInput } = await request.json();
        if (!userInput) {
            return NextResponse.json(
                { error: "Question is required" },
                { status: 400 }
            );
        }

        const sonarMessage = [
            {
                role: 'system',
                content: `
                You are an AI assistant that evaluates whether a user input is a valid question.
                
                VALID QUESTIONS:
                - Start with question words like who, what, where, when, why, how
                - Seek information or explanation
                - Clear and specific
                - Examples: "What is the big bang?", "How do computers work?", "Why is the sky blue?"
                
                INVALID INPUTS:
                - Single words without context: "banana", "sky", "technology"
                - Statements that don't ask for information: "The earth is round"
                - Gibberish or nonsensical strings: "asdfjkl"
                
                Respond ONLY with "VALID" if it's a valid question or "INVALID" if it's not.
                `.trim(),
            },
            {
                role: 'user',
                content: `
                Make a decision: is the following input a valid question?
                "${userInput}"
                Please respond with "VALID" or "INVALID" only.
                `.trim(),
            }
        ];

        try {
            let attempt = 0;
            const maxAttempts = 3;
            let success = false;
            let data;
            
            while (attempt < maxAttempts && !success) {
                attempt++;
                
                try {
                    const res = await fetch("https://api.perplexity.ai/chat/completions", {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${process.env.NEXT_PUBLIC_PERPLEXITY_API_KEY}`,
                            'Content-Type': "application/json",
                        },
                        body: JSON.stringify({
                            messages: sonarMessage,
                            model: "sonar",
                            temperature: 0,
                            max_tokens: 5,
                        })
                    });
                    
                    if (!res.ok) {
                        const errorData = await res.text();
                        console.error(`Attempt ${attempt}: Perplexity API error:`, res.status, errorData);
                        
                        // Wait before retrying (with exponential backoff)
                        if (attempt < maxAttempts) {
                            await new Promise(r => setTimeout(r, 1000 * attempt));
                            continue;
                        }
                        
                        return NextResponse.json(
                            { error: `Perplexity API error: ${res.status}` },
                            { status: res.status }
                        );
                    }
                    
                    data = await res.json();
                    success = true;
                    
                } catch (e) {
                    // Wait before retrying
                    if (attempt < maxAttempts) {
                        await new Promise(r => setTimeout(r, 1000 * attempt));
                    }
                }
            }
            
            if (!success) {
                return NextResponse.json(
                    { error: "Failed to fetch from Perplexity API after multiple attempts" },
                    { status: 500 }
                );
            }
            
            const answer = data?.choices?.[0]?.message?.content?.trim()?.toUpperCase() || "";
            console.log("API response:", answer);
            
            const isValid = answer === "VALID";
            
            return NextResponse.json({ 
                isValid, 
                message: "Success",
                debug: { answer }
            });
        } catch (e) {
            console.error("Error in validation request:", e);
            return NextResponse.json(
                { error: "Failed to fetch from Perplexity API" },
                { status: 500 }
            );
        }
    } catch (e) {
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}