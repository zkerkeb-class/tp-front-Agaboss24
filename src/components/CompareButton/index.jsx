import { useCompare } from '../../contexts/CompareContext';
import './CompareButton.css';

const CompareButton = ({ pokemonId, size = 'medium' }) => {
    const { isSelected, toggleCompare, canAddMore } = useCompare();
    const selected = isSelected(pokemonId);

    const handleClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (!selected && !canAddMore()) {
            alert('Vous pouvez comparer maximum 3 Pokémon !');
            return;
        }
        
        toggleCompare(pokemonId);
    };

    return (
        <button 
            className={`compare-btn compare-btn-${size} ${selected ? 'is-selected' : ''}`}
            onClick={handleClick}
            title={selected ? "Retirer de la comparaison" : "Ajouter à la comparaison"}
        >
            {selected ? '✓' : '+'}
        </button>
    );
};

export default CompareButton;
