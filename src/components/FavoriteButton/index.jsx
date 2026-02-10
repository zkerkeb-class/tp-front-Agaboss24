import { useFavorites } from '../../contexts/FavoritesContext';
import './FavoriteButton.css';

const FavoriteButton = ({ pokemonId, size = 'medium' }) => {
    const { isFavorite, toggleFavorite } = useFavorites();
    const isFav = isFavorite(pokemonId);

    const handleClick = (e) => {
        e.preventDefault(); // Empêche la navigation vers les détails
        e.stopPropagation();
        toggleFavorite(pokemonId);
    };

    return (
        <button 
            className={`favorite-btn favorite-btn-${size} ${isFav ? 'is-favorite' : ''}`}
            onClick={handleClick}
            title={isFav ? "Retirer des favoris" : "Ajouter aux favoris"}
        >
            {isFav ? '❤️' : '🤍'}
        </button>
    );
};

export default FavoriteButton;
