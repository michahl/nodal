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
        const { nodeId, explorationSlug } = body;

        if (!nodeId || !explorationSlug) {
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
        
        // Check if this is the first node (root node)
        if (nodeId === existingNodes[0]?.id) {
            return NextResponse.json(
                { error: "The root node cannot be deleted" },
                { status: 400 }
            );
        }
        
        // Find all descendent nodes (nodes connected to this one)
        const nodesToDelete = new Set([nodeId]);
        let edgesToDelete = new Set();
        
        // Helper function to find all descendant nodes
        const findDescendants = (nodeId: string) => {
            const outgoingEdges = existingEdges.filter((edge: any) => edge.source === nodeId);
            
            for (const edge of outgoingEdges) {
                edgesToDelete.add(edge.id);
                
                // If we haven't processed this target node yet
                if (!nodesToDelete.has(edge.target)) {
                    nodesToDelete.add(edge.target);
                    findDescendants(edge.target);
                }
            }
            
            // Also delete incoming edges to this node
            const incomingEdges = existingEdges.filter((edge: any) => edge.target === nodeId);
            for (const edge of incomingEdges) {
                edgesToDelete.add(edge.id);
            }
        };
        
        // Find all descendants of the node to be deleted
        findDescendants(nodeId);
        
        // Filter out the nodes and edges to delete
        const updatedNodes = existingNodes.filter((node: any) => !nodesToDelete.has(node.id));
        const updatedEdges = existingEdges.filter((edge: any) => !edgesToDelete.has(edge.id));
        
        // Update the database
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
            message: "Node(s) deleted successfully",
            deletedNodes: Array.from(nodesToDelete),
            deletedEdges: Array.from(edgesToDelete)
        });
    } catch (e) {
        console.error("Error deleting node:", e);
        return NextResponse.json(
            { error: "An error occurred while processing your request." },
            { status: 500 }
        );
    }
}