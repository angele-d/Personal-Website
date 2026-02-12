"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MediaType, MediaInsert, MediaStatus } from "@/types";
import styles from "./MediaActions.module.scss";

type AddMediaFormProps = {
    onSuccess?: () => void;
};

export const AddMediaForm = ({ onSuccess }: AddMediaFormProps) => {
    const router = useRouter(); //Refresh page after adding media
    
    // TOGGLE & FORM FIELDS
    const [loading, setLoading] = useState(false);
    const [showAdvanced, setShowAdvanced] = useState(false);

    // MAIN FIELDS
    const [title, setTitle] = useState("");
    const [type, setType] = useState<MediaType>("film");
    const [rating, setRating] = useState<string>("");
    const [status, setStatus] = useState<MediaStatus>("a_voir");

    // OPTIONAL FIELDS
    const [rank, setRank] = useState<string>("");
    const [notes, setNotes] = useState<string>("");
    const [startedAt, setStartedAt] = useState<string>("");
    const [finishedAt, setFinishedAt] = useState<string>("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Prevent default form submission behavior
        setLoading(true);

        // Prepare new media data
        const newMedia: MediaInsert = {
            title: title,
            type: type,
            status : status,
            rating : rating ? parseInt(rating) : null,
            rank: rank ? parseInt(rank) : null,
            started_at : startedAt ? startedAt : null,
            finished_at : finishedAt ? finishedAt : null,
            notes : notes ? notes : null,
        };

        const response = await fetch("/api/media", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newMedia),
        });
            
        if (!response.ok) {
            const errorBody = await response.json().catch(() => null);
            console.error("Error adding media:", errorBody?.error || response.statusText);
        } else {
            // Refresh the page to show the new media
            router.refresh();
            // Clear form fields
            setTitle("");
            setType("film");
            setRating("");
            setRank("");
            setStartedAt("");
            setFinishedAt("");
            setStatus("a_voir"); // Default status
            setShowAdvanced(false); // Close advanced menu
            setNotes("");
            onSuccess?.(); // Notify parent of success
        }

        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className= {styles.addMediaForm}>
        {/* Main Fields */}
        <div className={styles.insertionContainer}>
            <input
            type="text"
            placeholder="Titre"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className={styles.input}
            />
            
            <select 
            value={type} 
            onChange={(e) => setType(e.target.value as MediaType)}
            className={styles.select}
            >
            <option value="film">Film</option>
            <option value="serie">Série</option>
            <option value="livre">Livre</option>
            <option value="manga">Manga</option>
            <option value="anime">Anime</option>
            </select>

            
            <select 
            value={status} 
            onChange={(e) => setStatus(e.target.value as MediaStatus)}
            className={styles.select}
            >
            <option value="a_voir">À voir / lire</option>
            <option value="en_cours">En cours</option>
            <option value="termine">Terminé</option>
            </select>

            <label> 
            <input
            type="number"
            placeholder="Note /10"
            min="0"
            max="10"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className={styles.input}
            />
            /10 </label>
        </div> 

        <div className={styles.insertionContainer}>
            <button 
                type="button" className={styles.advancedToggle} 
                onClick={() => setShowAdvanced(!showAdvanced)}>
                {showAdvanced ? "Masquer options avancées ▲" : "Afficher options avancées ▼"}
            </button>
        </div>

        {showAdvanced && (
        <div>
        <div className={styles.insertionContainer}>
            <label> Classement: 
            <input
            type="number"
            placeholder="Classement"
            min="1"
            value={rank}
            onChange={(e) => setRank(e.target.value)}
            className={styles.input}
            />
            </label>

            <label> Date de début:
            <input
            type="date"
            value={startedAt}
            onChange={(e) => setStartedAt(e.target.value)}
            className={styles.input}
            />
            </label>

            <label> Date de fin:
            <input
            type="date"
            value={finishedAt}
            onChange={(e) => setFinishedAt(e.target.value)}
            className={styles.input}
            />
            </label>

        </div>

        <br></br>
        <div className={styles.insertionContainer}>
            <textarea
            placeholder="Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className={styles.textarea}
            />
            </div>
        </div>
        )}

        <br></br>
        <div className={styles.insertionContainer}>
            <button type="submit" disabled={loading} className={styles.addButton}>
            {loading ? 'Ajout...' : 'Ajouter +'}
            </button>
        </div>

        </form>
    );

}

