import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ExploreClient from "@/components/explore/explore";
import { getServerAuth } from "@/context/serverAuth";

export default async function ExplorePage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;
  const { user } = await getServerAuth({ 
      redirectTo: "/" 
    });
  
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  
  const { data: exploration, error } = await supabase
    .from('knowledge_maps')
    .select('*')
    .eq('slug', slug)
    .single();
  
  if (error || !exploration) {
    redirect("/dashboard");
  }

  if (exploration.user_id !== user.id) {
    redirect("/dashboard");
  }
  
  return <ExploreClient initialData={exploration} />;
}