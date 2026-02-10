import { useState, useEffect } from "react";
import { Link } from "react-router";
import { useFavorites } from "../contexts/FavoritesContext";
import PokeCard from "../components/pokeCard";
import Loader from "../components/Loader";
import './Favorites.css';

const Favorites = () => {
    const { favorites } = useFavorites();
    const [pokemons, setPokemons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState('id'); // id, name, type

    useEffect(() => {
        if (favorites.length === 0) {
            setLoading(false);
            return;
        }

        setLoading(true);
        
        // Charger tous les Pokémon favoris
        const fetchPromises = favorites.map(id => 
            fetch(`http://localhost:3000/pokemons/${id}`).then(res => res.json())
        );

        Promise.all(fetchPromises)
            .then(data => {
                setPokemons(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [favorites]);

    // Fonction de tri
    const sortPokemons = (pokemons, sortType) => {
        const sorted = [...pokemons];
        
        switch(sortType) {
            case 'name':
                return sorted.sort((a, b) => a.name.french.localeCompare(b.name.french));
            case 'id':
                return sorted.sort((a, b) => a.id - b.id);
            case 'hp':
                return sorted.sort((a, b) => b.base.HP - a.base.HP);
            case 'attack':
                return sorted.sort((a, b) => b.base.Attack - a.base.Attack);
            case 'defense':
                return sorted.sort((a, b) => b.base.Defense - a.base.Defense);
            case 'speed':
                return sorted.sort((a, b) => b.base.Speed - a.base.Speed);
            default:
                return sorted;
        }
    };

    const sortedPokemons = sortPokemons(pokemons, sortBy);

    if (loading) return <Loader message="Chargement de vos favoris..." />;

    return (
        <div className="favorites-container">
            <Link to="/" className="back-btn">← Retour au Pokédex</Link>

            <div className="favorites-header">
                <h1 className="favorites-title">
                    ❤️ Mes Favoris
                    <span className="favorites-count">({favorites.length})</span>
                </h1>

                {favorites.length > 0 && (
                    <div className="sort-controls">
                        <label className="sort-label">Trier par :</label>
                        <select 
                            className="sort-select" 
                            value={sortBy} 
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="id">Numéro</option>
                            <option value="name">Nom (A-Z)</option>
                            <option value="hp">PV (max → min)</option>
                            <option value="attack">Attaque (max → min)</option>
                            <option value="defense">Défense (max → min)</option>
                            <option value="speed">Vitesse (max → min)</option>
                        </select>
                    </div>
                )}
            </div>

            {favorites.length === 0 ? (
                <div className="empty-favorites">
                    <div className="empty-icon">💔</div>
                    <h2>Aucun favori pour le moment</h2>
                    <p>Cliquez sur le cœur des Pokémon pour les ajouter à vos favoris !</p>
                    <Link to="/" className="explore-btn">Explorer le Pokédex</Link>
                </div>
            ) : (
                <ul className="favorites-list">
                    {sortedPokemons.map((pokemon) => (
                        <PokeCard key={pokemon.id} pokemon={pokemon} />
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Favorites;
