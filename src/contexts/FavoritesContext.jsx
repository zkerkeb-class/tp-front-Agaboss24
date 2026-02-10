import { createContext, useContext, useState, useEffect } from 'react';

// Créer le Context
const FavoritesContext = createContext();

// Provider qui va wrapper l'application
export const FavoritesProvider = ({ children }) => {
    const [favorites, setFavorites] = useState([]);

    // Charger les favoris depuis localStorage au démarrage
    useEffect(() => {
        const storedFavorites = localStorage.getItem('pokemonFavorites');
        if (storedFavorites) {
            setFavorites(JSON.parse(storedFavorites));
        }
    }, []);

    // Sauvegarder dans localStorage à chaque changement
    useEffect(() => {
        localStorage.setItem('pokemonFavorites', JSON.stringify(favorites));
    }, [favorites]);

    // Ajouter un favori
    const addFavorite = (pokemonId) => {
        if (!favorites.includes(pokemonId)) {
            setFavorites([...favorites, pokemonId]);
        }
    };

    // Retirer un favori
    const removeFavorite = (pokemonId) => {
        setFavorites(favorites.filter(id => id !== pokemonId));
    };

    // Toggle (ajouter ou retirer)
    const toggleFavorite = (pokemonId) => {
        if (favorites.includes(pokemonId)) {
            removeFavorite(pokemonId);
        } else {
            addFavorite(pokemonId);
        }
    };

    // Vérifier si un Pokémon est favori
    const isFavorite = (pokemonId) => {
        return favorites.includes(pokemonId);
    };

    const value = {
        favorites,
        addFavorite,
        removeFavorite,
        toggleFavorite,
        isFavorite,
        count: favorites.length
    };

    return (
        <FavoritesContext.Provider value={value}>
            {children}
        </FavoritesContext.Provider>
    );
};

// Hook personnalisé pour utiliser le context facilement
export const useFavorites = () => {
    const context = useContext(FavoritesContext);
    if (!context) {
        throw new Error('useFavorites doit être utilisé dans un FavoritesProvider');
    }
    return context;
};
