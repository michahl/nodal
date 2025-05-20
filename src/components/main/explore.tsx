"use client";

import { useState, useEffect, useRef } from "react";
import { CheckIcon, Cross2Icon } from "@radix-ui/react-icons";
import { Dialog, DialogContent, DialogDescription, DialogContext } from "../ui/dialog";
import { useRouter } from "next/navigation";
import { toast } from "../ui/sonar";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/auth";
import SignIn from "@/components/auth/signin"; // Import the SignIn component

export default function Explore() {
    const router = useRouter();
    const [step, setStep] = useState(0);
    const [question, setQuestion] = useState("");
    const [showAuthDialog, setShowAuthDialog] = useState(false);
    
    // Create refs to store dialog methods
    const processingDialogRef = useRef<{openDialog?: () => void; closeDialog?: () => void}>({});
    const authDialogRef = useRef<{openDialog?: () => void; closeDialog?: () => void}>({});
    
    const { user } = useAuth();

    // Handle processing dialog visibility based on step
    useEffect(() => {
        if (step > 0) {
            // When stepping up, open dialog with a slight delay to ensure context is ready
            setTimeout(() => processingDialogRef.current.openDialog?.(), 10);
        } else {
            // When stepping down to 0, close dialog
            processingDialogRef.current.closeDialog?.();
        }
    }, [step]);

    // Handle auth dialog visibility
    useEffect(() => {
        if (showAuthDialog) {
            setTimeout(() => authDialogRef.current.openDialog?.(), 10);
        } else {
            authDialogRef.current.closeDialog?.();
        }
    }, [showAuthDialog]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!user) {
            // Show auth dialog instead of toast
            setShowAuthDialog(true);
            return;
        }

        if (question.length < 5) {
            toast.error("", {
                description: "Please enter a valid question",
                duration: 5000,
                dismissible: false,
                icon: <Cross2Icon className="text-red-500 w-4 h-4" />,
            });
            return;
        }

        setStep(1);

        try {
            const response = await fetch("/api/question/check", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userInput: question,
                }),
            });

            const data = await response.json();

            if (data.error) {
                toast.error("", {
                    description: data.error,
                    duration: 5000,
                    dismissible: false,
                    icon: <Cross2Icon className="text-red-500 w-4 h-4" />,
                })
                setStep(0);
                return;
            }

            if (!data.isValid) {
                toast.error("", {
                    description: "Your question is not valid",
                    duration: 5000,
                    dismissible: false,
                    icon: <Cross2Icon className="text-red-500 w-4 h-4" />,
                });
                setStep(0);
                return;
            }

            setStep(2);

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
                toast.error("", {
                    description: graphData.error,
                    duration: 5000,
                    dismissible: false,
                    icon: <Cross2Icon className="text-red-500 w-4 h-4" />,
                });
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
                toast.error("", {
                    description: "Failed to generate graph",
                    duration: 5000,
                    dismissible: false,
                    icon: <Cross2Icon className="text-red-500 w-4 h-4" />,
                });
                setStep(0);
                return;
            }
        } catch (e) {
            toast.error("", {
                description: "An error occurred while checking your question",
                duration: 5000,
                dismissible: false,
                icon: <Cross2Icon className="text-red-500 w-4 h-4" />,
            });
            setStep(0);
            return;
        }
    };

    // Handle successful authentication
    const handleAuthSuccess = () => {
        setShowAuthDialog(false);
        
        // Slight delay to allow dialog to close before proceeding
        setTimeout(() => {
            if (question.length >= 5) {
                // Auto-submit the form after successful authentication
                handleSubmit({ preventDefault: () => {} } as React.FormEvent<HTMLFormElement>);
            }
        }, 300);
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
                    className="cursor-pointer text-neutral-50 border border-neutral-800 bg-neutral-800 px-4 py-1.5 rounded-r-lg hover:bg-neutral-600 hover:border-neutral-600"
                >
                    Explore
                </button>
            </form>

            {/* Processing Dialog */}
            <DialogProviderWithRef ref={processingDialogRef}>
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
            </DialogProviderWithRef>

            {/* Authentication Dialog */}
            <DialogProviderWithRef ref={authDialogRef}>
                <AnimatePresence>
                    <DialogContext.Consumer>
                        {(context) => {
                            if (!context) return null;
                            const { isOpen } = context;
                            return (
                                isOpen && (
                                    <motion.div
                                        key="auth-dialog"
                                        initial={{ opacity: 0, scale: 0.96, y: 20 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.96, y: 20 }}
                                        transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                                    >
                                        <DialogContent
                                            closeOnOverlayClick={true}
                                            showCloseButton={true}
                                            className="max-w-md"
                                            onClose={() => setShowAuthDialog(false)}
                                        >
                                            <SignIn onAuthSuccess={handleAuthSuccess} />
                                        </DialogContent>
                                    </motion.div>
                                )
                            );
                        }}
                    </DialogContext.Consumer>
                </AnimatePresence>
            </DialogProviderWithRef>
            
        </>
    );
}

// Custom forwardRef implementation of DialogProvider to expose dialog methods
import React, { forwardRef, useImperativeHandle } from "react";

const DialogProviderWithRef = forwardRef(({ children }: { children: React.ReactNode }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    
    const openDialog = () => setIsOpen(true);
    const closeDialog = () => setIsOpen(false);
    
    // Expose methods via ref
    useImperativeHandle(ref, () => ({
        openDialog,
        closeDialog
    }));
    
    return (
        <DialogContext.Provider value={{ isOpen, openDialog, closeDialog, toggleDialog: () => setIsOpen(prev => !prev) }}>
            {children}
        </DialogContext.Provider>
    );
});
DialogProviderWithRef.displayName = 'DialogProviderWithRef';