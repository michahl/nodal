"use client";

import { useAuth } from "@/context/auth";
import { PlusIcon } from "@radix-ui/react-icons";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function Dashboard() {
    const { user, isLoading } = useAuth(); 

    useEffect(() => {
        if (!user) {
            redirect("/");
        }
    }, [user]);
    
    if (isLoading) {
        return <div>Loading...</div>;
    }
    

    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-end">
                <button className="flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 rounded px-4 py-1 cursor-pointer">
                    <PlusIcon className="w-3.5 h-3.5" />
                    <span className="text-sm">Explore</span>
                </button>
            </div>
            <div className="h-full flex flex-col items-center justify-center">
                <span className="text-neutral-600 text-center">Every journey starts with a question. What will yours be?</span>
            </div>
        </div>
    )
}