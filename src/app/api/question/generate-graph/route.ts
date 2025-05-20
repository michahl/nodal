import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

const generateNanoId = (size = 8) => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let id = '';
    for (let i = 0; i < size; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
}

const generateSlug = (question: string) => {
    const slug = question
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .replace(/-+/g, '-');

    const nanoId = generateNanoId(8);
    return `${slug}-${nanoId}`;
}


export async function POST(request: Request) {
    try {
        const cookieStore = cookies();
        const supabase = createClient(cookieStore);

        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: 'Unauthorized! Authentication required.' },
                { status: 401 }
            )
        }

        const body = await request.json();
        const { question } = body;

        if (!question) {
            return NextResponse.json(
                { error: "Question is required" },
                { status: 400 }
            );
        }

        const slug = generateSlug(question);

        const sonarMessage = [
            {
                role: 'system',
                content: `
                You are a specialized AI for creating knowledge graphs. Given a user's question, your task is to:
                
                1. Create a knowledge graph with 3-5 nodes that explore the question in depth
                2. Keep the original question's meaning, but polish it to be more elegant and concise (max 60 characters)
                3. Provide a brief description of the topic (max 200 characters)
                
                FORMAT YOUR RESPONSE EXACTLY AS FOLLOWS (in valid JSON format):
                
                {
                "question": "Polished version of original question (max 60 chars)",
                "description": "Brief description of the topic (max 120 chars)",
                "nodes": [
                    {
                    "id": "1",
                    "data": {
                        "label": "The main question", 
                        "details": "Detailed explanation with facts, figures, and context (200-300 words)",
                        "sources": [
                        {"url": "https://example.com", "name": "Source Name"}
                        ],
                        "reasoning": "Why this node is important to understanding the topic",
                        "description": "Brief summary of this specific node"
                    },
                    "type": "default",
                    "position": {"x": 0, "y": 0}
                    },
                    ... additional nodes ...
                ],
                "edges": [
                    {
                        "id": "1-2",
                        "source": "1", 
                        "target": "2",
                        "animated": false
                    },
                    ... additional edges ...
                ]
                }
                
                REQUIREMENTS:
                - Node IDs must be unique strings like "1", "2", "3", etc.
                - Node positions should create a logical hierarchy (main concept at top, related concepts below)
                - Edge IDs should follow the format "source-target" (e.g., "1-2")
                - The first node should always represent the main question
                - Each node should have high-quality content with accurate information
                - Include 2-4 relevant source links per node (with valid URLs and descriptive names)
                - Ensure the edges create a logical connection between related concepts
                - Format all content as valid JSON (use double quotes, escape special characters)
                
                TIPS FOR GOOD KNOWLEDGE GRAPHS:
                - Start broad, then focus on specific aspects
                - Connect related concepts with logical edges
                - Balance breadth and depth of exploration
                - Include practical, theoretical, and contextual information
                - Make sure each node adds unique value to understanding the topic
                `.trim(),
            },
            {
                role: 'user',
                content: question.trim(),
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
                    model: "sonar",
                })
            });

            if (!res.ok) {
                return NextResponse.json(
                    { error: `Perplexity API error: ${res.status}` },
                    { status: res.status }
                );
            }

            const data = await res.json();
            let graphData;

            try {
                const content = data?.choices?.[0]?.message?.content;

                const jsonMatch = content.match(/\{[\s\S]*\}/);
                const jsonString = jsonMatch ? jsonMatch[0] : content;
                graphData = JSON.parse(jsonString);
            } catch (parseError) {
                return NextResponse.json(
                    { error: "Failed to parse JSON from Perplexity API" },
                    { status: 500 }
                );
            }

            console.log(JSON.stringify(graphData.nodes || []))

            const { data: savedMap, error: dbError } = await supabase
                .from("knowledge_maps")
                .insert([
                    {
                        slug: slug,
                        user_id: user.id,
                        title: graphData.question || question,
                        description: graphData.description || "",
                        nodes: JSON.stringify(graphData.nodes || []),
                        edges: JSON.stringify(graphData.edges || []),
                    }
                ])
                .select()
                .single();

            if (dbError) {
                return NextResponse.json(
                    { error: "Failed to save it to the database" },
                    { status: 500 }
                );
            }

            return NextResponse.json({
                message: "Created successfully",
                slug: savedMap.slug,
            })
        } catch (e) {
            return NextResponse.json(
                { error: "Failed to fetch from Perplexity API" },
                { status: 500 }
            )
        }
    } catch (e) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}