import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
    const { isAuthenticated, user, logout } = useAuth();

    return (
        <nav className="navbar">
            <div className="container">
                <div className="flex items-center justify-between py-4">
                    <Link to="/" className="logo">
                        <span className="text-gradient font-bold" style={{ fontSize: '1.5rem' }}>
                            ⚡ CodeReview AI
                        </span>
                    </Link>

                    <div className="flex items-center gap-6">
                        {isAuthenticated ? (
                            <>
                                <Link to="/dashboard" className="text-secondary hover:text-primary">
                                    Dashboard
                                </Link>
                                <Link to="/settings" className="text-secondary hover:text-primary">
                                    Settings
                                </Link>
                                <div className="flex items-center gap-3">
                                    <img
                                        src={user.avatar_url}
                                        alt={user.name}
                                        className="rounded-full"
                                        style={{ width: '32px', height: '32px' }}
                                    />
                                    <span className="text-secondary">{user.login}</span>
                                    <button onClick={logout} className="btn btn-sm btn-secondary">
                                        Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <a href="#features" className="text-secondary hover:text-primary">
                                    Features
                                </a>
                                <a href="#pricing" className="text-secondary hover:text-primary">
                                    Pricing
                                </a>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

const navbarStyle = `
.navbar {
  position: sticky;
  top: 0;
  z-index: var(--z-sticky);
  background: rgba(13, 13, 26, 0.8);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border-color);
}
`;

// Inject styles
if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = navbarStyle;
    document.head.appendChild(style);
}
