const express = require('express');
const cors = require('cors');
const app = express();
const mariadb = require('mariadb');
const bcrypt = require('bcrypt');


require('dotenv').config();

const pool = mariadb.createPool({
    user: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DTB,
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    connectionLimit: 1000,
});

app.use(cors());
app.use(express.json());


// 
// METHODS FOR USERS
// 

// GET

app.get('/users', async(req, res) => {
    let conn;
    try{
        console.log('Connexion à la database');
        conn = await pool.getConnection();
        console.log('Lancement de la requête');
        const rows = await conn.query('SELECT * FROM utilisateur');
        console.log(rows);
        res.status(200).json(rows);
    }
    catch(err){
        console.log('Erreur');
    }
});

app.get('/users/:name', async(req, res) => {
    let conn;
    try{
        conn = await pool.getConnection();
        const rows = await conn.query('SELECT * FROM utilisateur WHERE identifiant = ?', [req.params.name]);
        console.log(rows);
        res.status(200).json(rows);
    }
    catch{
        console.log('Erreur');
    }
});

// POST

app.post('/users', async (req, res) => {
    const newUser = req.body;
    let conn;
    let hash = bcrypt.hashSync(newUser.mot_de_passe, 10);
    try{
        conn = await pool.getConnection();
        const result = await conn.query('INSERT INTO utilisateur (identifiant, mot_de_passe, email) VALUES (?, ?, ?)', [
            newUser.username, 
            hash,
            newUser.email
        ]);
        console.log(result);
        res.status(201).json({ newUser });
    }
    catch{
        console.log('Erreur');
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

app.post('/users/login', async (req, res) => {
    const user = req.body;
    let conn;
    try{
        conn = await pool.getConnection();
        console.log(user);
        console.log('Lancement de la requête');
        const rows = await conn.query('SELECT * FROM utilisateur WHERE identifiant = ?', [user.username]);
        console.log('Résultat de la requête');
        console.log(rows);
        if(rows.length === 0){
            res.status(401).json({ message: 'Utilisateur non trouvé' });
        }
        else{
            if(bcrypt.compareSync(user.mot_de_passe, rows[0].mot_de_passe)){
                res.status(200).json({ message: 'Utilisateur connecté' });
            }
            else{
                res.status(401).json({ message: 'Mot de passe incorrect' });
            }
        }
    }
    catch{
        console.log('Erreur');
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// PUT

app.put('/users/:id', async (req, res) => {
    const newUser = req.body;
    let conn;

    try {
        conn = await pool.getConnection();
        const result = await conn.query('UPDATE utilisateur SET identifiant = ?, mot_de_passe = ?, email = ? WHERE id = ?', [
            newUser.username,
            newUser.mot_de_passe,
            newUser.email,
            req.params.id
        ]);
        console.log(result);

        // Vérifiez si la mise à jour a affecté des lignes (result.affectedRows > 0)
        if (result.affectedRows > 0) {
            res.status(201).json({ newUser });
        } else {
            res.status(404).json({ message: 'L\'utilisateur n\'a pas été trouvé.' });
        }
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// DELETE

app.delete('/users/:id', async (req, res) => {
    let conn;
    try{
        conn = await pool.getConnection();
        const result = await conn.query('DELETE FROM utilisateur WHERE id = ?', [req.params.id]);
        console.log(result);
        res.status(201).json({ message: 'Utilisateur supprimé' });
    }
    catch{
        console.log('Erreur');
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// 
// 
// 


// 
// METHODS FOR JEUX
// 

// GET

app.get('/jeux', async(req, res) => {
    let conn;
    try{
        console.log('Connexion à la database');
        conn = await pool.getConnection();
        console.log('Lancement de la requête');
        const rows = await conn.query('SELECT * FROM jeux');
        console.log(rows);
        res.status(200).json(rows);
    }
    catch(err){
        console.log('Erreur');
    }
});

app.get('/jeux/:id', async(req, res) => {
    let conn;
    try{
        conn = await pool.getConnection();
        const rows = await conn.query('SELECT * FROM jeux WHERE id = ?', [req.params.id]);
        console.log(rows);
        res.status(200).json(rows);
    }
    catch{
        console.log('Erreur');
    }
});

app.get('/rechercher', async (req, res) => {
    const { nom } = req.query; // Récupérer le paramètre nom de la requête
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query('SELECT * FROM jeux WHERE nom LIKE ?', [`%${nom}%`]);
        console.log(rows);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Erreur :', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des données' });
    }
});

// POST

app.post('/jeux', async (req, res) => {
    const newJeu = req.body;
    let conn;
    try{
        conn = await pool.getConnection();
        const result = await conn.query('INSERT INTO jeux (nom, prix, image) VALUES (?, ?, ?)', [
            newJeu.nom,
            newJeu.prix,
            newJeu.image
        ]);
        console.log(result);
        res.status(201).json({ newJeu });
    }
    catch{
        console.log('Erreur');
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// PUT

app.put('/jeux/:id', async (req, res) => {
    const newJeu = req.body;
    let conn;

    try {
        conn = await pool.getConnection();
        const result = await conn.query('UPDATE jeux SET nom = ?, prix = ?, image = ? WHERE id = ?', [
            newJeu.nom,
            newJeu.prix,
            newJeu.image,
            req.params.id
        ]);
        console.log(result);

        // Vérifiez si la mise à jour a affecté des lignes (result.affectedRows > 0)
        if (result.affectedRows > 0) {
            res.status(201).json({ newJeu });
        } else {
            res.status(404).json({ message: 'Le jeu n\'a pas été trouvé.' });
        }
    } catch (error) {
        console.error('Erreur lors de la mise à jour du jeu:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// DELETE

app.delete('/jeux/:id', async (req, res) => {
    let conn;
    try{
        conn = await pool.getConnection();
        const result = await conn.query('DELETE FROM jeux WHERE id = ?', [req.params.id]);
        console.log(result);
        res.status(201).json({ message: 'Jeu supprimé' });
    }
    catch{
        console.log('Erreur');
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// 
// 
// 


// 
// METHODS FOR LOCATION
// 

// GET

app.get('/location', async(req, res) => {
    let conn;
    try{
        console.log('Connexion à la database');
        conn = await pool.getConnection();
        console.log('Lancement de la requête');
        const rows = await conn.query('SELECT * FROM location');
        console.log(rows);
        res.status(200).json(rows);
    }
    catch(err){
        console.log('Erreur');
    }
});


app.get('/location/:id', async(req, res) => {
    // Requete qui récupere les locations d'un utilisateur en particulier
    let conn;
    try{
        conn = await pool.getConnection();
        const rows = await conn.query('SELECT * FROM location WHERE id_utilisateur = ?', [req.params.id]);
        console.log(rows);
        res.status(200).json(rows);
    }
    catch{
        console.log('Erreur');
    }
});

app.get('/afficher', async(req, res) => {
    let conn;
    try{
        console.log('ID du jeu :', req.query.id);
        console.log('Connexion à la database');
        conn = await pool.getConnection();
        console.log('Lancement de la requête');
        const rows = await conn.query('SELECT * FROM location WHERE id_jeu = ?', [req.query.id_jeu]);
        console.log(rows);
        res.status(200).json(rows);
    }
    catch(err){
        console.log('Erreur');
    }
});

// Methode qui récupere tous les ids des jeux loués par un utilisateur

app.get('/location/jeux/:id', async(req, res) => {
    let conn;
    try{
        conn = await pool.getConnection();
        const rows = await conn.query('SELECT id_jeu FROM location WHERE id_utilisateur = ?', [req.params.id]);
        console.log(rows);
        res.status(200).json(rows);
    }
    catch{
        console.log('Erreur');
    }
});

// POST


app.post('/location', async (req, res) => {
    const newLocation = req.body;
    let conn;
    console.log(newLocation)
    try{
        conn = await pool.getConnection();
        const result = await conn.query('INSERT INTO location (id_jeu, id_utilisateur, duree_location) VALUES (?, ?, ?)', [
            newLocation.id_jeu,
            newLocation.id_utilisateur,
            newLocation.duree_location,
        ]);
        console.log(result);
        res.status(201).json({ newLocation });
    }
    catch (error){
        console.log('Erreur' , error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// PUT

app.put('/location/:id', async (req, res) => {
    const newLocation = req.body;
    let conn;

    try {
        conn = await pool.getConnection();
        const result = await conn.query('UPDATE location SET note = ?, commentaire = ? WHERE id = ?', [
            newLocation.note,
            newLocation.commentaire,
            req.params.id
        ]);
        console.log(result);

        // Vérifiez si la mise à jour a affecté des lignes (result.affectedRows > 0)
        if (result.affectedRows > 0) {
            res.status(201).json({ newLocation });
        } else {
            res.status(404).json({ message: 'L\'emplacement n\'a pas été trouvé.' });
        }
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'emplacement:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    } finally {
        if (conn) {
            // Libérer la connexion après utilisation
            conn.release();
        }
    }
});


// DELETE

app.delete('/location/:id', async (req, res) => {
    let conn;
    try{
        conn = await pool.getConnection();
        const result = await conn.query('DELETE FROM location WHERE id = ?', [req.params.id]);
        console.log(result);
        res.status(201).json({ message: 'Location supprimée' });
    }
    catch{
        console.log('Erreur');
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

app.delete('/location' , async (req, res) => {
    let conn;
    try{
        conn = await pool.getConnection();
        const result = await conn.query('DELETE FROM location');
        console.log(result);
        res.status(201).json({ message: 'Location supprimée' });
    }
    catch{
        console.log('Erreur');
        res.status(500).json({ message: 'Erreur serveur' });
    }
}
);

// 
// 
// 

app.listen(8000, () => {
    console.log('Serveur démarré (port 8000)');
});