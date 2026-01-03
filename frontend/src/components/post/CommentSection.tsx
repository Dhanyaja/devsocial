import React, { useState } from "react";
import { Link } from "react-router-dom";
import type { Comment } from "../../types/post";
import { useAuth } from "../../context/AuthContext";
import { addCommentApi, deleteCommentApi } from "../../api/post.api";

interface Props {
    postId: string;
    comments: Comment[];
    onUpdate: (comments: Comment[]) => void;
}

const CommentSection = ({ postId, comments, onUpdate }: Props) => {
    const { user } = useAuth();
    const [text, setText] = useState("");

    const addComment = async () => {
        if (!text.trim()) return;

        const newComments = await addCommentApi(postId, text);
        onUpdate(newComments);
        setText("");
    };

    const deleteComment = async (commentId: string) => {
        await deleteCommentApi(postId, commentId);
        onUpdate(comments.filter((c) => c._id !== commentId));
    };

    return (
        <div className="space-y-3">
            {/* Existing comments */}
            {comments.length > 0 && comments.map((comment) => {
                const canDelete = comment.user._id === user?._id;

                return (
                    <div
                        key={comment._id}
                        className="flex items-start justify-between gap-3 text-sm"
                    >
                        <p className="text-slate-300 leading-relaxed">
                            <Link
                                to={`/profile/${comment.user._id}`}
                                className="font-semibold text-slate-100 hover:text-blue-400 mr-1"
                            >
                                {comment.user.name}
                            </Link>
                            {comment.text}
                        </p>

                        {canDelete && (
                            <button
                                onClick={() => deleteComment(comment._id)}
                                className="text-xs text-slate-400 hover:text-red-400 transition-colors"
                            >
                                Delete
                            </button>
                        )}
                    </div>
                );
            })}

            {/* Add comment */}
            {user && (
                <div className="flex items-center gap-2 pt-2">
                    <input
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Write a comment..."
                        className="flex-1 bg-slate-800 border border-slate-700 rounded-md
                       px-3 py-1.5 text-sm text-slate-100
                       placeholder:text-slate-400
                       focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <button
                        onClick={addComment}
                        disabled={!text.trim()}
                        className="text-sm font-medium text-blue-400
                       hover:text-blue-500 transition-colors
                       disabled:opacity-50"
                    >
                        Post
                    </button>
                </div>
            )}
        </div>
    );
};

export default CommentSection;
