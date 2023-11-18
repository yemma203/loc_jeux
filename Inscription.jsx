import React from "react";
import { useState } from "react";

export default function Inscription() {
  // Les states
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [mot_de_passe, setMot_de_passe] = useState("");

  const handleAddUser = async (e) => {
    e.preventDefault();

    const newUser = {
      username: username,
      email: email,
      mot_de_passe: mot_de_passe,
    };

    try {
      // Ajouter l'utilisateur dans la base de données
      const response = await fetch("http://localhost:8000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        console.log("Utilisateur ajouté avec succès");
        // On vide les champs
        setUsername("");
        setEmail("");
        setMot_de_passe("");
        // On ajoute l'utilisateur dans le localStorage pour le connecter
        localStorage.setItem("username", username);
        window.location.href = "/";
      } else {
        console.log("Erreur lors de l'ajout de l'utilisateur");
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <div className="logContainer">
      <h1>Inscription</h1>
      <form onSubmit={handleAddUser}>
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
          <label htmlFor="email">Email</label>
          <input
            type="text"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="mot_de_passe">Mot de passe</label>
          <input
            type="text"
            id="mot_de_passe"
            value={mot_de_passe}
            onChange={(e) => setMot_de_passe(e.target.value)}
          />
        </div>

        <button className="button" type="submit">S'inscrire</button>
      </form>
    </div>
  );
}
