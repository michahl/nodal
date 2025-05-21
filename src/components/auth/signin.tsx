"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { CheckIcon } from "@radix-ui/react-icons";
import { toast } from "../ui/sonar";
import { motion } from "framer-motion";

const LoadingSpinner = () => {
    return (
        <svg aria-hidden="true" className="w-5 h-5 text-neutral-200 animate-spin dark:text-neutral-600 fill-neutral-200" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
        </svg>
    )
}

export default function SignIn({ onAuthSuccess }: { onAuthSuccess?: () => void }) {
    const [login, setLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [indicator, setIndicator] = useState(0);

    const supabase = createClient();

    useEffect(() => {
        setIndicator(login ? 0 : 98);
    }, [login])

    const handleSignInSubmit = async () => {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
            return;
        }

        toast.success("", {
            description: "Signed in successfully",
            duration: 5000,
            dismissible: false,
            icon: <CheckIcon className="text-green-500 w-4 h-4" />,
        });
        onAuthSuccess?.();
    };

    const handleSignUpSubmit = async () => {
        const { error } = await supabase.auth.signUp({
            email: email,
            password: password,
        });

        if (error) {
            if (error.status === 422) {
                setError("Password is too weak. Please choose a stronger password.");
                return;
            }
            setError(error.message);
            return;
        }
        toast.success("", {
            description: "Check your email for a confirmation link.",
            duration: 5000,
            dismissible: false,
            icon: <CheckIcon className="text-green-500 w-4 h-4" />,
        });
        onAuthSuccess?.();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (login) {
            await handleSignInSubmit();
        } else {
            await handleSignUpSubmit();
        }

        
        setLoading(false);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="mt-5"
        >
            <div className="w-full relative bg-neutral-200/40 p-1 rounded-lg">
                <motion.div 
                    className="absolute top-1 bottom-1 w-[calc(50%-2px)] bg-neutral-800 rounded-md z-0"
                    animate={{ x: `${indicator}%` }}
                    transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                        duration: 0.3,
                    }}
                />

                <div className="grid grid-cols-2 relative z-10">
                    <button
                        type="button"
                        onClick={() => setLogin(true)}
                        className={`${login ? "text-neutral-50" : "text-black"} relative z-10 rounded-md py-1 transition-colors duration-200`}
                    >
                        Sign in
                    </button>
                    
                    <button
                        type="button"
                        onClick={() => setLogin(false)}
                        className={`${!login ? "text-neutral-50" : "text-black"} relative z-10 rounded-md py-1 transition-colors duration-200`}
                    >
                        Create account
                    </button>
                </div>
            </div>

            {
                login ? (
                    <div className="mt-3">
                        <label 
                            htmlFor="email-login"
                            className="block px-1 text-sm font-medium text-neutral-700"
                        >
                            Enter your email
                        </label>
                        <input 
                            required
                            type="email" 
                            id="email-login"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="x@example.com"
                            className="w-full text-sm px-2 py-1.5 border border-neutral-200 rounded-md"
                        />

                        <label 
                            htmlFor="password-login"
                            className="block px-1 text-sm font-medium text-neutral-700 mt-2"
                        >
                            Enter your password
                        </label>
                        <input 
                            required
                            type="password" 
                            id="password-login"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="********"
                            className="w-full text-sm px-2 py-1.5 border border-neutral-200 rounded-md"
                        />

                        <button
                            type="submit"
                            className="flex items-center justify-center w-full mt-3 bg-neutral-800 text-neutral-50 rounded-md min-h-9 py-1.5 hover:bg-neutral-700 cursor-pointer"
                            disabled={loading}
                        >
                            {loading ? <LoadingSpinner /> : "Sign in"}
                        </button>
                        {
                            error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }} 
                                    className="mt-2 text-sm text-red-500"
                                >
                                    {error}
                                </motion.div>
                            )
                        }
                    </div>
                ) : (
                    <div className="mt-3">
                        <label 
                            htmlFor="email-signup"
                            className="block px-1 text-sm font-medium text-neutral-700"
                        >
                            Enter your email
                        </label>
                        <input 
                            required
                            type="email" 
                            id="email-signup"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="x@example.com"
                            className="w-full text-sm px-2 py-1.5 border border-neutral-200 rounded-md"
                        />

                        <label 
                            htmlFor="password-signup"
                            className="block px-1 text-sm font-medium text-neutral-700 mt-2"
                        >
                            Enter your password
                        </label>
                        <input 
                            required
                            type="password" 
                            id="password-signup"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="********"
                            className="w-full text-sm px-2 py-1.5 border border-neutral-200 rounded-md"
                        />

                        <button
                            type="submit"
                            className="flex items-center justify-center w-full mt-3 bg-neutral-800 text-neutral-50 rounded-md min-h-9 py-1.5 hover:bg-neutral-700 cursor-pointer"
                            disabled={loading}
                        >
                            {loading ? <LoadingSpinner /> : "Create account"}
                        </button>
                        {
                            error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-2 text-sm text-red-500"
                                >
                                    {error}
                                </motion.div>
                            )
                        }
                    </div>
                )
            }
        </form>
    )
}