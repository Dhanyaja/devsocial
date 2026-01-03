import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
    getUserProfileApi,
    sendFriendRequestApi,
    acceptFriendRequestApi,
    rejectFriendRequestApi,
    removeFriendApi,
} from "../api/user.api";
import { fetchUserPostsApi } from "../api/post.api";
import PostCard from "../components/post/PostCard";

const extractIds = (arr: any[] = []) =>
    arr.map((item) => (typeof item === "string" ? item : item._id));

const Profile = () => {
    const { id } = useParams<{ id: string }>();
    const { user, refreshUser } = useAuth();

    const [profile, setProfile] = useState<any>(null);
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showFriends, setShowFriends] = useState(false);

    if (!user) {
        return <p className="text-center mt-10 text-slate-400">Please login</p>;
    }

    const loadProfile = async () => {
        if (!id) return;
        setLoading(true);

        const [profileData, postsData] = await Promise.all([
            getUserProfileApi(id),
            fetchUserPostsApi(id),
        ]);

        setProfile(profileData);
        setPosts(postsData);
        setLoading(false);
    };

    useEffect(() => {
        loadProfile();
    }, [id]);

    if (loading) {
        return <p className="text-center mt-10 text-slate-400">Loading...</p>;
    }

    /* ================= NORMALIZED IDS ================= */

    const profileFriendIds = extractIds(profile.friends);
    const profileRequestIds = extractIds(profile.friendRequests);
    const userRequestIds = extractIds(user.friendRequests);

    const isOwnProfile = user._id === profile._id;
    const isFriend = profileFriendIds.includes(user._id);
    const hasSentRequest = profileRequestIds.includes(user._id);
    const hasReceivedRequest = userRequestIds.includes(profile._id);

    /* ================= ACTION HANDLERS ================= */

    const handleSendRequest = async () => {
        await sendFriendRequestApi(profile._id);
        await refreshUser();
        await loadProfile();
    };

    const handleAccept = async () => {
        await acceptFriendRequestApi(profile._id);
        await refreshUser();
        await loadProfile();
    };

    const handleReject = async () => {
        await rejectFriendRequestApi(profile._id);
        await refreshUser();
        await loadProfile();
    };

    const handleRemoveFriend = async () => {
        await removeFriendApi(profile._id);
        await refreshUser();
        await loadProfile();
    };

    const renderFriendActions = () => {
        if (isFriend) {
            return (
                <button
                    onClick={handleRemoveFriend}
                    className="px-4 py-1.5 bg-red-500 rounded hover:bg-red-600"
                >
                    Remove Friend
                </button>
            );
        }

        if (hasReceivedRequest) {
            return (
                <>
                    <button
                        onClick={handleAccept}
                        className="px-4 py-1.5 bg-green-500 rounded hover:bg-green-600"
                    >
                        Accept
                    </button>
                    <button
                        onClick={handleReject}
                        className="px-4 py-1.5 bg-slate-700 rounded hover:bg-slate-600"
                    >
                        Reject
                    </button>
                </>
            );
        }

        if (hasSentRequest) {
            return (
                <button disabled className="px-4 py-1.5 bg-slate-700 opacity-60 rounded">
                    Request Sent
                </button>
            );
        }

        return (
            <button
                onClick={handleSendRequest}
                className="px-4 py-1.5 bg-blue-500 rounded hover:bg-blue-600"
            >
                Add Friend
            </button>
        );
    };

    /* ================= UI ================= */

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100">
            <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-3">
                    <h2 className="text-2xl font-semibold">{profile.name}</h2>
                    <p className="text-slate-400 text-sm">{profile.email}</p>

                    <button
                        onClick={() => setShowFriends(true)}
                        className="text-sm text-blue-400 hover:underline"
                    >
                        Friends • {profileFriendIds.length}
                    </button>

                    {!isOwnProfile && (
                        <div className="mt-4 flex gap-3 flex-wrap">
                            {renderFriendActions()}
                        </div>
                    )}
                </div>

                {showFriends && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-slate-900 w-full max-w-md rounded-xl p-4">
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="text-lg font-semibold">Friends</h3>
                                <button onClick={() => setShowFriends(false)}>✕</button>
                            </div>



                            {profile.friends.length === 0 ? (
                                <p className="text-slate-400 text-sm">No friends yet</p>
                            ) : (
                                <ul className="space-y-2">
                                    {profile.friends.map((friend: any) => {
                                        const friendId =
                                            typeof friend === "string" ? friend : friend._id;

                                        const friendName =
                                            typeof friend === "string" ? "User" : friend.name;

                                        const friendEmail =
                                            typeof friend === "string" ? "" : friend.email;

                                        return (
                                            <Link
                                                key={friendId}
                                                to={`/profile/${friendId}`}
                                                onClick={() => setShowFriends(false)}
                                                className="block px-3 py-2 rounded hover:bg-slate-800"
                                            >
                                                <p className="font-medium">{friendName}</p>
                                                {friendEmail && (
                                                    <p className="text-xs text-slate-400">{friendEmail}</p>
                                                )}
                                            </Link>
                                        );
                                    })}
                                </ul>
                            )}


                        </div>
                    </div>
                )}

                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">
                        {isOwnProfile ? "My Posts" : `${profile.name}'s Posts`}
                    </h3>

                    {posts.length === 0 ? (
                        <p className="text-slate-400">No posts yet.</p>
                    ) : (
                        posts.map((post) => (
                            <PostCard
                                key={post._id}
                                post={post}
                                onLike={() => { }}
                                onDelete={() => { }}
                                onUpdateComments={() => { }}
                            />
                        ))
                    )}
                </div>
            </main>
        </div>
    );
};

export default Profile;
