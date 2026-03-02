"use client";

import { useState } from "react";
import { AddMediaForm } from "@/app/components/AddMediaForm";
import styles from "./MediaActions.module.scss";
    

export const MediaActions = () => {
    const [activeMenu, setActiveMenu] = useState<"add" | "stats" | null>(null);

    const toggleMenu = (menu: "add" | "stats") => {
        setActiveMenu(activeMenu === menu ? null : menu);
    };

    return (
        <>
            <div className={styles.buttonContainer}>
                <button 
                    type="button" 
                    className={styles.simpleButton} 
                    onClick={() => toggleMenu("add")}>
                    {activeMenu === "add" ? "Abandon de l'ajout ▲" : "Ajouter un média ▼"}
                </button>

                <button 
                    type="button"
                    className={styles.simpleButton}
                    onClick={() => toggleMenu("stats")}>
                    {activeMenu === "stats" ? "Masquer les statistiques ▲" : "Voir les statistiques ▼"}
                </button>
            </div>

            {activeMenu === "add" && (
                <section>
                    <AddMediaForm onSuccess={() => setActiveMenu(null)} />
                </section>
            )}

            {activeMenu === "stats" && (
                <section>
                    <div className="statsPlaceholder">
                        <p>Statistiques à venir...</p>
                        {/* TODO: Add statistics component here */}
                    </div>
                </section>
            )}
        </>
    );
};

