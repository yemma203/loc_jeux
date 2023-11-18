import React, { useState, useEffect } from "react";

export default function Panier() {
  // Les states
  const [jeuxPanier, setJeuxPanier] = useState([]);
  const [duree_location, setDuree_location] = useState(1);
  const [total, setTotal] = useState();

  useEffect(() => {
    let total = 0;
    // Calcule le total en fonction du prix de chaque jeu dans le panier et de la durée de location (on l'arrondi pour eviter trop de virgules)
    jeuxPanier.forEach((jeu) => {
      total +=
        Math.round((jeu[0].prix * duree_location + Number.EPSILON) * 100) / 100;
    });
    setTotal(total);
  }, [jeuxPanier, duree_location]);

  useEffect(() => {
    async function recupererJeux() {
      const idsJeuxString = localStorage.getItem("ids_jeux");
      const idsJeux = idsJeuxString ? JSON.parse(idsJeuxString) : [];

      for (const element of idsJeux) {
        try {
          const response = await fetch(
            `http://localhost:8000/jeux/${element}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (response.ok) {
            const jeu = await response.json();
            console.log("Jeu récupéré avec succès:", jeu);
            setJeuxPanier((prevJeuxPanier) => [...prevJeuxPanier, jeu]);
          } else {
            console.log("Erreur lors de la récupération du jeu");
          }
        } catch (error) {
          console.error("Erreur lors de la récupération du jeu", error);
        }
      }
    }

    recupererJeux();
  }, []); // Liste vide à la fin pour faire le use effect qu'une seule fois au chargement de la page

  const getIdUtilisateur = async () => {
    // Fonction qui recupere l'id de l'utilisateur connecté
    // On a besoin de cet id pour ajouter les jeux dans la table location
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

  const ajouterJeu = async (id_utilisateur, id_jeu, duree_location) => {
    // Fonction qui ajoute un jeu à la table location
    const nouveauJeu = {
      id_utilisateur: id_utilisateur,
      id_jeu: id_jeu,
      duree_location: duree_location,
    };

    try {
      const response = await fetch("http://localhost:8000/location", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nouveauJeu),
      });

      if (response.ok) {
        console.log("Jeu ajouté avec succès");
      } else {
        console.log("Erreur lors de l'ajout du jeu");
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout du jeu", error);
    }
  };

  const viderPanier = () => {
    // Fonction qui vide le panier et qui recharge la page
    localStorage.setItem("ids_jeux", JSON.stringify([]));
    window.location.href = "/panier";
  };

  const validerPanier = async () => {
    // Fonction qui valide le panier en ajoutant les jeux dans la table location
    // Une fois que le panier est validé, on aurait voulu le vider mais on a pas réussi à le faire
    // car lorsqu'on supprime les idsJeux du localStorage et qu'on recharge la page, ils ne sont pas
    // ajoutés dans la table location

    const idUtilisateur = await getIdUtilisateur();

    if (idUtilisateur !== null) {
      const idsJeuxString = localStorage.getItem("ids_jeux");

      if (idsJeuxString) {
        const idsJeux = JSON.parse(idsJeuxString);

        if (idsJeux.length > 0) {
          idsJeux.forEach((id) => {
            ajouterJeu(idUtilisateur, id, duree_location);
            // on supprime  l'id du jeu du localStorage
            let idsLocalStorage = JSON.parse(localStorage.getItem("ids_jeux"));
            idsLocalStorage = idsLocalStorage.filter((idLocalStorage) => {
              return idLocalStorage !== id;
            });
            localStorage.setItem("ids_jeux", JSON.stringify(idsLocalStorage));
            // On supprime le jeu du panier
            console.log("Jeux panier", jeuxPanier)
            setJeuxPanier((prevJeuxPanier) => {
              return prevJeuxPanier.filter((jeu) => {
                return jeu[0].id !== id;
              });
            });
            console.log("Jeux panier", jeuxPanier)
          });
        } else {
          console.log("Le panier est vide");
        }
      }
    } else {
      console.log("Impossible de récupérer l'ID de l'utilisateur");
    }
  };

  return (
    <div className="panierContainer">
      {jeuxPanier.length > 0 && (
        <div className="viderPanierdiv">
          <button className="viderButton" onClick={viderPanier}>
            Vider le panier
          </button>
        </div>
      )}
      <div className="jeuContainer">
        {jeuxPanier.map((jeu, index) => (
          <div className="jeu" key={index}>
            <h2>{jeu[0].nom}</h2>
            {/* On arrondi le prix */}
            <h1>
              {Math.round(
                (jeu[0].prix * duree_location + Number.EPSILON) * 100
              ) / 100}
              $
            </h1>
            <div className="imgContainer">
              <img src={jeu[0].image} alt="" />
            </div>
          </div>
        ))}
      </div>
      <div className="total">
        <h1>Total : {total}$</h1>
      </div>
      <div className="submit">
        {jeuxPanier.length > 0 && (
          <label htmlFor="duree_location">Journées de location</label>
        )}

        {jeuxPanier.length > 0 && (
          <input
            type="number"
            min="1"
            max="30"
            value={duree_location}
            onChange={(e) => setDuree_location(e.target.value)}
          />
        )}
        {jeuxPanier.length > 0 && (
          <button className="submitPanierButton" onClick={validerPanier}>
            Valider le panier
          </button>
        )}
      </div>
    </div>
  );
}
