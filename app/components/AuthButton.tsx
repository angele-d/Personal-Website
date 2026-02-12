"use client";

import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

export const AuthButton = () => {
    const router = useRouter();
    const { data: session, status } = useSession();

    const handleLogout = async () => {
        await signOut({ callbackUrl: "/login" });
    };

    if (status === "loading") {
        return null;
    }

    if (session?.user) {
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

