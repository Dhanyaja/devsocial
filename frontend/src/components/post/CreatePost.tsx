import React, { useState } from "react";

interface Props {
    onCreate: (content: string) => Promise<void>;
}

const CreatePost = ({ onCreate }: Props) => {
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;

        try {
            setLoading(true);
            await onCreate(content);
            setContent("");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-3"
        >
            {/* Textarea */}
            <textarea
                placeholder="What's on your mind?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={3}
                className="w-full resize-none rounded-lg bg-slate-800 text-slate-100
                   placeholder:text-slate-400 border border-slate-700
                   px-4 py-3 focus:outline-none focus:ring-2
                   focus:ring-blue-500 focus:border-blue-500
                   transition"
            />

            {/* Actions */}
            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={loading || !content.trim()}
                    className="px-5 py-2 rounded-md bg-blue-500 text-white font-medium
                     hover:bg-blue-600 transition-colors
                     disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? "Posting..." : "Post"}
                </button>
            </div>
        </form>
    );
};

export default CreatePost;
