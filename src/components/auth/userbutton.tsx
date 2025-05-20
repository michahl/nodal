"use client";

import { useState } from "react";
import SignIn from "./signin";
import Link from "next/link";
import { useAuth } from "@/context/auth";
import { motion } from "framer-motion";
import { AnimatePresence } from "motion/react";

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

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Background overlay with fade animation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/30 flex items-center justify-center"
              onClick={() => setIsOpen(false)}
              aria-modal="true"
              role="dialog"
            >
              {/* Modal with scale and fade animation */}
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ 
                  type: "spring",
                  stiffness: 300,
                  damping: 25
                }}
                className="relative w-[90vw] max-w-[500px] rounded-lg bg-white p-4 shadow-lg"
                onClick={e => e.stopPropagation()}
              >
                {/* Close button with hover animation */}
                <motion.button
                  className="absolute top-2 right-4 text-xl text-neutral-400 hover:text-neutral-700"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close"
                  type="button"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  &#215;
                </motion.button>
                
                {/* SignIn component */}
                <SignIn onAuthSuccess={() => setIsOpen(false)} />
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
