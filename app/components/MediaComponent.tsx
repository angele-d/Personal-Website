import { MediaEntry } from "@/types";
import styles from "./MediaComponent.module.scss";

type MediaProps = {
  media: MediaEntry;
};

export const MediaComponent = ({ media }: MediaProps) => {

    return (

        <article className={styles.mediaCard}>

            <h2 className={styles.mediaTitle}>
              {media.title}
            </h2>
            <p className={styles.mediaDetails}>
                <strong>Type:</strong> {media.type} | <strong>Status:</strong> {media.status} | <strong>Rating:</strong> {media.rating ?? "N/A"}
            </p>
            {media.notes && (
              <p className={styles.mediaNotes}>
                <strong>Notes:</strong> {media.notes}
              </p>
            )}

        </article>

    )
}