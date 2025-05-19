import { createClient } from "@/utils/supabase/server";
import { CommitIcon, DotFilledIcon, PlusIcon } from "@radix-ui/react-icons";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

type Exploration = {
  id: string;
  title: string;
  description: string;
  slug: string;
  nodes: string;
  edges: string;
  created_at: Date;
  user_id: string;
};

export default async function Dashboard() {
    const cookieStore = cookies();
    
    const supabase = createClient(cookieStore);
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    let explorations = null;
    let error = null;

    if (!user) {
        redirect("/");
    }
    
    if (user) {
        const response = await supabase
        .from('knowledge_maps')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
        explorations = response.data;
        error = response.error;
    }
    
    if (error) {
        console.error("Error fetching explorations:", error);
    }

    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-end">
                <button className="flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 rounded px-4 py-1 cursor-pointer">
                    <PlusIcon className="w-3.5 h-3.5" />
                    <span className="text-sm">Explore</span>
                </button>
            </div>
            {
                explorations && explorations.length > 0 ? (
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {explorations.map((exploration: Exploration) => (
                            <Link
                                href={`/dashboard/explore/${exploration.slug}`}
                                key={exploration.id} 
                                className="border border-neutral-200 hover:bg-neutral-50 hover:shadow-sm rounded-lg px-4 py-4"
                            >
                                <h3 className="text-lg font-medium leading-5">{exploration.title}</h3>
                                <p className="text-sm text-neutral-600 leading-4 my-3">{exploration.description}</p>
                                <div className="w-full flex items-center justify-between">
                                    <span className="text-xs text-neutral-400">{new Date(exploration.created_at).toLocaleDateString("en-GB")}</span>
                                    <div className="text-xs flex items-center gap-2 text-neutral-400">
                                        <div className="flex items-center gap-1">
                                            <DotFilledIcon className="w-3.5 h-3.5 text-neutral-400 inline-block" />
                                            {exploration.nodes.length}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <CommitIcon className="w-3.5 h-3.5 text-neutral-400 inline-block rotate-90" />
                                            {exploration.edges.length}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center">
                        <span className="text-neutral-600 text-center">Every journey starts with a question. What will yours be?</span>
                    </div>
                )
            }
        </div>
    )
}