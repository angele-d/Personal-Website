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
          <h3 className="cardTitle">
            <Link href="/sleepLog"> Registre sommeil </Link>
          </h3>
          <p className="cardDescription"> 
            Logs et statistiques de sommeil
          </p>
        </article>

        <article className="card">
          <h3 className="cardTitle">
            <Link href="/medias"> Films/Series/Livres </Link>
          </h3>
          <p className="cardDescription"> 
            Liste de films, series, livres, mangas, animés que j'ai vus/lus
          </p>
        </article>

      </div>

    </main>
  );
}
