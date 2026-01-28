/**
 * Navigation Header Component
 * Matches design from aniparadise_home_dashboard
 */

import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styles from './Navigation.module.css';

export default function Navigation() {
  const { isAuthenticated, user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.left}>
          <button
            className={styles.menuToggle}
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined">
              {isMobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
          <Link to="/" className={styles.logo} onClick={closeMobileMenu}>
            <div className={styles.logoIcon}>
              <span className="material-symbols-outlined">movie_filter</span>
            </div>
            <h2 className={styles.logoText}>
              Ani<span className={styles.logoAccent}>Paradise</span>
            </h2>
          </Link>
          <nav className={`${styles.nav} ${isMobileMenuOpen ? styles.navOpen : ''}`}>
            <Link to="/" className={location.pathname === '/' ? styles.navLinkActive : styles.navLink} onClick={closeMobileMenu}>Home</Link>
            <Link to="/browse" className={location.pathname === '/browse' || location.pathname.startsWith('/anime/') ? styles.navLinkActive : styles.navLink} onClick={closeMobileMenu}>Browse</Link>
            <Link to="/tracker" className={location.pathname === '/tracker' ? styles.navLinkActive : styles.navLink} onClick={closeMobileMenu}>Tracker</Link>
            <Link to="/discussions" className={location.pathname === '/discussions' ? styles.navLinkActive : styles.navLink} onClick={closeMobileMenu}>Discussions</Link>
            <Link to="/where-to-watch" className={location.pathname === '/where-to-watch' ? styles.navLinkActive : styles.navLink} onClick={closeMobileMenu}>Where to Watch</Link>
          </nav>
        </div>
        <div className={`${styles.right} ${isMobileMenuOpen ? styles.rightOpen : ''}`}>
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
                <Link to="/profile" className={styles.avatar} onClick={closeMobileMenu}>
                  <span className="material-symbols-outlined">account_circle</span>
                </Link>
              )}
            </>
          ) : (
            <>
              <Link to="/login" className={styles.loginButton} onClick={closeMobileMenu}>Login</Link>
              <Link to="/register" className={styles.registerButton} onClick={closeMobileMenu}>Register</Link>
            </>
          )}
        </div>
      </div>
      {isMobileMenuOpen && <div className={styles.overlay} onClick={closeMobileMenu} />}
    </header>
  );
}
