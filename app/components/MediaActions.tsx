"use client";

import { useState } from "react";
import { AddMediaForm } from "@/app/components/AddMediaForm";

export const MediaActions = () => {
    const [activeMenu, setActiveMenu] = useState<"add" | "stats" | null>(null);

    const toggleMenu = (menu: "add" | "stats") => {
        setActiveMenu(activeMenu === menu ? null : menu);
    };

    return (
        <>
            <div className="buttonContainer">
                <button 
                    type="button" 
                    className="simpleButton" 
                    onClick={() => toggleMenu("add")}>
                    {activeMenu === "add" ? "Abandon de l'ajout ▲" : "Ajouter un média ▼"}
                </button>

                <button 
                    type="button"
                    className="simpleButton"
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

