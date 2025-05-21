import DeleteExploration from "@/components/dashboard/delete";
import Explore from "@/components/dashboard/explore";
import { createClient } from "@/utils/supabase/server";
import { CommitIcon, DotFilledIcon, OpenInNewWindowIcon } from "@radix-ui/react-icons";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

type Node = {
  id: string;
  data: {
    label: string;
    details: string;
    sources: { url: string; name: string }[];
    reasoning: string;
    description: string;
  };
  type: string;
  position: { x: number; y: number };
};

type Edge = {
  id: string;
  source: string;
  target: string;
  label?: string;
};

type Exploration = {
  id: string;
  title: string;
  slug: string;
  description: string;
  created_at: string;
  nodes: string | Node[]; // might be a string you need to parse
  edges: string | Edge[];
};

export default async function Dashboard() {
    const cookieStore = cookies();
    
    const supabase = createClient(cookieStore);
    
    const { data: { user } } = await supabase.auth.getUser();
    
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

    let parsedExplorations: Exploration[] = [];
    if (explorations) {
        parsedExplorations = explorations.map((exploration) => {
            let nodes: Node[] = [];
            let edges: Edge[] = [];

            try {
                nodes = typeof exploration.nodes === "string" ? JSON.parse(exploration.nodes) : exploration.nodes;
            } catch (e) {
                console.error("Failed to parse nodes", e);
            }

            try {
                edges = typeof exploration.edges === "string" ? JSON.parse(exploration.edges) : exploration.edges;
            } catch (e) {
                console.error("Failed to parse edges", e);
            }

            return {
                ...exploration,
                nodes,
                edges,
            };
        });
    }
    explorations = parsedExplorations;

    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-end">
                <Explore />
            </div>
            {
                explorations && explorations.length > 0 ? (
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
                        {explorations.map((exploration: Exploration) => (
                            <div
                                key={exploration.id} 
                                className="group relative border border-neutral-200 hover:bg-neutral-50 hover:shadow-sm rounded-lg pl-4 py-4 flex flex-row lg:flex-col h-full"
                            >
                                {/* Delete button outside the Link */}
                                <div className="absolute top-0 right-0 p-2 hidden lg:group-hover:flex">
                                    <DeleteExploration explorationId={exploration.slug} />
                                </div>
                                
                                {/* Link wraps only the content */}
                                <Link
                                    href={`/dashboard/explore/${exploration.slug}`}
                                    className="flex flex-col flex-grow pr-2"
                                >
                                    <h3 className="text-lg font-medium leading-5">{exploration.title}</h3>
                                    <p className="text-sm text-neutral-600 leading-4 my-3">{exploration.description}</p>
                                    <div className="w-full flex items-center justify-between mt-auto">
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
                                <div className="flex lg:hidden flex-col items-center justify-around pl-2 pr-1 border-l border-neutral-200 h-full">
                                    <DeleteExploration explorationId={exploration.slug} />
                                    <div
                                        className="mx-1 w-full border-t border-neutral-200"
                                    />
                                    <Link
                                        href={`/dashboard/explore/${exploration.slug}`}
                                        className="border-neutral-200 text-neutral-400 hover:text-neutral-600 transition-colors duration-200 ease-in-out"
                                        target="_blank"
                                    >
                                        <OpenInNewWindowIcon className="w-5 h-5" />
                                    </Link>
                                </div>
                            </div>
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