import React, { useEffect, useState } from "react";
import type { Post } from "../types/post";
import CreatePost from "../components/post/CreatePost";
import PostCard from "../components/post/PostCard";
import {
  createPostApi,
  deletePostApi,
  fetchFeedApi,
  likePostApi,
} from "../api/post.api";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/layout/Navbar";

const Feed = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();

  const loadFeed = async () => {
    if (!hasMore || loading) return;

    try {
      setLoading(true);
      const data = await fetchFeedApi(page);
      const normalizedPosts = data.posts.map((post) => ({
        ...post,
        likes: post.likes.map((id) => id.toString()),
      }));


      setPosts((prev) => [...prev, ...normalizedPosts]);
      setHasMore(data.hasMore);
      setPage((prev) => prev + 1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeed();
  }, []);

  const handleCreatePost = async (content: string) => {
    const newPost = await createPostApi(content);
    setPosts((prev) => [
      {
        ...newPost,
        likes: newPost.likes.map((id) => id.toString()),
      },
      ...prev,
    ]);

  };

  const handleLike = async (postId: string) => {
    if (!user) return;

    setPosts((prev) =>
      prev.map((post) => {
        if (post._id !== postId) return post;

        const likes = Array.isArray(post.likes) ? post.likes : [];
        const alreadyLiked = likes.includes(user._id);

        return {
          ...post,
          likes: alreadyLiked
            ? likes.filter((id) => id !== user._id)
            : [...likes, user._id],
        };
      })
    );

    try {
      await likePostApi(postId);
    } catch {
      console.error("Failed to like post");
    }
  };



  const handleDelete = async (postId: string) => {
    await deletePostApi(postId);
    setPosts((prev) => prev.filter((p) => p._id !== postId));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Feed title */}
        <h2 className="text-xl font-semibold tracking-wide">
          Feed
        </h2>

        {/* Create Post */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <CreatePost onCreate={handleCreatePost} />
        </div>

        {/* Posts */}
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              onLike={handleLike}
              onDelete={handleDelete}
              onUpdateComments={(postId, updatedComments) => {
                setPosts((prev) =>
                  prev.map((p) =>
                    p._id === postId
                      ? { ...p, comments: updatedComments }
                      : p
                  )
                );
              }}
            />
          ))}
        </div>

        {/* Load more */}
        {hasMore && (
          <div className="flex justify-center pt-4">
            <button
              onClick={loadFeed}
              className="px-6 py-2 rounded-md bg-slate-800 text-slate-200
                         hover:bg-blue-500 hover:text-white
                         transition-all disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Loading..." : "Load more"}
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Feed;




