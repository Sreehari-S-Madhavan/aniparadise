/**
 * Navigation Header Component
 * Matches design from aniparadise_home_dashboard
 */

import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styles from './Navigation.module.css';

export default function Navigation() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.left}>
          <Link to="/" className={styles.logo}>
            <div className={styles.logoIcon}>
              <span className="material-symbols-outlined">movie_filter</span>
            </div>
            <h2 className={styles.logoText}>
              Ani<span className={styles.logoAccent}>Paradise</span>
            </h2>
          </Link>
          <nav className={styles.nav}>
            <Link to="/" className={location.pathname === '/' ? styles.navLinkActive : styles.navLink}>Home</Link>
            <Link to="/browse" className={location.pathname === '/browse' || location.pathname.startsWith('/anime/') ? styles.navLinkActive : styles.navLink}>Browse</Link>
            <Link to="/tracker" className={location.pathname === '/tracker' ? styles.navLinkActive : styles.navLink}>Tracker</Link>
            <Link to="/discussions" className={location.pathname === '/discussions' ? styles.navLinkActive : styles.navLink}>Discussions</Link>
            <Link to="/where-to-watch" className={location.pathname === '/where-to-watch' ? styles.navLinkActive : styles.navLink}>Where to Watch</Link>
          </nav>
        </div>
        <div className={styles.right}>
          {isAuthenticated ? (
            <>
              <div className={styles.searchContainer}>
                <span className="material-symbols-outlined">search</span>
                <input
                  type="text"
                  placeholder="Search anime..."
                  className={styles.searchInput}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      navigate(`/browse?q=${e.target.value}`);
                    }
                  }}
                />
              </div>
              <button className={styles.iconButton}>
                <span className="material-symbols-outlined">notifications</span>
                <span className={styles.notificationBadge}></span>
              </button>
              <button className={styles.iconButton} onClick={handleLogout}>
                <span className="material-symbols-outlined">logout</span>
              </button>
              {user && (
                <Link to="/profile" className={styles.avatar}>
                  <span className="material-symbols-outlined">account_circle</span>
                </Link>
              )}
            </>
          ) : (
            <>
              <Link to="/login" className={styles.loginButton}>Login</Link>
              <Link to="/register" className={styles.registerButton}>Register</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
