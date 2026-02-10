import { createContext, useContext, useState } from 'react';

// Créer le Context
const CompareContext = createContext();

// Provider qui va wrapper l'application
export const CompareProvider = ({ children, maxSelection = 3 }) => {
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

    const value = {
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

    return (
        <CompareContext.Provider value={value}>
            {children}
        </CompareContext.Provider>
    );
};

// Hook personnalisé pour utiliser le context facilement
export const useCompare = () => {
    const context = useContext(CompareContext);
    if (!context) {
        throw new Error('useCompare doit être utilisé dans un CompareProvider');
    }
    return context;
};
