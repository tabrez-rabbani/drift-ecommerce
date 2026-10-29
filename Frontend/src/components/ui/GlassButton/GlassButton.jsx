import './GlassButton.css';

const GlassButton = ({ text, icon, type = "button", onClick, className = "", fullWidth = false }) => {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`glass-btn-primary ${fullWidth ? 'w-full' : ''} ${className}`}
        >
            <div className="glass-btn-inner">
                <span className="glass-btn-text">{text}</span>
                {icon && (
                    <div className="glass-btn-icon-circle">
                        <span className="material-symbols-outlined text-[18px]">{icon}</span>
                    </div>
                )}
            </div>
        </button>
    );
};

export default GlassButton;
