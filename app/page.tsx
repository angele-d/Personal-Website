import Link from "next/link";
import "./styles/home.scss";

export default function Home() {
  return (
    <div className="page">
      
      <header className="hero">
        <p className="eyebrow">Hello, je suis Angele</p>
        <h1>
          Développeuse web orientée produit, j'aime mettre en ligne vite et bien
          avec Next.js, SCSS et Supabase.
        </h1>
        <p className="lede">
          Ici tu trouveras mes projets personnels, des expérimentations front-end
          et des notes techniques. Le site est déployé sur Vercel et stocke ses
          données sur Supabase.
        </p>
        <div className="cta-row">
          <Link className="btn primary" href="#projets">
            Voir les projets
          </Link>
          <Link className="btn ghost" href="#contact">
            Me contacter
          </Link>
        </div>
      </header>

      <main className="content">
        <section id="projets" className="section">
          <div className="section-heading">
            <p className="eyebrow">Projets</p>
            <h2>Ce que je construis en ce moment</h2>
            <p className="muted">
              Brancher rapidement Supabase pour persister des données (auth,
              base de données, storage) est prévu ici. Pour l'instant, quelques
              cartes statiques pour poser la structure.
            </p>
          </div>
          <div className="card-grid">
            <article className="card">
              <p className="tag">Next.js</p>
              <h3>Portfolio minimal</h3>
              <p>
                Mise en page responsive, routing app directory, déploiement
                Vercel. Parfait pour itérer vite et brancher des APIs.
              </p>
            </article>
            <article className="card">
              <p className="tag">Supabase</p>
              <h3>Notes techniques</h3>
              <p>
                Section prévue pour stocker des posts dans Supabase (table
                `notes`). On pourra les fetch côté serveur via RSC.
              </p>
            </article>
            <article className="card">
              <p className="tag">UI/UX</p>
              <h3>Explorations visuelles</h3>
              <p>
                Tests de palettes, micro-interactions et composants réutilisables
                (boutons, bannières, cartes) en SCSS modulaires.
              </p>
            </article>
          </div>
        </section>

        <section id="contact" className="section contact">
          <div className="section-heading">
            <p className="eyebrow">Contact</p>
            <h2>Envie de discuter ?</h2>
            <p className="muted">
              Envoie-moi un message ou connecte Supabase pour stocker un petit
              formulaire de contact (table `messages`).
            </p>
          </div>
          <div className="contact-actions">
            <Link className="btn primary" href="mailto:contact@example.com">
              Écrire un email
            </Link>
            <Link className="btn ghost" href="https://github.com/" target="_blank">
              Voir GitHub
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
