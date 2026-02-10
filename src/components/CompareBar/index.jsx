import { useNavigate } from 'react-router';
import { useCompare } from '../../contexts/CompareContext';
import './CompareBar.css';

const CompareBar = () => {
    const { selectedPokemons, removeFromCompare, clearSelection, count, maxSelection } = useCompare();
    const navigate = useNavigate();

    if (count === 0) return null;

    const handleCompare = () => {
        navigate(`/compare?ids=${selectedPokemons.join(',')}`);
    };

    return (
        <div className="compare-bar">
            <div className="compare-bar-content">
                
                <div className="compare-info">
                    <span className="compare-count">
                        {count}/{maxSelection} sélectionné{count > 1 ? 's' : ''}
                    </span>
                    <button className="compare-clear" onClick={clearSelection}>
                        ✕ Tout effacer
                    </button>
                </div>

                <div className="compare-selected">
                    {selectedPokemons.map(id => (
                        <div key={id} className="compare-item">
                            <img 
                                src={`http://localhost:3000/assets/pokemons/${id}.png`}
                                alt={`Pokémon ${id}`}
                                className="compare-item-img"
                            />
                            <button 
                                className="compare-item-remove"
                                onClick={() => removeFromCompare(id)}
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>

                <button 
                    className="compare-action-btn"
                    onClick={handleCompare}
                    disabled={count < 2}
                >
                    Comparer {count >= 2 ? `(${count})` : ''}
                </button>

            </div>
        </div>
    );
};

export default CompareBar;
