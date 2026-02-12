"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import styles from "./page.module.scss";

export default function LoginPage() {
    const [loading, setLoading] = useState<"google" | "github" | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleProviderLogin = async (provider: "google" | "github") => {
        setLoading(provider);
        setError(null);

        try {
            await signIn(provider, { callbackUrl: "/medias" });
        } catch (err: any) {
            setError(err.message || "Une erreur est survenue");
            setLoading(null);
        }
    };

    return (
        <main className="page">
            <div className={styles.loginContainer}>
                <h1>Connexion</h1>

                <div className={styles.loginForm}>
                    {error && <div className={styles.error}>{error}</div>}

                    <button
                        type="button"
                        disabled={loading !== null}
                        className={styles.submitButton}
                        onClick={() => handleProviderLogin("google")}
                    >
                        {loading === "google" ? "Connexion..." : "Continuer avec Google"}
                    </button>

                    <button
                        type="button"
                        disabled={loading !== null}
                        className={styles.submitButton}
                        onClick={() => handleProviderLogin("github")}
                    >
                        {loading === "github" ? "Connexion..." : "Continuer avec GitHub"}
                    </button>
                </div>
            </div>
        </main>
    );
}