"use client";

import { useState } from "react";
import SignIn from "./signin";
import Link from "next/link";
import { useAuth } from "@/context/auth";

export default function UserAuthButton() {
  const { user, isLoading } = useAuth(); 
  const [isOpen, setIsOpen] = useState(false);

  const handleOnClick = () => {
    if (!user) {
      setIsOpen(true);
    }
  }

  return (
    <>
      <button
        disabled={isLoading}
        onClick={handleOnClick}
        className="text-sm text-center rounded-lg bg-neutral-200/70 w-[5.5rem] px-3 py-1 text-neutral-950 cursor-pointer"
      >
        {
          user ? (
            <Link href="/dashboard" className="w-full">
              Dashboard
            </Link>
          ) : (
            <span className="w-full">Sign in</span>
          )
        }
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30"
          onClick={() => setIsOpen(false)}
        >
          <dialog
            open
            className="fixed top-1/2 left-1/2 z-50 w-[90vw] max-w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-4 shadow-lg"
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
          </dialog>
        </div>
      )}
    </>
  )
}