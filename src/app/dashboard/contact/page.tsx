"use client";

import { toast } from "@/components/ui/sonar";
import { useAuth } from "@/context/auth";
import { CheckIcon } from "@radix-ui/react-icons";
import { useState } from "react";

export default function Contact() {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        subject: "",
        message: "",
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        // Replace with your Discord webhook URL
        const webhookUrl = process.env.NEXT_PUBLIC_DISCORD_WEBHOOK_URL || "";

        // If you have user email, add it to formData or get it from context/auth
        const userEmail = user?.email; // Set this to the user's email if available

        const payload = {
            content: `**New Contact Form Submission**\n**Subject:** ${formData.subject}\n**Message:** ${formData.message}\n**Email:** ${userEmail || "N/A"}`
        };

        try {
            await fetch(webhookUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            toast.success("", {
                description: "Your message has been sent successfully!",
                duration: 5000,
                dismissible: false,
                icon: <CheckIcon className="text-green-500 w-4 h-4" />,
            });
            // Optionally reset form or show success message
            setFormData({ subject: "", message: "" });
        } catch (error) {
            // Handle error (e.g., show error message)
            console.error("Failed to send message to Discord:", error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="h-full w-full flex flex-col items-center justify-center">
            <form className="mx-auto max-w-2xl w-full space-y-6" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-2">
                    <label 
                        htmlFor="Subject"
                        className="text-sm font-medium text-neutral-700"
                    >
                        Subject
                    </label>
                    <input 
                        type="text" 
                        id="Subject" 
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        required
                        name="Subject" 
                        placeholder="Enter your subject"
                        className="border border-neutral-200 rounded-md px-4 py-2 w-full focus:outline-none"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label 
                        htmlFor="Message"
                        className="text-sm font-medium text-neutral-700"
                    >
                        Message
                    </label>
                    <textarea 
                        id="Message" 
                        name="Message" 
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        required
                        placeholder="Enter your message"
                        rows={8}
                        className="resize-none border border-neutral-200 rounded-md px-4 py-2 w-full focus:outline-none"
                    />
                </div>
                <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full cursor-pointer bg-neutral-900 text-white rounded-md py-2 font-semibold hover:bg-neutral-800 transition disabled:bg-neutral-500"
                >
                    Send
                </button>
            </form>
        </div>
    )
}