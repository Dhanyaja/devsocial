import React, { createContext, useContext, useEffect, useState } from "react";
import type { User } from "../types/user";
import { getMeApi, loginApi, registerApi, refreshUserApi } from "../api/auth.api";
import { markNotificationsReadApi } from "../api/user.api";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    refreshUser: () => Promise<void>; // ✅ ADD THIS
    markNotificationsRead: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // 🔁 Initial auth check
    useEffect(() => {
        const initAuth = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setLoading(false);
                    return;
                }

                const me = await getMeApi();
                setUser(me);
            } catch (error) {
                localStorage.removeItem("token");
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    const refreshUser = async () => {
        try {
            const user = await refreshUserApi();
            setUser(user);
        } catch (error) {
            console.error("Failed to refresh user");
        }
    };


    const login = async (email: string, password: string) => {
        const { token, user } = await loginApi(email, password);
        localStorage.setItem("token", token);
        setUser(user);
    };

    const register = async (
        name: string,
        email: string,
        password: string
    ) => {
        const { token, user } = await registerApi(name, email, password);
        localStorage.setItem("token", token);
        setUser(user);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    const markNotificationsRead = async () => {
        await markNotificationsReadApi();
        await refreshUser();
    };


    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                register,
                logout,
                refreshUser,
                markNotificationsRead
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuth must be used inside AuthProvider");
    }
    return ctx;
};
