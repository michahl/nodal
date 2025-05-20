"use client";

import { CheckIcon, Cross2Icon } from "@radix-ui/react-icons";
import { Delete } from "../ui/delete";
import { toast } from "../ui/sonar";
import { useRouter } from "next/navigation";

export default function DeleteExploration({ explorationId }: { explorationId: string }) {
    const router = useRouter();

    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!confirm("Are you sure you want to delete this?")) {
            return;
        }

        try {
            const response = await fetch("/api/question/delete", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ slug: explorationId }),
            });

            if (!response.ok) {
                throw new Error("Failed to delete exploration");
            }

            toast.success("", {
                description: "Exploration deleted successfully",
                duration: 5000,
                dismissible: false,
                icon: <CheckIcon className="text-green-500 w-4 h-4" />,
            });

            router.refresh();
        } catch (e) {
            toast.success("", {
                description: "Failed to delete exploration",
                duration: 5000,
                dismissible: false,
                icon: <Cross2Icon className="text-red-500 w-4 h-4" />,
            });
        }
    }

    return (
        <button
            onClick={handleDelete}
            className="cursor-pointer"
            aria-label="Delete exploration"
        >
            <Delete className="text-red-500" width={18} height={18} stroke="currentColor" strokeWidth={1.5} />
        </button>
    )
}

