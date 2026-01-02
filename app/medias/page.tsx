import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { MediaComponent } from "../components/MediaComponent";
import styles from "./page.module.scss";
import "../styles/home.scss";
import { MediaActions } from "../components/MediaActions";


export default async function MediasPage() {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || "",
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
    );
    
    // Security check
    const { data : {user}} = await supabase.auth.getUser();
    if (!user) {
        return (
            <div className= "notLoggedInMessage">
                Vous devez être connecté pour voir cette page. 
                <Link href="/login"> Se connecter </Link>
            </div>
        );
    }

    const { data: medias, error } = await supabase
        .from("media")
        .select("*")
        .eq("user_id", user.id) // Filter medias by logged-in user
        .order("title", { ascending: true });

    return (
        <main className="page">
            <h1>Media Page</h1>
            <p>This is the media page. Here you can find my lists of movies, series, books, mangas, and animes that I have watched or read.</p>

            <MediaActions userId={user.id} />

            <div className = {styles.mediaGrid}>
            
            {medias?.map((media) => (
                <MediaComponent key={media.id} media={media} />
            ))}

            {(!medias || medias.length === 0) && (
                <div className={styles.NoMediaFound}> Aucun média trouvé.</div>
            )}

            </div>

        </main>
    );
}