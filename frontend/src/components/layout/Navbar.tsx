import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
    const { user, logout, refreshUser, markNotificationsRead } = useAuth();
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const handleNotificationClick = async (senderId: string) => {
        if (!senderId) return;

        setOpen(false);

        // 🚀 NAVIGATE FIRST
        navigate(`/profile/${senderId}`);

        // 🔄 THEN update state
        await markNotificationsRead();
        await refreshUser();
    };


    return (
        <nav className="bg-slate-900 border-b border-slate-800">
            <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">

                <Link to="/feed" className="text-lg font-semibold text-white">
                    DevSocial
                </Link>

                <div className="flex items-center gap-6 relative">

                    {/* 🔔 Notifications */}
                    {user && (
                        <button
                            onClick={() => setOpen(!open)}
                            className="relative text-slate-300 hover:text-white"
                        >
                            🔔
                            {user.friendRequests?.length > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-xs px-1.5 rounded-full">
                                    {user.friendRequests?.length}
                                </span>
                            )}
                        </button>
                    )}

                    {open && user && (
                        <div className="absolute right-0 top-10 w-72 bg-slate-900 border border-slate-800 rounded-lg shadow-lg z-50">
                            {user.friendRequests?.length === 0 ? (
                                <p className="p-4 text-slate-400 text-sm">
                                    No notifications
                                </p>
                            ) : (
                                user.friendRequests?.map((req: any) => {
                                    const senderId =
                                        typeof req === "string" ? req : req._id;

                                    const senderName =
                                        typeof req === "string" ? "Someone" : req.name;

                                    if (!senderId) return null;

                                    return (
                                        <button
                                            key={senderId}
                                            onClick={() => handleNotificationClick(senderId)}
                                            className="w-full text-left px-4 py-3 hover:bg-slate-800 text-sm"
                                        >
                                            <span className="font-semibold">{senderName}</span>{" "}
                                            sent you a friend request
                                        </button>
                                    );
                                })
                            )}
                        </div>
                    )}

                    <Link to={`/profile/${user?._id}`} className="text-slate-300">
                        My Profile
                    </Link>

                    <button
                        onClick={logout}
                        className="bg-slate-800 px-4 py-1.5 rounded hover:bg-red-500"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
