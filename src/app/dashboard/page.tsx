"use client";

import { useAuth } from "@/context/auth";
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
        <div>
            dashboard
        </div>
    )
}