"use client";

import { useState } from "react";
import SignIn from "./signin";
import Link from "next/link";
import { useAuth } from "@/context/auth";

export default function UserAuthButton() {
  const { user, isLoading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {user ? (
        <Link
          href="/dashboard"
          className="text-sm text-center rounded-lg bg-neutral-200/70 w-[5.5rem] px-3 py-1 text-neutral-950 cursor-pointer block"
        >
          Dashboard
        </Link>
      ) : (
        <button
          disabled={isLoading}
          onClick={() => setIsOpen(true)}
          className="text-sm text-center rounded-lg bg-neutral-200/70 w-[5.5rem] px-3 py-1 text-neutral-950 cursor-pointer"
        >
          Sign in
        </button>
      )}

      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 flex items-center justify-center"
          onClick={() => setIsOpen(false)}
          aria-modal="true"
          role="dialog"
        >
          <div
            className="relative w-[90vw] max-w-[500px] rounded-lg bg-white p-4 shadow-lg"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-4 text-xl text-neutral-400 hover:text-neutral-700"
              onClick={() => setIsOpen(false)}
              aria-label="Close"
              type="button"
            >
              &#215;
            </button>
            <SignIn onAuthSuccess={() => setIsOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
