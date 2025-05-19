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

        const { data: savedMap, error: dbError } = await supabase
            .from("knowledge_maps")
            .insert([
                {
                    slug: slug,
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
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}