import React from "react";
import { useState } from "react";

export default function Commentaire() {
  // Les states
  const [commentaire, setCommentaire] = useState("");
  const [note, setNote] = useState(0);

  const handleSubmit = (event) => {
    // Fonction qui envoie le commentaire et la note dans la table location avec la méthode PUT
    event.preventDefault();

    fetch(`http://localhost:8000/location/${localStorage.getItem("idLoc")}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        commentaire: commentaire,
        note: note,
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        console.log("Success:", result)
        window.location.href = "/";
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  return (
    <div className="logContainer">
      <form onSubmit={handleSubmit}>
        <div>
          <h1 className="txtCom">Commentaire:</h1>
          <input
            type="text"
            value={commentaire}
            onChange={(event) => setCommentaire(event.target.value)}
          />
        </div>
        <div>
          <h1 className="txtCom">Note:</h1>
          <input
            type="number"
            min="0"
            max="5"
            value={note}
            onChange={(event) => setNote(event.target.value)}
          />
        </div>
        <input className="button" type="submit" value="Envoyer" />
      </form>
    </div>
  );
}
