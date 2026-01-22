import { Link, useLocation } from 'react-router-dom';
import './Header.css';

function Header({ theme, toggleTheme }) {
    const location = useLocation();

    const navItems = [
        { path: '/', label: 'Dashboard', icon: '📊' },
        { path: '/licenses', label: 'Licenses', icon: '📝' },
        { path: '/optimization', label: 'Optimization', icon: '⚡' },
        { path: '/analytics', label: 'Analytics', icon: '📈' },
        { path: '/audit', label: 'Audit Risk', icon: '🛡️' },
    ];

    return (
        <header className="header">
            <div className="header-container container">
                <div className="header-left">
                    <div className="logo">
                        <span className="logo-icon gradient-text">2</span>
                        <span className="logo-text">Data</span>
                        <span className="logo-subtitle">License Manager</span>
                    </div>
                </div>

                <nav className="nav">
                    {navItems.map(item => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                        >
                            <span className="nav-icon">{item.icon}</span>
                            <span className="nav-label">{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="header-right">
                    <button
                        className="theme-toggle btn-secondary btn-sm"
                        onClick={toggleTheme}
                        aria-label="Toggle theme"
                    >
                        {theme === 'light' ? '🌙' : '☀️'}
                    </button>
                </div>
            </div>
        </header>
    );
}

export default Header;
