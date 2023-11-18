import React from "react";
import { useState } from "react";

export default function Connexion() {
  // Les states
  const [username, setUsername] = useState("");
  const [mot_de_passe, setMot_de_passe] = useState("");
  const [users, setUsers] = useState([]);

  const handleLogin = async (e) => {
    // Fonction qui permet de connecter l'utilisateur, elle recupere les informations du body
    // Puis on fait une requete POST qui vérifie si l'utilisateur existe dans la base de données
    e.preventDefault();

    const user = {
      username: username,
      mot_de_passe: mot_de_passe,
    };
    try {
      const response = await fetch("http://localhost:8000/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      if (response.ok) {
        console.log("Utilisateur connecté avec succès");
        setUsername("");
        setMot_de_passe("");
        // On ajoute l'utilisateur dans le localStorage pour le connecter
        localStorage.setItem("username", username);
        window.location.href = "/";
      } else {
        console.log("Erreur lors de la connexion");
      }
    } catch (err) {
      console.error(err.message);
    }
  };
  return (
    <div className="logContainer">
      <h1>Connexion</h1>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="username">Nom d'utilisateur</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="mot_de_passe">Mot de passe</label>
          <input
            type="password"
            id="mot_de_passe"
            value={mot_de_passe}
            onChange={(e) => setMot_de_passe(e.target.value)}
          />
        </div>

        <button className="button" type="submit">Se connecter</button>
      </form>
    </div>
  );
}
