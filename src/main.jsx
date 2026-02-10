import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";
import './index.css'
import App from './App.jsx'
import PokemonDetails from './screens/pokemonDetails.jsx'
import PokemonAdd from './screens/PokemonAdd.jsx'
import Favorites from './screens/Favorites.jsx'
import Compare from './screens/Compare.jsx'

// Importer les Providers
import { FavoritesProvider } from './contexts/FavoritesContext.jsx'
import { CompareProvider } from './contexts/CompareContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      {/* Wrapper toute l'app avec les Providers */}
      <FavoritesProvider>
        <CompareProvider>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/pokemonDetails/:id" element={<PokemonDetails />} />
            <Route path="/add" element={<PokemonAdd />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/compare" element={<Compare />} />
          </Routes>
        </CompareProvider>
      </FavoritesProvider>
    </BrowserRouter>
  </StrictMode>,
)
