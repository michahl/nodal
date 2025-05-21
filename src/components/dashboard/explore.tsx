"use client";

import { useState } from "react";

import { CheckIcon, PlusIcon } from "@radix-ui/react-icons";
import { Dialog, DialogContent, DialogDescription, DialogTrigger } from "../ui/dialog";
import { useRouter } from "next/navigation";
import { toast } from "../ui/sonar";

export default function Explore() {
    const router = useRouter();
    
    const [step, setStep] = useState(0);
    const [question, setQuestion] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>,
    ) => {
        e.preventDefault();
        if (question.length < 5) {
            setError("Please enter a question");
            return;
        }

        setStep(1);
        setError("");

        try {
            const response = await fetch("/api/question/check", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userInput: question,
                }),
            })

            const data = await response.json();

            if (data.error) {
                setError(data.error);
                setStep(0);
                return;
            }

            if (!data.isValid) {
                setError("Your question is not valid");
                setStep(0);
                return;
            }

            setStep(2);
            setError("");

            const graphResponse = await fetch("/api/question/generate-graph", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    question: question,
                }),
            });

            const graphData = await graphResponse.json();

            if (graphData.error) {
                setError(graphData.error);
                setStep(0);
                return;
            }

            if (graphData.slug) {
                setStep(0);
                toast.success("", {
                    description: "Graph generated successfully",
                    duration: 5000,
                    dismissible: false,
                    icon: <CheckIcon className="text-green-500 w-4 h-4" />,
                });
                router.push(`/dashboard/explore/${graphData.slug}`);
            } else {
                setError("Failed to generate graph");
                setStep(0);
                return;
            }
        } catch (e) {
            setError("An error occurred while checking your question");
            setStep(0);
            return;
        }
    }

    return (
        <Dialog>
            <DialogTrigger>
                <button  className="flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 rounded px-4 py-1 cursor-pointer">
                    <PlusIcon className="w-3.5 h-3.5" />
                    <span className="text-sm">Explore</span>
                </button>

            </DialogTrigger>

            <DialogContent>
                <DialogDescription className="mt-2">
                    {
                        step === 0 && (
                            <form onSubmit={handleSubmit}>
                                <label 
                                    htmlFor="explore"
                                    className="block text-sm text-neutral-900/80"
                                >
                                    Enter your question
                                </label>
                                <input
                                    type="text"
                                    id="explore"
                                    value={question}
                                    onChange={(e) => setQuestion(e.target.value)}
                                    placeholder="What do you want to explore?"
                                    className={`
                                        ${error ? "border-red-500" : "border-neutral-200"}
                                        w-full py-1.5 px-4 border rounded text-sm focus:outline-none
                                    `}
                                />
                                {
                                    error && (
                                        <p className="text-red-500 text-xs text-end">
                                            {error}
                                        </p>
                                    )
                                }
                                <button
                                    type="submit"
                                    disabled={question.length < 1}
                                    className={`
                                        disabled:opacity-50
                                        not-disabled:cursor-pointer
                                        text-sm w-full mt-1 py-1 rounded-md bg-neutral-800 hover:bg-neutral-600 text-neutral-50
                                    `}
                                >
                                    Explore
                                </button>
                            </form>
                        )
                    }
                    {
                        step === 1 && (
                            <div className="flex justify-center items-center gap-2">
                                <div className="animate-spin inline-block size-5 border-3 border-current border-t-transparent text-neutral-300 rounded-full" role="status" aria-label="loading">
                                    <span className="sr-only">Loading...</span>
                                </div>
                                <span className="text-sm text-neutral-500">Analyzing your question</span>
                            </div>
                        )
                    }
                    {
                        step === 2 && (
                            <div className="w-full flex justify-center items-center">
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center gap-2">
                                        <CheckIcon className="w-5 h-5 text-green-500" />
                                        <span className="text-sm text-neutral-500">Question is valid</span>
                                    </div>
                                    <div className="flex items-center gap-2.5">
                                        <div className="animate-spin inline-block size-4 border-2 border-current border-t-transparent text-neutral-300 rounded-full" role="status" aria-label="loading">
                                            <span className="sr-only">Loading...</span>
                                        </div>
                                        <span className="text-sm text-neutral-500">Generating your graph</span>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </DialogDescription>
            </DialogContent>
        </Dialog>
    )
}