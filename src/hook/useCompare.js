import { useState } from 'react';

export const useCompare = (maxSelection = 3) => {
    const [selectedPokemons, setSelectedPokemons] = useState([]);

    // Ajouter un Pokémon à la sélection
    const addToCompare = (pokemonId) => {
        if (selectedPokemons.length < maxSelection && !selectedPokemons.includes(pokemonId)) {
            setSelectedPokemons([...selectedPokemons, pokemonId]);
            return true;
        }
        return false;
    };

    // Retirer un Pokémon de la sélection
    const removeFromCompare = (pokemonId) => {
        setSelectedPokemons(selectedPokemons.filter(id => id !== pokemonId));
    };

    // Toggle (ajouter ou retirer)
    const toggleCompare = (pokemonId) => {
        if (selectedPokemons.includes(pokemonId)) {
            removeFromCompare(pokemonId);
        } else {
            return addToCompare(pokemonId);
        }
    };

    // Vérifier si un Pokémon est sélectionné
    const isSelected = (pokemonId) => {
        return selectedPokemons.includes(pokemonId);
    };

    // Réinitialiser la sélection
    const clearSelection = () => {
        setSelectedPokemons([]);
    };

    // Vérifier si on peut encore ajouter
    const canAddMore = () => {
        return selectedPokemons.length < maxSelection;
    };

    return {
        selectedPokemons,
        addToCompare,
        removeFromCompare,
        toggleCompare,
        isSelected,
        clearSelection,
        canAddMore,
        count: selectedPokemons.length,
        maxSelection
    };
};
