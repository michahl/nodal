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

        const body = await request.json();
        const { 
            parentNodeId, 
            parentNodeContent,
            explorationSlug 
        } = body;

        if (!parentNodeId || !explorationSlug) {
            return NextResponse.json(
                { error: "Missing required parameters" },
                { status: 400 }
            );
        }

        const { data: exploration, error: fetchError } = await supabase
            .from('knowledge_maps')
            .select('*')
            .eq('slug', explorationSlug)
            .single();
        
        if (fetchError || !exploration) {
            return NextResponse.json(
                { error: "Exploration not found" },
                { status: 404 }
            );
        }

        if (exploration.user_id !== user.id) {
            return NextResponse.json(
                { error: "You don't have permission to modify this exploration" },
                { status: 403 }
            );
        }

        const existingNodes = JSON.parse(exploration.nodes || '[]');
        const existingEdges = JSON.parse(exploration.edges || '[]');
        
        const parentNode = existingNodes.find((node: any) => node.id === parentNodeId);
        if (!parentNode) {
            return NextResponse.json(
                { error: "Parent node not found" },
                { status: 404 }
            );
        }

        const prompt = `
            Based on this concept: "${parentNode.data.label}", 
            expand on a specific aspect or implication mentioned in this detail: 
            "${parentNodeContent || parentNode.data.details}".
            
            Create a new node that explores this idea further, providing deeper insights,
            examples, or connections that weren't covered in the original node.
        `;

        const newNodeId = (Math.max(...existingNodes.map((node: any) => parseInt(node.id)), 0) + 1).toString();
        
        type NodePosition = { x: number; y: number };
        type NodeType = {
        id: string;
        position: NodePosition;
        [key: string]: any;
        };

        const calculateOptimalPosition = (
            existingNodes: NodeType[],
            parentNode: NodeType
            ): NodePosition => {
            const parentPosition = parentNode.position;

            // Define node dimensions (approximate)
            const nodeWidth = 220;
            const nodeHeight = 150;

            // Helper function to check if two positions would create overlapping nodes
            const wouldOverlap = (pos1: NodePosition, pos2: NodePosition): boolean => {
                const dx = Math.abs(pos1.x - pos2.x);
                const dy = Math.abs(pos1.y - pos2.y);
                return (dx < nodeWidth) && (dy < nodeHeight);
            };

            // Try positions at different angles around the parent
            const angles = [0, 45, 90, 135, 180, 225, 270, 315];
            const radius = 180; // Base distance from parent

            // Try each angle to find a non-overlapping position
            for (const angle of angles) {
                const radians = (angle * Math.PI) / 180;
                const candidatePos = {
                x: parentPosition.x + radius * Math.cos(radians),
                y: parentPosition.y + radius * Math.sin(radians)
                };

                // Check if this position overlaps with any existing node
                const hasOverlap = existingNodes.some((node: NodeType) => {
                // Skip the parent node in overlap check
                if (node.id === parentNode.id) return false;
                return wouldOverlap(candidatePos, node.position);
                });

                if (!hasOverlap) {
                return candidatePos;
                }
            }

            // If all angles have overlaps, try with a larger radius
            const fallbackRadius = 250;

            for (const angle of angles) {
                const radians = (angle * Math.PI) / 180;
                const candidatePos = {
                x: parentPosition.x + fallbackRadius * Math.cos(radians),
                y: parentPosition.y + fallbackRadius * Math.sin(radians)
                };

                const hasOverlap = existingNodes.some((node: NodeType) => {
                if (node.id === parentNode.id) return false;
                return wouldOverlap(candidatePos, node.position);
                });
                
                if (!hasOverlap) {
                return candidatePos;
                }
            }
            
            // If still no good position, add some random jitter to the best angle
            const randomAngle = Math.random() * 2 * Math.PI;
            return {
                x: parentPosition.x + (fallbackRadius + Math.random() * 50) * Math.cos(randomAngle),
                y: parentPosition.y + (fallbackRadius + Math.random() * 50) * Math.sin(randomAngle)
            };
        };

        const newPosition = calculateOptimalPosition(existingNodes, parentNode);

        const sonarMessage = [
            {
                role: 'system',
                content: `
                You are a specialized AI for expanding knowledge graphs. Given a parent node's content,
                create a new node that goes deeper into one specific aspect of the parent topic.
                
                FORMAT YOUR RESPONSE EXACTLY AS FOLLOWS (in valid JSON format):
                
                {
                  "label": "Concise title for this new node (max 60 chars)",
                  "details": "Detailed explanation with facts, figures, and context (150-200 words)",
                  "sources": [
                        {"url": "https://example.com", "name": "Source Name"}
                  ],
                  "reasoning": "Why this node connects to the parent and how it expands understanding (max 120 chars)",
                  "description": "Brief summary of this specific node (max 150 chars)"
                }
                
                REQUIREMENTS:
                - Focus on ONE specific aspect of the parent node to explore deeper
                - Add new information not covered in the parent node
                - Include 2-4 relevant source links (with valid URLs and descriptive names)
                - have high-quality content with accurate information
                - Make sure content is accurate and educational
                - Format as valid JSON (use double quotes, escape special characters)
                `.trim(),
            },
            {
                role: 'user',
                content: prompt.trim(),
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
            let nodeData;

            try {
                const content = data?.choices?.[0]?.message?.content;
                const jsonMatch = content.match(/\{[\s\S]*\}/);
                const jsonString = jsonMatch ? jsonMatch[0] : content;
                nodeData = JSON.parse(jsonString);
            } catch (parseError) {
                return NextResponse.json(
                    { error: "Failed to parse JSON from Perplexity API" },
                    { status: 500 }
                );
            }

            if (!nodeData) {
                return NextResponse.json(
                    { error: "No valid data returned from Perplexity API" },
                    { status: 500 }
                );
            }

            const newNode = {
                id: newNodeId,
                data: {
                    label: nodeData.label,
                    details: nodeData.details,
                    sources: nodeData.sources || [],
                    reasoning: nodeData.reasoning,
                    description: nodeData.description
                },
                type: "default",
                position: newPosition
            };

            const newEdge = {
                id: `${parentNodeId}-${newNodeId}`,
                source: parentNodeId,
                target: newNodeId,
                animated: false
            };

            const updatedNodes = [...existingNodes, newNode];
            const updatedEdges = [...existingEdges, newEdge];

            const { error: updateError } = await supabase
                .from("knowledge_maps")
                .update({
                    nodes: JSON.stringify(updatedNodes),
                    edges: JSON.stringify(updatedEdges),
                })
                .eq('slug', explorationSlug);

            if (updateError) {
                return NextResponse.json(
                    { error: "Failed to update the knowledge map" },
                    { status: 500 }
                );
            }

            return NextResponse.json({
                message: "Node added successfully",
                newNode,
                newEdge
            });
        } catch (e) {
            return NextResponse.json(
                { error: "Failed to fetch from Perplexity API" },
                { status: 500 }
            );
        }
    } catch (e) {
        return NextResponse.json(
            { error: "An error occurred while processing your request." },
            { status: 500 }
        );
    }
}
