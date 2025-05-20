import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export async function DELETE(request: Request) {
    try {
        const cookieStore = cookies();
        const supabase = createClient(cookieStore);

        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { slug } = await request.json();

        if (!slug) {
            return NextResponse.json({ error: "Slug is required" }, { status: 400 });
        }

        const { data: exploration, error: fetchError } = await supabase
            .from("knowledge_maps")
            .select("user_id")
            .eq("slug", slug)
            .single();

        if (fetchError) {
            return NextResponse.json({ error: "Failed to fetch exploration" }, { status: 500 });
        }
        if (!exploration) {
            return NextResponse.json({ error: "Exploration not found" }, { status: 404 });
        }

        if (exploration.user_id !== user.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const { error: deleteError } = await supabase
            .from("knowledge_maps")
            .delete()
            .eq("slug", slug);
        
        if (deleteError) {
            return NextResponse.json({ error: "Failed to delete exploration" }, { status: 500 });
        }

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (e) {
        return NextResponse.json({ error: "Failed to delete question" }, { status: 500 });
    }
}