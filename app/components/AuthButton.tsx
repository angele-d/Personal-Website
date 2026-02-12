"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Session } from "@/types";

export const AuthButton = () => {
    const [user, setUser] = useState<Session["user"] | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            const response = await fetch("/api/auth/me", { cache: "no-store" });
            if (!response.ok) {
                setUser(null);
                setLoading(false);
                return;
            }

            const data = await response.json();
            setUser(data.user ?? null);
            setLoading(false);
        };

        fetchUser();
    }, []);

    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        setUser(null);
        router.push("/login");
        router.refresh();
    };

    if (loading) {
        return null;
    }

    if (user) {
        return (
            <button onClick={handleLogout} className="authButton logoutButton">
                Se déconnecter
            </button>
        );
    }

    return (
        <button onClick={() => router.push("/login")} className="authButton loginButton">
            Se connecter
        </button>
    );
};

