"use client";

import { useState } from "react";
import { Cross2Icon, TrashIcon } from "@radix-ui/react-icons";
import { toast } from "../ui/sonar";

interface DeleteNodeButtonProps {
  nodeId: string;
  explorationSlug: string;
  isRootNode: boolean;
  onDeleteSuccess: (deletedNodes: string[], deletedEdges: string[]) => void;
  className?: string;
}

export default function DeleteNodeButton({
  nodeId,
  explorationSlug,
  isRootNode,
  onDeleteSuccess,
  className = ""
}: DeleteNodeButtonProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    if (isRootNode) {
        return null;
    }

    const handleDelete = async () => {
        if (isDeleting) return;

        if(!confirm("Are you sure you want to delete this node?")) {
            return;
        }

        setIsDeleting(true);

        try {
            const response = await fetch(`/api/question/node/delete`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nodeId,
                    explorationSlug
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                toast.error("", {
                    description: errorData.error || "Failed to delete node",
                    duration: 5000,
                    dismissible: false,
                    icon: <Cross2Icon className="text-red-500 w-4 h-4" />
                });
                return;
            }

            const { deletedNodes, deletedEdges } = await response.json();
            onDeleteSuccess(deletedNodes, deletedEdges);

            toast.success("", {
                description: "Node deleted successfully",
                duration: 5000,
                dismissible: false,
                icon: <TrashIcon className="text-green-500 w-4 h-4" />
            });

        } catch (e) {
            toast.error("", {
                description: "Failed to delete node",
                duration: 5000,
                dismissible: false,
                icon: <Cross2Icon className="text-red-500 w-4 h-4" />
            });
        } finally {
            setIsDeleting(false);
        }
    }

    return (
        <>
            <button
                onClick={handleDelete}
                disabled={isDeleting}
                aria-label="Delete node"
                className={`cursor-pointer transition-colors duration-200 ease-in-out
                    text-sm flex items-center justify-center gap-2 px-2 py-1  text-red-700/50 hover:text-red-400 bg-red-50 rounded-md
                `}
            >
                <TrashIcon className="h-5 w-5" />
                
            </button>
        </>
    )

} 