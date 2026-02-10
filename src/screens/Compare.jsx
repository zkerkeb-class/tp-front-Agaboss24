import { useState, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router";
import Loader from "../components/Loader";
import './Compare.css';

const Compare = () => {
    const [searchParams] = useSearchParams();
    const [pokemons, setPokemons] = useState([]);
    const [loading, setLoading] = useState(true);
    const canvasRef = useRef(null);

    const ids = searchParams.get('ids')?.split(',').map(id => parseInt(id)) || [];

    useEffect(() => {
        if (ids.length === 0) {
            setLoading(false);
            return;
        }

        setLoading(true);
        
        const fetchPromises = ids.map(id => 
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
    }, []);

    // Dessiner le radar superposé
    useEffect(() => {
        if (pokemons.length === 0 || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = 120;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Grille de fond
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        for (let i = 1; i <= 5; i++) {
            ctx.beginPath();
            ctx.arc(centerX, centerY, (radius / 5) * i, 0, Math.PI * 2);
            ctx.stroke();
        }

        const statNames = ['HP', 'Atk', 'Def', 'SpA', 'SpD', 'Spd'];
        const angleStep = (Math.PI * 2) / 6;

        // Axes et labels
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        for (let i = 0; i < 6; i++) {
            const angle = angleStep * i - Math.PI / 2;
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(centerX + Math.cos(angle) * radius, centerY + Math.sin(angle) * radius);
            ctx.stroke();

            const labelDistance = radius + 30;
            const labelX = centerX + Math.cos(angle) * labelDistance;
            const labelY = centerY + Math.sin(angle) * labelDistance;
            ctx.fillText(statNames[i], labelX, labelY);
        }

        // Dessiner chaque Pokémon
        const colors = [
            { fill: 'rgba(255, 85, 85, 0.3)', stroke: 'rgba(255, 85, 85, 1)' },
            { fill: 'rgba(85, 144, 240, 0.3)', stroke: 'rgba(85, 144, 240, 1)' },
            { fill: 'rgba(76, 175, 80, 0.3)', stroke: 'rgba(76, 175, 80, 1)' }
        ];

        pokemons.forEach((pokemon, index) => {
            const stats = [
                pokemon.base.HP,
                pokemon.base.Attack,
                pokemon.base.Defense,
                pokemon.base.SpecialAttack,
                pokemon.base.SpecialDefense,
                pokemon.base.Speed
            ];

            const points = stats.map((stat, i) => {
                const angle = angleStep * i - Math.PI / 2;
                const distance = (stat / 255) * radius;
                return {
                    x: centerX + Math.cos(angle) * distance,
                    y: centerY + Math.sin(angle) * distance
                };
            });

            // Remplissage
            ctx.fillStyle = colors[index].fill;
            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y);
            points.forEach(point => ctx.lineTo(point.x, point.y));
            ctx.closePath();
            ctx.fill();

            // Contour
            ctx.strokeStyle = colors[index].stroke;
            ctx.lineWidth = 3;
            ctx.stroke();

            // Points
            ctx.fillStyle = colors[index].stroke;
            points.forEach(point => {
                ctx.beginPath();
                ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
                ctx.fill();
            });
        });

    }, [pokemons]);

    if (loading) return <Loader message="Chargement de la comparaison..." />;

    if (pokemons.length < 2) {
        return (
            <div className="compare-empty">
                <h2>Sélectionnez au moins 2 Pokémon pour comparer</h2>
                <Link to="/" className="back-btn">← Retour au Pokédex</Link>
            </div>
        );
    }

    const totalStats = (pokemon) => Object.values(pokemon.base).reduce((a, b) => a + b, 0);

    return (
        <div className="compare-container">
            <Link to="/" className="back-btn">← Retour au Pokédex</Link>

            <h1 className="compare-title">⚔️ Comparaison</h1>

            {/* Cartes côte à côte */}
            <div className="compare-cards">
                {pokemons.map((pokemon, index) => {
                    const imageUrl = pokemon.image || `http://localhost:3000/assets/pokemons/${pokemon.id}.png`;
                    const mainType = pokemon.type[0].toLowerCase();
                    const borderColors = ['#ff5555', '#5590f0', '#4caf50'];

                    return (
                        <div 
                            key={pokemon.id} 
                            className="compare-card"
                            style={{ borderColor: borderColors[index] }}
                        >
                            <div className={`compare-card-header poke-type-${mainType}`}>
                                <h2>{pokemon.name.french}</h2>
                                <span>#{pokemon.id}</span>
                            </div>

                            <img src={imageUrl} alt={pokemon.name.french} className="compare-image" />

                            <div className="compare-types">
                                {pokemon.type.map(t => (
                                    <span key={t} className={`type-badge poke-type-${t.toLowerCase()}`}>
                                        {t}
                                    </span>
                                ))}
                            </div>

                            <div className="compare-stats">
                                <div className="stat-row"><span>PV</span><strong>{pokemon.base.HP}</strong></div>
                                <div className="stat-row"><span>Attaque</span><strong>{pokemon.base.Attack}</strong></div>
                                <div className="stat-row"><span>Défense</span><strong>{pokemon.base.Defense}</strong></div>
                                <div className="stat-row"><span>Sp. Atk</span><strong>{pokemon.base.SpecialAttack}</strong></div>
                                <div className="stat-row"><span>Sp. Def</span><strong>{pokemon.base.SpecialDefense}</strong></div>
                                <div className="stat-row"><span>Vitesse</span><strong>{pokemon.base.Speed}</strong></div>
                                <div className="stat-row total"><span>TOTAL</span><strong>{totalStats(pokemon)}</strong></div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Radar superposé */}
            <div className="compare-radar-section">
                <h2 className="radar-section-title">Comparaison Visuelle</h2>
                <div className="radar-wrapper">
                    <canvas 
                        ref={canvasRef} 
                        width="400" 
                        height="400"
                        className="compare-radar-canvas"
                    />
                </div>
                
                {/* Légende */}
                <div className="compare-legend">
                    {pokemons.map((pokemon, index) => {
                        const colors = ['#ff5555', '#5590f0', '#4caf50'];
                        return (
                            <div key={pokemon.id} className="legend-item">
                                <div 
                                    className="legend-color" 
                                    style={{ backgroundColor: colors[index] }}
                                />
                                <span>{pokemon.name.french}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Compare;
