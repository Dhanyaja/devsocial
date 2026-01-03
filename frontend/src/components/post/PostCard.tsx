import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import type { Post } from "../../types/post";
import CommentSection from "./CommentSection";
import { useState } from "react";

interface Props {
    post: Post;
    onLike: (id: string) => void;
    onDelete: (id: string) => void;
    onUpdateComments: (postId: string, comments: Post["comments"]) => void;
}

const PostCard = ({ post, onLike, onDelete, onUpdateComments }: Props) => {
    const { user } = useAuth();
    const isOwner = post.author._id === user?._id;
    const isLiked = post.likes.includes(user?._id || "");



    const [showComments, setShowComments] = useState(false);

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">

            {/* Author */}
            <Link
                to={`/profile/${post.author._id}`}
                className="text-slate-100 font-semibold hover:text-blue-400 transition-colors"
            >
                {post.author.name}
            </Link>

            {/* Content */}
            <p className="text-slate-300 whitespace-pre-wrap">
                {post.content}
            </p>

            {/* Actions */}
            <div className="flex items-center gap-4 pt-1">
                <button
                    onClick={() => onLike(post._id)}
                    className={`flex items-center gap-1 text-sm transition-colors
                              ${isLiked
                            ? "text-blue-400 hover:text-blue-500"
                            : "text-slate-400 hover:text-blue-400"
                        }`}
                >
                    {isLiked ? "Unlike" : "Like"}
                    <span className="text-xs">({post.likes.length})</span>
                </button>

                {/* Show comments toggle */}
                <button
                    onClick={() => setShowComments((prev) => !prev)}
                    className="text-sm text-slate-400 hover:text-blue-400 transition-colors"
                >
                    💬 {post.comments.length}{" "}
                    {showComments ? "Hide comments" : "Show comments"}
                </button>

                {isOwner && (
                    <button
                        onClick={() => onDelete(post._id)}
                        className="text-sm text-slate-400 hover:text-red-400 transition-colors"
                    >
                        Delete
                    </button>
                )}
            </div>


            {/* Divider */}


            <div className="border-t border-slate-800 pt-3">
                <CommentSection
                    postId={post._id}
                    comments={showComments ? post.comments : []}
                    onUpdate={(updatedComments) =>
                        onUpdateComments(post._id, updatedComments)
                    }
                />
            </div>

        </div>
    );
};

export default PostCard;
