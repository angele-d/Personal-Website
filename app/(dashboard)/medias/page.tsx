import Link from "next/link";
import { MediaComponent } from "../../components/MediaComponent";
import styles from "./page.module.scss";
import "../../styles/home.scss";
import { MediaActions } from "../../components/MediaActions";
import { auth } from "@/auth";
import { getMediaEntries } from "@/lib/db/media";

export default async function MediasPage() {
    const session = await auth();

    if (!session) {
        return (
            <div className="notLoggedInMessage">
                Vous devez être connecté pour voir cette page.
                <Link href="/login"> Se connecter </Link>
            </div>
        );
    }

    const medias = await getMediaEntries(session.user.id);

    return (
        <main className="page">
            <h1>Media Page</h1>
            <p>This is the media page. Here you can find my lists of movies, series, books, mangas, and animes that I have watched or read.</p>

            <MediaActions />

            <div className={styles.mediaGrid}>
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
