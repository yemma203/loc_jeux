import './App.css';
import Inscription from './components/Inscription';
import { Link, Routes, Route, Outlet } from 'react-router-dom';
import Connexion from './components/Connexion';
import Home from './components/Home';
import Panier from './components/Panier';
import JeuxLoues from './components/JeuxLoues';
import Commentaire from './components/Commentaire';
function App() {

  return (
    <>
      <nav>
        <div className='topLeft'>
          <Link to="/panier">Panier</Link>
          <Link to="/jeuxLoues">Jeux loués</Link>
        </div>
        <div className='logo'>
          <Link to="/">ShopGames</Link>
        </div>

        {/* On check si le localstorage contient le nom d'un utilisateur */}
        {/* Si oui, on affiche un bouton pour se déconnecter (quand on clique sur le bouton, on vide alors le localStorage) */}
        {/* Sinon, on affiche un bouton pour se connecter */}
        {localStorage.getItem('username') ? (
          <div className='panierLogout'>
            <button
              onClick={() => {
                localStorage.removeItem('username');
                localStorage.removeItem('ids_jeux');
                window.location.reload("/home");
              }}
            >
              Déconnexion
            </button>
          </div>
        ) : (
          <div className='log'>
            <Link to="/login">Connexion</Link>
            <Link to="/inscription">Inscription</Link>
          </div>
        )}
      </nav>

      <Routes>
        <Route path="/inscription" element={<Inscription />} />
        <Route path="/login" element={<Connexion />} />
        <Route path="/" element={<Home />} />
        <Route path="/panier" element={<Panier />} />
        <Route path="/jeuxLoues" element={<JeuxLoues />} />
        <Route path="/commentaire/:id" element={<Commentaire />} />
      </Routes>
    </>
  );
}

export default App;