"use client";

import { useState } from "react";

export default function Test() {
    const [url, setUrl] = useState("");
    const [response, setResponse] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setResponse(null);

        try {
            const res = await fetch("/api/analyze/article", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ url }),
            });

            if (!res.ok) throw new Error("Failed to fetch data");

            const data = await res.json();
            setResponse(data);
        } catch (error) {
            setError("An error occurred while fetching the data.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <h2>test claim analysis</h2>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text"
                    value={url}
                    placeholder="Enter URL"
                    onChange={(e) => setUrl(e.target.value)} 
                />
                <button type="submit" disabled={loading}>
                    {loading ? "Loading..." : "Submit"}
                </button>
                {error && <p style={{ color: "red" }}>{error}</p>}
            </form>

            {
                response && (
                    <div>
                        <h3>Response:</h3>
                        <pre>{JSON.stringify(response, null, 2)}</pre>
                    </div>
                )
            }
        </div>
    )
}