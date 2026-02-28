import './StatsCard.css';

export default function StatsCard({ icon: Icon, value, label, subtext, color = 'purple' }) {
    return (
        <div className={`stats-card stats-card-${color}`}>
            <div className="stats-card-icon">
                <Icon size={24} />
            </div>
            <div className="stats-card-content">
                <div className="stats-card-value">{value}</div>
                <div className="stats-card-label">{label}</div>
                {subtext && <div className="stats-card-sub">{subtext}</div>}
            </div>
        </div>
    );
}
