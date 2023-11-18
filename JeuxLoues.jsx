import React from "react";
import { useState, useEffect } from "react";

export default function JeuxLoues() {
  // Les states
  const [infosLoc, setInfosLoc] = useState([]);
  const [jeuxLoues, setJeuxLoues] = useState([]);

  const getIdUtilisateur = async () => {
    // Fonction qui recupere l'id de l'utilisateur connecté
    const username = localStorage.getItem("username");
    if (username) {
      try {
        const reponse = await fetch(`http://localhost:8000/users/${username}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (reponse.ok) {
          const user = await reponse.json();
          return user[0].id;
        } else {
          console.log("Erreur lors de la récupération de l'utilisateur");
          return null;
        }
      } catch (err) {
        console.error("Erreur lors de la récupération de l'utilisateur", err);
        return null;
      }
    }
    return null;
  };

  const getInfosLoc = async () => {
    // Fonction qui recupere tous les jeux dans la table location où l'id de l'utilisateur est égal à l'id de l'utilisateur connecté
    const idUtilisateur = await getIdUtilisateur();
    try {
      const response = await fetch(
        `http://localhost:8000/location/${idUtilisateur}`
      );
      const jsonData = await response.json();

      setInfosLoc(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getInfosLoc();
  }, []);

  const getJeuxLoues = async () => {
    // Fonction qui recupere tous les jeux dans la table jeux où l'id du jeu est égal à l'id du jeu dans la table location
    for (const element of infosLoc) {
      try {
        const response = await fetch(
          `http://localhost:8000/jeux/${element.id_jeu}`
        );
        const jeu = await response.json();
        setJeuxLoues((prevJeuxLoues) => [...prevJeuxLoues, jeu[0]]);
      } catch (err) {
        console.error(err.message);
      }
    }
  };

  useEffect(() => {
    getJeuxLoues();
  }, [infosLoc]);

  useEffect(() => {
    // Ce code sera exécuté chaque fois que l'état jeuxLoues est mis à jour
    console.log(jeuxLoues);
  }, [jeuxLoues]);

  return (
    <div>
      <div className="spaceHome"></div>
      <div className="jeuContainer">
        {jeuxLoues.map(
          (jeu) => (
            (
              <div className="jeu" key={jeu.id}>
                <h2>{jeu.nom}</h2>
                <h1>{jeu.prix} $</h1>
                <div className="imgContainer">
                  <img src={jeu.image} alt="" />
                </div>
                <button
                  className="ajouterCommentaire"
                  onClick={() => {
                    const idLoc = infosLoc.find(
                      (element) => element.id_jeu === jeu.id
                    ).id;
                    localStorage.setItem("idLoc", idLoc);
                    window.location.href = `/commentaire/${idLoc}`;
                  }}
                >
                  Ajouter un commentaire
                </button>
              </div>
            )
          )
        )}
      </div>
    </div>
  );
}
