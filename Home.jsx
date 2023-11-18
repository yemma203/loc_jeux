import React from "react";
import { useState, useEffect } from "react";

export default function Home() {
  // Les states
  const [jeux, setJeux] = useState([]);
  const [jeuxPanier, setJeuxPanier] = useState([]);
  const [elements, setElements] = useState([]);
  const [elementCherche, setElementCherche] = useState("");
  const [elementsFiltres, setElementsFiltres] = useState(jeux);
  const [commentairesParJeu, setCommentairesParJeu] = useState({});
  const [notesParJeu, setNotesParJeu] = useState({});

  const getJeux = async () => {
    // Fonction qui récupère tous les jeux dans la table jeux
    try {
      const response = await fetch("http://localhost:8000/jeux");
      const jsonData = await response.json();

      setJeux(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getJeux();
  }, []);

  const handleChange = async (event) => {
    // Fonction qui récupère les jeux en fonction de la recherche de l'utilisateur
    setElementCherche(event.target.value);
    try {
      const response = await fetch(
        `http://localhost:8000/rechercher?nom=${event.target.value}`
      );
      const jsonData = await response.json(); // Convertir la réponse en JSON
      setElements(jsonData); // Utiliser jsonData au lieu de response.data
    } catch (error) {
      console.error("Erreur lors de la requête :", error);
    }
  };

  useEffect(() => {
    // Fonction qui filtre les jeux en fonction de la recherche de l'utilisateur
    setElementsFiltres(
      elementCherche !== ""
        ? elements.filter((element) =>
            element.nom.toLowerCase().includes(elementCherche.toLowerCase())
          )
        : jeux
    );
  }, [elementCherche, elements, jeux]);

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  const estDansPanier = (id) => {
    // Fonction qui vérifie si un jeu est dans le panier
    // On l'utilise plus tard pour empecher le bouton louer de s'afficher si le jeu est déjà dans le panier
    const idsJeuxString = localStorage.getItem("ids_jeux");
    const idsJeux = idsJeuxString ? JSON.parse(idsJeuxString) : [];
    return idsJeux.includes(id);
  };

  const afficherDetail = async (id) => {
    try {
      const reponse = await fetch(
        `http://localhost:8000/afficher?id_jeu=${id}`
      );
      const data = await reponse.json();
      console.log("Données du serveur:", data);

      let nouveauxCommentaires = [];
      let nouvellesNotes = [];

      if (data && data.length > 0) {
        data.forEach((element) => {
          nouveauxCommentaires.push(element.commentaire);
          nouvellesNotes.push(element.note);
        });

        // Utilisation de l'id du jeu pour stocker les commentaires et notes spécifiques à ce jeu
        setCommentairesParJeu((prevCommentaires) => ({
          ...prevCommentaires,
          [id]: nouveauxCommentaires,
        }));

        setNotesParJeu((prevNotes) => ({
          ...prevNotes,
          [id]: nouvellesNotes,
        }));

        console.log(nouveauxCommentaires);
        console.log(nouvellesNotes);
      } else {
        console.error(
          "Les données attendues ne sont pas présentes dans la réponse."
        );
      }
    } catch (error) {
      console.error("Erreur lors de la requête :", error);
    }
  };
  // On initialise le la liste des ids des jeux dans le localStorage
  if (localStorage.getItem("ids_jeux") === null) {
    localStorage.setItem("ids_jeux", JSON.stringify([]));
  }

  return (
    <div>
      <div className="rechercherBar">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Rechercher..."
            value={elementCherche}
            onChange={handleChange}
          />
        </form>
      </div>
      <div className="jeuContainer">
        {elementsFiltres.map((jeu) => (
          <div className="jeu" key={jeu.id}>
            <h2>{jeu.nom}</h2>
            <h1>{jeu.prix} $/ day</h1>
            <div className="imgContainer">
              <img src={jeu.image} alt="" />
            </div>
            {/* Si un utilisateur est connecté sur la session, il peut louer un jeu, et celui-ci se met dans le localStorage */}
            {/* On vérifie également si l'id du jeu n'est pas présent dans jeuxLoues */}
            <div className="jeubutton">
              {localStorage.getItem("username") && !estDansPanier(jeu.id) && (
                <button
                  onClick={() => {
                    let newLst = JSON.parse(localStorage.getItem("ids_jeux"));
                    newLst.push(jeu.id);
                    localStorage.setItem("ids_jeux", JSON.stringify(newLst));
                    setJeuxPanier([...jeuxPanier, [jeu]]);
                  }}
                >
                  Louer
                </button>
              )}
              <button
                onClick={async () => {
                  await afficherDetail(jeu.id);
                }}
              >
                Details
              </button>
            </div>
            {/* Afficher les détails ici */}
            <div className="commentaireNote">
              {commentairesParJeu[jeu.id] && commentairesParJeu[jeu.id].length > 0 &&  (
                <>
                  <h4>
                    Moyenne: {notesParJeu[jeu.id].reduce((a, b) => a + b, 0) / notesParJeu[jeu.id].length}/5
                  </h4>
                  <h3>Commentaires et Notes:</h3>
                  <ul>
                    {commentairesParJeu[jeu.id].map((com, index) => (
                      <li key={index}>
                        <div className="comms">
                          <p>{notesParJeu[jeu.id][index]}/5</p>
                          <p>{com}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
