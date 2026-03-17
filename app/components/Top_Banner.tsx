"use client";

import Link from "next/link";
import { useState } from "react";
import styles from "./Top_Banner.module.scss";
import { AuthButton } from "./AuthButton";

export const Top_Banner = () => {

    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
    <header className={styles.topBanner}>

        <button className={styles.menuToggle} onClick={toggleMenu}>
            {isOpen ? "MENU ☰" : "MENU ☰"}
        </button>
        {isOpen && ( // Conditional rendering of the menu
            <nav className={styles.mainMenu}> 
                <ul>
                    <li className={styles.menuItem}>
                        <Link href="/sleepLog"> Registre Sommeil </Link> 
                    </li>
                    <li className={styles.menuItem}>
                        <Link href="/medias"> Films/Series/Livres </Link>
                    </li>
                </ul>
            </nav>
        )}    

        <div className={styles.middle}> Site perso d'Angèle ! </div>

        <div className={styles.rightSection}>
            <button id="theme-toggle">
                THEME
            </button>

            <AuthButton />

            <Link href="/">
            <div className={styles.homeButton}> 
                HOME
            </div>
            </Link>
        </div>

    </header>
    );
};

