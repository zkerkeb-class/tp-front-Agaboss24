import { Link } from "react-router"; 
import './index.css';
import PokeTitle from "./pokeTitle";
import PokeImage from "./pokeImage";
import FavoriteButton from "../FavoriteButton";
import CompareButton from "../CompareButton";

const PokeCard = ({ pokemon, showFavoriteBtn = true, showCompareBtn = true }) => {
    
    const mainType = pokemon.type && pokemon.type.length > 0 
        ? pokemon.type[0].toLowerCase() 
        : 'normal';

    // Utilise l'URL de la BDD si elle existe, sinon fallback sur l'image locale
    const imageUrl = pokemon.image || `http://localhost:3000/assets/pokemons/${pokemon.id}.png`;

    // Petit helper pour raccourcir les noms
    const formatStatName = (name) => {
        const mapping = { 'HP': 'HP', 'Attack': 'Atk', 'Defense': 'Def', 'SpecialAttack': 'SpA', 'SpecialDefense': 'SpD', 'Speed': 'Speed' };
        return mapping[name] || name;
    };

    return (
        <Link to={`/pokemonDetails/${pokemon.id}`} style={{ textDecoration: 'none' }}>
            <div className="poke-card">
                
                {/* Bouton Comparer en haut à gauche */}
                {showCompareBtn && <CompareButton pokemonId={pokemon.id} size="medium" />}
                
                {/* Bouton Favori en haut à droite */}
                {showFavoriteBtn && <FavoriteButton pokemonId={pokemon.id} size="medium" />}
                
                <div className={`poke-card-header poke-type-${mainType}`}>
                    <PokeTitle name={pokemon.name.french} />
                </div>

                <div className="poke-image-background">
                    <PokeImage imageUrl={imageUrl} />
                </div>

                <div className="poke-stats-container">
                    {Object.entries(pokemon.base).map(([statName, statValue]) => (
                        <div className="poke-stat-row" key={statName}>
                            <span>{formatStatName(statName)}</span>
                            <span className="poke-stat-value">{statValue}</span>
                        </div>
                    ))}    
                </div>

            </div>
        </Link>
    );
}

export default PokeCard;
