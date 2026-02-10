import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router"; 
import { useToast } from "../hook/useToast";
import Toast from "../components/Toast";
import StatsChart from "../components/StatsChart";
import '../components/pokeCard/index.css';
import './pokemonDetails.css';

const PokemonDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { toasts, removeToast, success, error: showError } = useToast();
    
    const [pokemon, setPokemon] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    
    const [formData, setFormData] = useState({
        frenchName: "",
        hp: "",
        attack: "",
        defense: "",
        specialAttack: "",    // ✅ AJOUTÉ
        specialDefense: "",   // ✅ AJOUTÉ
        speed: ""
    });

    // --- GET ---
    useEffect(() => {
        fetch(`http://localhost:3000/pokemons/${id}`)
            .then((res) => {
                if (!res.ok) throw new Error("Pokémon introuvable");
                return res.json();
            })
            .then((data) => {
                setPokemon(data);
                setFormData({
                    frenchName: data.name.french,
                    hp: data.base.HP,
                    attack: data.base.Attack,
                    defense: data.base.Defense,
                    specialAttack: data.base.SpecialAttack,    // ✅ AJOUTÉ
                    specialDefense: data.base.SpecialDefense,  // ✅ AJOUTÉ
                    speed: data.base.Speed
                });
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                showError("Impossible de charger ce Pokémon");
                setLoading(false);
            });
    }, [id]);

    // --- DELETE ---
    const handleDelete = async () => {
        if (window.confirm(`⚠️ Es-tu sûr de vouloir supprimer ${pokemon.name.french} ?`)) {
            try {
                const response = await fetch(`http://localhost:3000/pokemons/${id}`, { 
                    method: 'DELETE' 
                });
                
                if (response.ok) {
                    success(`${pokemon.name.french} a été supprimé !`);
                    setTimeout(() => navigate('/'), 1500);
                } else {
                    showError("Échec de la suppression");
                }
            } catch (err) {
                showError("Erreur de connexion au serveur");
            }
        }
    };

    // --- UPDATE ---
    const handleUpdate = async (e) => {
        e.preventDefault();
        
        const updatedPokemon = {
            ...pokemon,
            name: { ...pokemon.name, french: formData.frenchName },
            base: { 
                HP: parseInt(formData.hp), 
                Attack: parseInt(formData.attack),
                Defense: parseInt(formData.defense),
                SpecialAttack: parseInt(formData.specialAttack),    // ✅ AJOUTÉ
                SpecialDefense: parseInt(formData.specialDefense),  // ✅ AJOUTÉ
                Speed: parseInt(formData.speed)
            }
        };

        try {
            const response = await fetch(`http://localhost:3000/pokemons/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedPokemon)
            });

            if (response.ok) {
                setPokemon(updatedPokemon);
                setIsEditing(false);
                success(`${formData.frenchName} a été modifié ! ✓`);
            } else {
                showError("Échec de la mise à jour");
            }
        } catch (err) {
            showError("Erreur de connexion au serveur");
        }
    };

    if (loading) return <p style={{color:'white', textAlign:'center', marginTop:'50px'}}>Chargement...</p>;
    if (!pokemon) return <p style={{color:'#ff5555', textAlign:'center', marginTop:'50px'}}>Pokémon introuvable</p>;

    const mainType = pokemon.type && pokemon.type.length > 0 ? pokemon.type[0].toLowerCase() : 'normal';
    const imageUrl = pokemon.image || `http://localhost:3000/assets/pokemons/${pokemon.id}.png`;

    return (
        <div className="details-container">
            {/* Toasts */}
            <div className="toast-container">
                {toasts.map(toast => (
                    <Toast
                        key={toast.id}
                        message={toast.message}
                        type={toast.type}
                        onClose={() => removeToast(toast.id)}
                        duration={toast.duration}
                    />
                ))}
            </div>

            <Link to="/" className="back-btn">← Retour au Pokédex</Link>
            
            <div className="details-card">
                
                <div className={`details-header-bg poke-type-${mainType}`}></div>

                <img src={imageUrl} alt={pokemon.name.french} className="details-image" />
                
                {isEditing ? (
                    <form onSubmit={handleUpdate} className="edit-form">
                        <h2 style={{margin:0}}>Modification</h2>
                        
                        <label className="edit-label">Nom</label>
                        <input className="edit-input" type="text" value={formData.frenchName} onChange={(e) => setFormData({...formData, frenchName: e.target.value})} />

                        {/* ✅ GRILLE 3 COLONNES POUR TOUTES LES STATS */}
                        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'10px'}}>
                            <div>
                                <label className="edit-label">PV</label>
                                <input className="edit-input" type="number" value={formData.hp} onChange={(e) => setFormData({...formData, hp: e.target.value})} />
                            </div>
                            <div>
                                <label className="edit-label">Attaque</label>
                                <input className="edit-input" type="number" value={formData.attack} onChange={(e) => setFormData({...formData, attack: e.target.value})} />
                            </div>
                            <div>
                                <label className="edit-label">Défense</label>
                                <input className="edit-input" type="number" value={formData.defense} onChange={(e) => setFormData({...formData, defense: e.target.value})} />
                            </div>
                            <div>
                                <label className="edit-label">Sp. Atk</label>
                                <input className="edit-input" type="number" value={formData.specialAttack} onChange={(e) => setFormData({...formData, specialAttack: e.target.value})} />
                            </div>
                            <div>
                                <label className="edit-label">Sp. Def</label>
                                <input className="edit-input" type="number" value={formData.specialDefense} onChange={(e) => setFormData({...formData, specialDefense: e.target.value})} />
                            </div>
                            <div>
                                <label className="edit-label">Vitesse</label>
                                <input className="edit-input" type="number" value={formData.speed} onChange={(e) => setFormData({...formData, speed: e.target.value})} />
                            </div>
                        </div>

                        <div className="actions-container">
                            <button type="submit" className="action-btn btn-save">💾 Sauvegarder</button>
                            <button type="button" onClick={() => setIsEditing(false)} className="action-btn btn-cancel">Annuler</button>
                        </div>
                    </form>
                ) : (
                    <>
                        <h1 className="details-title">
                            {pokemon.name.french} <span className="details-id">#{pokemon.id}</span>
                        </h1>
                        
                        <div className="types-container">
                            {pokemon.type.map(t => (
                                <span key={t} className={`type-badge poke-type-${t.toLowerCase()}`}>{t}</span>
                            ))}
                        </div>

                        {/* Graphiques de stats */}
                        <StatsChart stats={pokemon.base} />

                        <div className="actions-container">
                            <button onClick={() => setIsEditing(true)} className="action-btn btn-edit">✏️ Modifier</button>
                            <button onClick={handleDelete} className="action-btn btn-delete">🗑️ Supprimer</button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default PokemonDetails;
