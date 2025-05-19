import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

type AuthOptions = {
  /**
   * Redirect to this URL if user is not authenticated
   */
  redirectTo?: string;
  /**
   * If true, will throw an error if user is not authenticated instead of redirecting
   */
  throwOnUnauthenticated?: boolean;
};

type ServerAuthResult = {
  /**
   * The authenticated user, or null if not authenticated
   */
  user: any | null;
  /**
   * The current session, or null if not authenticated
   */
  session: any | null;
  /**
   * The Supabase client instance
   */
  supabase: ReturnType<typeof createClient>;
  /**
   * Any error that occurred during authentication
   */
  error: Error | null;
};

/**
 * Server-side authentication helper for Next.js App Router
 * 
 * @example
 * // Basic usage - redirects to / if not authenticated
 * const { user, supabase } = await getServerAuth();
 * 
 * @example
 * // With custom redirect
 * const { user, supabase } = await getServerAuth({ redirectTo: "/login" });
 * 
 * @example
 * // Without redirect (for optional authentication)
 * const { user, supabase } = await getServerAuth({ redirectTo: undefined });
 */
export async function getServerAuth(options: AuthOptions = {}): Promise<ServerAuthResult> {
  const { redirectTo = "/", throwOnUnauthenticated = false } = options;
  
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  
  try {
    // Get authenticated user data - this calls the Supabase Auth server to verify
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    const session = null;
    
    if (authError) {
      throw authError;
    }
    
    // If authentication is required but user is not authenticated
    if (!user && redirectTo && !throwOnUnauthenticated) {
      redirect(redirectTo);
    }
    
    if (!user && throwOnUnauthenticated) {
      throw new Error("User is not authenticated");
    }
    
    return { user, session, supabase, error: null };
  } catch (error) {
    console.error("Authentication error:", error);
    
    if (throwOnUnauthenticated) {
      throw error;
    }
    
    if (redirectTo) {
      redirect(redirectTo);
    }
    
    return { 
      user: null, 
      session: null, 
      supabase, 
      error: error instanceof Error ? error : new Error(String(error)) 
    };
  }
}

/**
 * Get the current user without redirecting if not authenticated
 * Useful for pages that work both for authenticated and unauthenticated users
 */
export async function getCurrentUser() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  
  const { data: { user } } = await supabase.auth.getUser();
  return { user, supabase };
}