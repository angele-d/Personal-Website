"use client"; // mandatory directive for a client component

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function MediaPage() {
    const router = useRouter();
    
    return (
        <main className="page">
            <h1>Media Page</h1>
            <p>This is the media page. Here you can find my lists of movies, series, books, mangas, and animes that I have watched or read.</p>
        </main>
    );
}