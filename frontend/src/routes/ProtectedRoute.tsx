// import React, { type JSX } from 'react'
// import { useAuth } from '../context/AuthContext'
// import { Navigate } from 'react-router-dom';

// const ProtectedRoute = ({ children }: { children: JSX.Element }) => {

//     const { user, loading } = useAuth();

//     if (loading) {
//         return <p>Loading...</p>
//     }

//     if (!user) {
//         return <Navigate to="/login" replace />
//     }


//     return children;
// }

// export default ProtectedRoute


import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { JSX } from "react";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const { user, loading } = useAuth();

    // ⏳ WAIT until auth check finishes
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-slate-400">
                Loading...
            </div>
        );
    }

    // 🚫 Not logged in
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // ✅ Logged in
    return children;
};

export default ProtectedRoute;
