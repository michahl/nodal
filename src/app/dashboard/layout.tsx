import type { Metadata } from "next";
import "../globals.css";
import Link from "next/link";
import User from "@/components/dashboard/user";
import { getServerAuth } from "@/context/serverAuth";

export const metadata: Metadata = {
  title: "dashboard | nodal",
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }){
  const { } = await getServerAuth({ 
    redirectTo: "/" 
  });

  return (
    <div className="relative mx-auto flex h-dvh w-full max-w-6xl flex-col px-6 md:px-8 lg:px-12">
      <header className="flex items-center justify-between py-8">
        <div className="flex gap-2">
          <Link href="/">
            <span className="text-neutral-950">nodal</span>
          </Link>
          /
          <Link href="/dashboard">
            <span className="text-neutral-950  underline underline-offset-5 decoration-wavy decoration-neutral-950">dashboard</span>
          </Link>
        </div>
        <nav className="flex gap-4">
          <User />
        </nav>
      </header>
      <main className="flex-1">{children}</main>
      <footer>
        <div className="flex flex-col items-center justify-center pb-8">
            <p className="mb-2 text-sm text-neutral-500 italic">AI-generated content may contain errors. Please verify important information.</p>
          <div>
            <span className="text-sm text-neutral-800">
              Made by
              <a
                href="https://github.com/michahl"
                target="_blank"
                rel="noopener noreferrer"
                className="mx-1 rounded-full bg-neutral-100 px-2 py-1 text-neutral-950 hover:text-neutral-800"
              >
                @michahl
              </a>
              powered by <a href="https://sonar.perplexity.ai/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">Sonar</a>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};