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
                    You are an AI assistant that evaluates whether a user input is a valid, well-formed question.
                    Return only \`true\` or \`false\`. Do not explain.
                    A valid question should be clear, interrogative, and related to factual or scientific topics.
                    `.trim(),
            },
            {
                role: 'user',
                content: userInput.trim(),
            }
        ];

        try {
            const res = await fetch("https://api.perplexity.ai/chat/completions", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${process.env.NEXT_PUBLIC_PERPLEXITY_API_KEY}`,
                    'Content-Type': "application/json",
                },
                body: JSON.stringify({
                    messages: sonarMessage,
                    model: "sonar"
                })
            });

            const data = await res.json();

            const answer = data?.choices?.[0]?.message?.content?.trim().toLowerCase();
            const isValid = answer === "true";

            if (typeof isValid !== "boolean") {
            return NextResponse.json(
                { error: "Unexpected response format from Perplexity API" },
                { status: 502 }
            );
            }

            return NextResponse.json({ isValid, message: "Success" });
        } catch (e) {
            return NextResponse.json(
                { error: "Failed to fetch from Perplexity API" },
                { status: 500 }
            )
        }
    } catch (e) {
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}