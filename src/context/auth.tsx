"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isSessionExpired: boolean;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSessionExpired, setIsSessionExpired] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const refreshSession = async (): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        setIsSessionExpired(true);
        setSession(null);
        setUser(null);
        setIsLoading(false);
        return false;
      }
      if (!data.session) {
        setIsSessionExpired(false);
        setSession(null);
        setUser(null);
        setIsLoading(false);
        return false;
      }
      setSession(data.session);
      setUser(data.session.user);
      setIsSessionExpired(false);
      setIsLoading(false);
      return true;
    } catch (error) {
      setIsSessionExpired(true);
      setIsLoading(false);
      return false;
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      await refreshSession();
    };
    initAuth();
    const intervalId = setInterval(() => {
      refreshSession();
    }, 5 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        switch (event) {
          case 'SIGNED_IN':
            setSession(newSession);
            setUser(newSession?.user ?? null);
            setIsSessionExpired(false);
            router.refresh();
            break;
          case 'SIGNED_OUT':
            setSession(null);
            setUser(null);
            setIsSessionExpired(false);
            router.refresh();
            break;
          case 'TOKEN_REFRESHED':
            setSession(newSession);
            setUser(newSession?.user ?? null);
            setIsSessionExpired(false);
            break;
          case 'USER_UPDATED':
            setSession(newSession);
            setUser(newSession?.user ?? null);
            break;
        }
        setIsLoading(false);
      }
    );
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase, router]);

  const signOut = async () => {
    try {
      const sessionResult = await refreshSession();
      if (!sessionResult) {
        setUser(null);
        setSession(null);
        setIsSessionExpired(false);
        router.refresh();
        return;
      }
      const { error } = await supabase.auth.signOut();
      if (error) {
        setUser(null);
        setSession(null);
        router.refresh();
        return;
      }
      setUser(null);
      setSession(null);
      setIsSessionExpired(false);
    } catch (error) {
      setUser(null);
      setSession(null);
      router.refresh();
    }
  };

  useEffect(() => {
    if (isSessionExpired && !isLoading) {
      signOut();
    }
  }, [isSessionExpired, isLoading]);

  const value = {
    user,
    session,
    isLoading,
    isSessionExpired,
    signOut,
    refreshSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
