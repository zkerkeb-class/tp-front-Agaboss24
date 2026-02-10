import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useToast } from "../hook/useToast";
import Toast from "../components/Toast";
import './pokemonAdd.css';

const POKEMON_TYPES = [
    "Normal", "Fire", "Water", "Grass", "Electric", "Ice", 
    "Fighting", "Poison", "Ground", "Flying", "Psychic", "Bug", 
    "Rock", "Ghost", "Dragon", "Steel", "Fairy"
];

const PokemonAdd = () => {
    const navigate = useNavigate();
    const { toasts, removeToast, success, error: showError } = useToast();
    
    const [formData, setFormData] = useState({
        id: "",
        frenchName: "",
        imageUrl: "",
        type1: "Normal",
        type2: "", 
        hp: 50,
        attack: 50,
        defense: 50,
        spAttack: 50,
        spDefense: 50,
        speed: 50
    });

    // État pour la preview de l'image
    const [imagePreview, setImagePreview] = useState("");
    const [imageError, setImageError] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Si c'est le champ imageUrl, on met à jour la preview
        if (name === 'imageUrl') {
            setImagePreview(value);
            setImageError(false);
        }
    };

    const handleImageError = () => {
        setImageError(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation de l'ID
        if (formData.id <= 0) {
            showError("L'ID doit être un nombre positif !");
            return;
        }

        const finalImage = formData.imageUrl.trim() !== "" 
            ? formData.imageUrl 
            : `http://localhost:3000/assets/pokemons/${formData.id}.png`;

        const newPokemon = {
            id: parseInt(formData.id),
            name: {
                english: formData.frenchName,
                japanese: formData.frenchName,
                chinese: formData.frenchName,
                french: formData.frenchName
            },
            type: [formData.type1, formData.type2].filter(t => t !== ""),
            base: {
                HP: parseInt(formData.hp),
                Attack: parseInt(formData.attack),
                Defense: parseInt(formData.defense),
                SpecialAttack: parseInt(formData.spAttack),
                SpecialDefense: parseInt(formData.spDefense),
                Speed: parseInt(formData.speed)
            },
            image: finalImage
        };

        try {
            const response = await fetch('http://localhost:3000/pokemons', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newPokemon)
            });

            if (response.ok) {
                success(`${formData.frenchName} a été ajouté avec succès ! 🎉`);
                setTimeout(() => navigate('/'), 1500);
            } else {
                const errorData = await response.json();
                console.error("Erreur Backend:", errorData);
                showError(errorData.error || "Erreur lors de la création");
            }
        } catch (err) {
            console.error(err);
            showError("Impossible de contacter le serveur");
        }
    };

    // Définir l'URL de preview
    const previewUrl = imagePreview.trim() !== "" 
        ? imagePreview 
        : (formData.id ? `http://localhost:3000/assets/pokemons/${formData.id}.png` : "");

    return (
        <div className="add-container">
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

            <div className="add-card">
                <h1 className="add-title">Nouveau Pokémon</h1>
                
                <form onSubmit={handleSubmit}>
                    
                    {/* --- IDENTITÉ --- */}
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Numéro (ID)</label>
                            <input 
                                required 
                                name="id" 
                                className="form-input" 
                                type="number" 
                                onChange={handleChange} 
                                placeholder="ex: 999" 
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Nom</label>
                            <input 
                                required 
                                name="frenchName" 
                                className="form-input" 
                                type="text" 
                                onChange={handleChange} 
                                placeholder="ex: Mewtwo" 
                            />
                        </div>
                    </div>

                    {/* --- PREVIEW D'IMAGE --- */}
                    <div className="image-preview-section">
                        <label className="form-label">URL de l'image (Internet)</label>
                        <input 
                            name="imageUrl" 
                            className="form-input" 
                            type="text" 
                            onChange={handleChange} 
                            placeholder="ex: https://i.imgur.com/..." 
                        />
                        
                        {/* Zone de preview */}
                        {previewUrl && (
                            <div className="image-preview-container">
                                {!imageError ? (
                                    <>
                                        <img 
                                            src={previewUrl} 
                                            alt="Preview" 
                                            className="image-preview"
                                            onError={handleImageError}
                                        />
                                        <p className="preview-label">Aperçu de l'image</p>
                                    </>
                                ) : (
                                    <div className="image-error">
                                        <span className="error-icon">⚠️</span>
                                        <p>Image introuvable</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* --- TYPES --- */}
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Type Principal</label>
                            <select name="type1" className="form-input" onChange={handleChange}>
                                {POKEMON_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Type Secondaire</label>
                            <select name="type2" className="form-input" onChange={handleChange}>
                                <option value="">- Aucun -</option>
                                {POKEMON_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="form-divider"></div>

                    {/* --- STATISTIQUES --- */}
                    <h3 className="section-title">Statistiques</h3>
                    
                    <div className="form-row">
                        <div className="form-group"><label className="form-label">PV</label><input required name="hp" className="form-input" type="number" onChange={handleChange} defaultValue="50" /></div>
                        <div className="form-group"><label className="form-label">Vitesse</label><input required name="speed" className="form-input" type="number" onChange={handleChange} defaultValue="50" /></div>
                    </div>
                    <div className="form-row">
                        <div className="form-group"><label className="form-label">Attaque</label><input required name="attack" className="form-input" type="number" onChange={handleChange} defaultValue="50" /></div>
                        <div className="form-group"><label className="form-label">Défense</label><input required name="defense" className="form-input" type="number" onChange={handleChange} defaultValue="50" /></div>
                    </div>
                    <div className="form-row">
                        <div className="form-group"><label className="form-label">Sp. Atk</label><input required name="spAttack" className="form-input" type="number" onChange={handleChange} defaultValue="50" /></div>
                        <div className="form-group"><label className="form-label">Sp. Def</label><input required name="spDefense" className="form-input" type="number" onChange={handleChange} defaultValue="50" /></div>
                    </div>

                    {/* --- BOUTONS --- */}
                    <div className="form-actions">
                        <button type="submit" className="btn-submit">✨ Créer le Pokémon</button>
                        <Link to="/" className="btn-cancel">Annuler</Link>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default PokemonAdd;
