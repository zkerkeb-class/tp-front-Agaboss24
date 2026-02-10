import { useState, useEffect } from "react";
import PokeCard from "../pokeCard";
import Loader from "../Loader";
import CompareBar from "../CompareBar";
import './index.css';
import { Link } from "react-router";

const POKEMON_TYPES = [
    "Normal", "Fire", "Water", "Grass", "Electric", "Ice", 
    "Fighting", "Poison", "Ground", "Flying", "Psychic", "Bug", 
    "Rock", "Ghost", "Dragon", "Steel", "Fairy"
];

const PokeList = () => {
    const [pokemons, setPokemons] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [searchTerm, setSearchTerm] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    
    const [selectedTypes, setSelectedTypes] = useState([]); 

    useEffect(() => {
        if (isSearching) return;

        setLoading(true);
        setError(null);
        
        const url = new URL('http://localhost:3000/pokemons');
        url.searchParams.append('page', page);

        if (selectedTypes.length > 0) {
            selectedTypes.forEach(type => {
                url.searchParams.append('type', type);
            });
        }

        fetch(url)
            .then((res) => {
                if (!res.ok) throw new Error("Erreur serveur ou connexion");
                return res.json();
            })
            .then((data) => {
                setPokemons(data.pokemons);
                setTotalPages(data.totalPages);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setError(err.message);
                setLoading(false);
            });
    }, [page, selectedTypes, isSearching]);

    const handleTypeClick = (type) => {
        setPage(1);
        setSearchTerm("");
        setIsSearching(false);

        if (type === "Tous") {
            setSelectedTypes([]); 
            return;
        }

        if (selectedTypes.includes(type)) {
            setSelectedTypes(selectedTypes.filter(t => t !== type));
        } else {
            setSelectedTypes([...selectedTypes, type]);
        }
    };

    // ✅ FONCTION DE RECHERCHE CORRIGÉE
    const performSearch = () => {
        const trimmedSearch = searchTerm.trim();
        
        if (trimmedSearch === "") {
            resetSearch();
            return;
        }

        setLoading(true);
        setSelectedTypes([]); 
        
        fetch(`http://localhost:3000/search?name=${trimmedSearch}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.error || !data.id) {
                    alert("Pokémon introuvable !");
                    setLoading(false);
                } else {
                    setPokemons([data]);
                    setIsSearching(true);
                    setLoading(false);
                }
            })
            .catch((err) => {
                console.error(err);
                alert("Erreur lors de la recherche");
                setLoading(false);
            });
    };

    // ✅ Handler pour le submit du formulaire
    const handleSearch = (e) => {
        e.preventDefault();
        e.stopPropagation();
        performSearch();
    };

    // ✅ Handler pour le bouton de recherche (sécurité supplémentaire)
    const handleSearchClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        performSearch();
    };

    const resetSearch = () => {
        setSearchTerm("");
        setIsSearching(false);
        setSelectedTypes([]);
        setPage(1);
    };

    if (loading) return <Loader message="Chargement des Pokémon..." />;
    
    if (error) return <p style={{color:'#ff4757', textAlign:'center', marginTop:'20px'}}>Erreur : {error}</p>;

    return (
        <div className="poke-list-container">
            
            <h2 className="main-pokedex-title">
                Pokédex <span style={{fontSize: '1.5rem', verticalAlign: 'middle', color: '#666'}}>
                    {isSearching 
                        ? "(Recherche)" 
                        : (selectedTypes.length > 0 ? `(${selectedTypes.join(' + ')})` : `#${page}`)
                    }
                </span>
            </h2>

            {/* Bouton Mes Favoris */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
                <Link to="/favorites" className="nav-btn">
                    Mes Favoris
                </Link>
            </div>

            {/* ✅ FORMULAIRE DE RECHERCHE CORRIGÉ */}
            <form onSubmit={handleSearch} className="search-container">
                <input 
                    type="text" 
                    className="search-input"
                    placeholder="Rechercher un Pokémon (ex: Pikachu)..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => {
                        // Recherche aussi quand on appuie sur Entrée
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            performSearch();
                        }
                    }}
                />
                <button 
                    type="button" 
                    className="search-btn" 
                    title="Rechercher"
                    onClick={handleSearchClick}
                >
                    🔍
                </button>
                
                {isSearching && (
                    <button 
                        type="button" 
                        onClick={resetSearch} 
                        className="reset-btn" 
                        title="Effacer la recherche"
                    >
                        ✕
                    </button>
                )}
            </form>

            <div className="filters-container">
                <button
                    className={`filter-btn ${selectedTypes.length === 0 ? 'active' : ''}`}
                    onClick={() => handleTypeClick("Tous")}
                >
                    TOUS
                </button>

                {POKEMON_TYPES.map((type) => (
                    <button
                        key={type}
                        className={`filter-btn ${selectedTypes.includes(type) ? 'active' : ''}`}
                        onClick={() => handleTypeClick(type)}
                    >
                        {type}
                    </button>
                ))}
            </div>

            <ul className="poke-list">
                {pokemons.map((pokemon) => (
                    <PokeCard key={pokemon.id} pokemon={pokemon} />
                ))}
            </ul>

            {!isSearching && (
                <div className="pagination-container">
                    <button 
                        className="pagination-btn"
                        disabled={page === 1} 
                        onClick={() => setPage(page - 1)}
                    >
                        ← Précédent
                    </button>
                    
                    <span className="pagination-info">Page {page} / {totalPages}</span>
                    
                    <button 
                        className="pagination-btn"
                        disabled={page === totalPages} 
                        onClick={() => setPage(page + 1)}
                    >
                        Suivant →
                    </button>
                </div>
            )}

            <Link to="/add" className="fab-add" title="Ajouter un Pokémon">
                +
            </Link>

            {/* Barre de comparaison */}
            <CompareBar />
        </div>
    );
};

export default PokeList;
