"use client";

import { useAuth } from "@/context/auth";
import { ExitIcon, GearIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { redirect } from "next/navigation";
import React, { useState, useRef, useEffect } from "react";

export default function User() {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const { user, signOut } = useAuth(); 

    const handleSignOut = async (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        setOpen(false);

        setTimeout(async () => {
            try {
                await signOut();
                redirect("/");
            } catch (e) {
                console.error("Error signing out:", e);
            }
        }, 0);
    }

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div ref={ref} className="relative inline-block">
            <button 
                onClick={() => setOpen((o) => !o)} 
                className="border border-neutral-200 rounded-2xl cursor-pointer"
            >
            <div className="m-0.5 w-7 h-7 rounded-full bg-gradient-to-bl from-[#ffe4e6] to-[#ccfbf1] ">
                <span className="sr-only">
                User Menu
                </span>
            </div>
            </button>
            {open && (
            <div
                className="absolute right-0 mt-1 w-54 z-10 bg-white border border-neutral-200 rounded-md shadow-md p-1"
            >
                <button className="w-full text-left px-2 py-3 text-sm text-gray-700 flex flex-col items-start border-b border-b-neutral-200">
                    <span className="text-xs text-gray-500">Logged in as</span>
                    <span className="font-semibold text-sm w-full truncate">
                        {user?.email}
                    </span>
                </button>
                <Link href="/dashboard/user">
                    <button 
                        className="cursor-pointer w-full flex items-center text-left mt-1 px-3 py-2 text-sm text-neutral-700 rounded-md hover:bg-neutral-100"
                        onClick={() => setOpen(false)}
                    >
                        <GearIcon className="inline-block mr-2" />
                        Settings
                    </button>
                </Link>

                <button 
                    className="flex items-center w-full text-left px-3 py-2 text-sm text-red-500 rounded-md hover:bg-red-50 cursor-pointer"
                    onClick={handleSignOut}
                >
                    <ExitIcon className="inline-block mr-2" />
                    Sign out
                </button>
            </div>
            )}
        </div>
    );
}