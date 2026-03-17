import Link from "next/link";
import "./styles/home.scss";

export default function Home() {
  return (
    <main className="page">
      <p>
        Salut ! Ici c'est un site personnel me permettant de stocker des informations personnelles ! 
        Bienvenue !
      </p>

      <div className="cards">

        <article className="card">
          <Link href="/sleepLog">
            <h3 className="cardTitle">
              Registre sommeil
            </h3>
            <p className="cardDescription"> 
              Logs et statistiques de sommeil
            </p>
          </Link>
        </article>

        <article className="card">
          <Link href="/medias">
          <h3 className="cardTitle">
            Films/Series/Livres
          </h3>
          <p className="cardDescription"> 
            Liste de films, series, livres, mangas, animés que j'ai vus/lus
          </p>
          </Link>
        </article>

        <article className="card">
          <Link href="/skills">
          <h3 className="cardTitle">
            Compétences
          </h3>
          <p className="cardDescription"> 
            Liste de mes compétences techniques et personnelles
          </p>
          </Link>
        </article>
      </div>

    </main>
  );
}
