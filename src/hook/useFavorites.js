import { useState, useEffect } from 'react';

export const useFavorites = () => {
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

    return {
        favorites,
        addFavorite,
        removeFavorite,
        toggleFavorite,
        isFavorite,
        count: favorites.length
    };
};
