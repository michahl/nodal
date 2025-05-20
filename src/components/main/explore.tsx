"use client";

import { useState, useEffect } from "react";
import { CheckIcon, Cross2Icon } from "@radix-ui/react-icons";
import { Dialog, DialogContent, DialogDescription } from "../ui/dialog";
import { useRouter } from "next/navigation";
import { toast } from "../ui/sonar";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/auth";

export default function Explore() {
    const router = useRouter();
    const [step, setStep] = useState(0);
    const [question, setQuestion] = useState("");
    const [error, setError] = useState("");
    const [dialogOpen, setDialogOpen] = useState(false);

    const { user } = useAuth();

    useEffect(() => {
        setDialogOpen(step > 0);
    }, [step]);

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>,
    ) => {
        e.preventDefault();
        if (question.length < 5) {
            return;
        }

        if (!user) {
            toast.error("", {
                description: "Please sign in to use this function!",
                duration: 5000,
                dismissible: false,
                icon: <Cross2Icon className="text-red-500 w-4 h-4" />,
            })
            return;
        }

        setStep(1);
        setDialogOpen(true);
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
                setDialogOpen(false);
                return;
            }

            if (!data.isValid) {
                setError("Your question is not valid");
                setStep(0);
                setDialogOpen(false);
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
                setDialogOpen(false);
                return;
            }

            if (graphData.slug) {
                setStep(0);
                setDialogOpen(false);
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
                setDialogOpen(false);
                return;
            }
        } catch (e) {
            setError("An error occurred while checking your question");
            setStep(0);
            setDialogOpen(false);
            return;
        }
    }
    
    // Function to handle dialog close
    const handleDialogClose = () => {
        setDialogOpen(false);
        // Optional: Reset step if dialog is manually closed
        setStep(0);
    };

    return (
        <>
            <form className="flex items-center" onSubmit={handleSubmit}>
                <input 
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    className="w-full border border-neutral-200 px-3 py-1.5 rounded-l-lg focus:outline-none"
                    placeholder="eg. How money inflation works?"
                />
                <button 
                    type="submit"
                    className="text-neutral-50 border border-neutral-800 bg-neutral-800 px-4 py-1.5 rounded-r-lg hover:bg-neutral-600 hover:border-neutral-600"
                >
                    Explore
                </button>
            </form>

            {/* Dialog implementation with proper context provider */}
            <Dialog>
                {dialogOpen && (
                    <DialogContent
                        closeOnOverlayClick={false}
                        showCloseButton={false}
                        className="max-w-sm"
                    >
                        <DialogDescription className="mt-2">
                            <AnimatePresence mode="wait">
                                {step === 1 && (
                                    <motion.div
                                        key="step1"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                        className="flex justify-center items-center gap-2 py-4"
                                    >
                                        <div className="animate-spin inline-block size-5 border-3 border-current border-t-transparent text-neutral-300 rounded-full" role="status" aria-label="loading">
                                            <span className="sr-only">Loading...</span>
                                        </div>
                                        <span className="text-sm text-neutral-500">Analyzing your question</span>
                                    </motion.div>
                                )}
                                
                                {step === 2 && (
                                    <motion.div
                                        key="step2"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                        className="w-full flex justify-center items-center py-4"
                                    >
                                        <div className="flex flex-col gap-3">
                                            <motion.div 
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.1 }}
                                                className="flex items-center gap-2"
                                            >
                                                <CheckIcon className="w-5 h-5 text-green-500" />
                                                <span className="text-sm text-neutral-500">Question is valid</span>
                                            </motion.div>
                                            <motion.div 
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.3 }}
                                                className="flex items-center gap-2.5"
                                            >
                                                <div className="animate-spin inline-block size-4 border-2 border-current border-t-transparent text-neutral-300 rounded-full" role="status" aria-label="loading">
                                                    <span className="sr-only">Loading...</span>
                                                </div>
                                                <span className="text-sm text-neutral-500">Generating your graph</span>
                                            </motion.div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </DialogDescription>
                    </DialogContent>
                )}
            </Dialog>
            
            {error && (
                <div className="text-red-500 text-sm mt-2">{error}</div>
            )}
        </>
    )
}