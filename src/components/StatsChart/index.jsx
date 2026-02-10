import { useEffect, useRef } from 'react';
import './StatsChart.css';

const StatsChart = ({ stats }) => {
    const canvasRef = useRef(null);

    // Fonction pour calculer les points du radar
    const calculateRadarPoints = (values, centerX, centerY, radius) => {
        const angleStep = (Math.PI * 2) / values.length;
        return values.map((value, index) => {
            const angle = angleStep * index - Math.PI / 2; // Commence en haut
            const distance = (value / 255) * radius; // Normalise sur 255 (stat max Pokémon)
            return {
                x: centerX + Math.cos(angle) * distance,
                y: centerY + Math.sin(angle) * distance,
                angle: angle
            };
        });
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = 70; // Réduit pour laisser place aux labels

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Dessiner les cercles de fond (grille)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        for (let i = 1; i <= 5; i++) {
            ctx.beginPath();
            ctx.arc(centerX, centerY, (radius / 5) * i, 0, Math.PI * 2);
            ctx.stroke();
        }

        const statsArray = [
            { name: 'HP', value: stats.HP, color: '#ff5555' },
            { name: 'Atk', value: stats.Attack, color: '#ff9955' },
            { name: 'Def', value: stats.Defense, color: '#55aaff' },
            { name: 'SpA', value: stats.SpecialAttack, color: '#aa55ff' },
            { name: 'SpD', value: stats.SpecialDefense, color: '#55ff99' },
            { name: 'Spd', value: stats.Speed, color: '#ffff55' }
        ];

        const statValues = statsArray.map(s => s.value);
        const angleStep = (Math.PI * 2) / statValues.length;
        
        // Dessiner les axes avec labels
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 1;
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        for (let i = 0; i < statValues.length; i++) {
            const angle = angleStep * i - Math.PI / 2;
            
            // Ligne de l'axe
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(
                centerX + Math.cos(angle) * radius,
                centerY + Math.sin(angle) * radius
            );
            ctx.stroke();

            // Position du label (plus loin que le radar)
            const labelDistance = radius + 20;
            const labelX = centerX + Math.cos(angle) * labelDistance;
            const labelY = centerY + Math.sin(angle) * labelDistance;

            // Dessiner le nom de la stat avec sa couleur
            ctx.fillStyle = statsArray[i].color;
            ctx.fillText(statsArray[i].name, labelX, labelY);
        }

        // Dessiner le polygone des stats
        const points = calculateRadarPoints(statValues, centerX, centerY, radius);

        // Remplissage avec gradient
        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
        gradient.addColorStop(0, 'rgba(100, 108, 255, 0.4)');
        gradient.addColorStop(1, 'rgba(100, 108, 255, 0.1)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        points.forEach(point => ctx.lineTo(point.x, point.y));
        ctx.closePath();
        ctx.fill();

        // Contour plus épais
        ctx.strokeStyle = 'rgba(100, 108, 255, 1)';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Points avec valeurs
        ctx.font = 'bold 10px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        points.forEach((point, index) => {
            // Cercle du point
            ctx.fillStyle = statsArray[index].color;
            ctx.beginPath();
            ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
            ctx.fill();
            
            // Bordure blanche
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.stroke();
        });

    }, [stats]);

    const statsArray = [
        { name: 'PV', value: stats.HP, color: '#ff5555', max: 255 },
        { name: 'Attaque', value: stats.Attack, color: '#ff9955', max: 255 },
        { name: 'Défense', value: stats.Defense, color: '#55aaff', max: 255 },
        { name: 'Sp. Atk', value: stats.SpecialAttack, color: '#aa55ff', max: 255 },
        { name: 'Sp. Def', value: stats.SpecialDefense, color: '#55ff99', max: 255 },
        { name: 'Vitesse', value: stats.Speed, color: '#ffff55', max: 255 }
    ];

    // Calcul du total
    const totalStats = Object.values(stats).reduce((acc, val) => acc + val, 0);

    return (
        <div className="stats-chart-container">
            {/* Barres de progression */}
            <div className="stats-bars">
                <div className="stats-bars-header">
                    <h3 className="stats-title">Statistiques</h3>
                    <div className="stats-total">
                        <span className="total-label">Total</span>
                        <span className="total-value">{totalStats}</span>
                    </div>
                </div>
                
                {statsArray.map((stat) => {
                    const percentage = (stat.value / stat.max) * 100;
                    return (
                        <div key={stat.name} className="stat-bar-row">
                            <span className="stat-bar-label">{stat.name}</span>
                            <div className="stat-bar-container">
                                <div 
                                    className="stat-bar-fill" 
                                    style={{ 
                                        width: `${percentage}%`,
                                        backgroundColor: stat.color,
                                        boxShadow: `0 0 10px ${stat.color}80`
                                    }}
                                >
                                    <span className="stat-bar-value">{stat.value}</span>
                                </div>
                                <span className="stat-bar-max">/{stat.max}</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Radar Chart */}
            <div className="stats-radar">
                <h4 className="radar-title">Graphique Radar</h4>
                <div className="radar-canvas-wrapper">
                    <canvas 
                        ref={canvasRef} 
                        width="240" 
                        height="240"
                        className="radar-canvas"
                    />
                </div>
            </div>
        </div>
    );
};

export default StatsChart;
