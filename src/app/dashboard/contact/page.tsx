"use client";

import { useState } from "react";

export default function Contact() {
    const [formData, setFormData] = useState({
        subject: "",
        message: "",
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
    
    }

    return (
        <div className="h-full w-full flex flex-col items-center justify-center">
            <form className="mx-auto max-w-2xl w-full space-y-6">
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
                    className="w-full cursor-pointer bg-neutral-900 text-white rounded-md py-2 font-semibold hover:bg-neutral-800 transition"
                >
                    Send
                </button>
            </form>
        </div>
    )
}