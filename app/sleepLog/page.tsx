"use client"; // mandatory directive for a client component

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SleepLogPage() {
    const router = useRouter();
    
    return (
        <main className="page">
            <h1>Registre Sommeil</h1>
            <p>Bienvenue dans le registre de sommeil. Ici, vous pouvez consulter et enregistrer vos logs et statistiques de sommeil.</p>
        </main>
    );
}