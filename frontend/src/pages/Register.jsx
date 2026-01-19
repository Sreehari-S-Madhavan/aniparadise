/**
 * Register Page
 * Split-screen design matching the provided design
 */

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import PageTransition from '../components/PageTransition';
import styles from './Login.module.css';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(username, email, password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition className={styles.page}>
      {/* Atmospheric Background */}
      <div className={styles.bgBlob1}></div>
      <div className={styles.bgBlob2}></div>

      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>
              <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 6H42L36 24L42 42H6L12 24L6 6Z" fill="currentColor"></path>
              </svg>
            </div>
            <h2>AniParadise</h2>
          </div>
          <div className={styles.headerLinks}>
            <Link to="/browse" className={styles.headerLink}>Discover</Link>
            <Link to="/browse" className={styles.headerLink}>Manga</Link>
            <Link to="/login" className={styles.registerButton}>Login</Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.container}>
          {/* Left Side: Visual */}
          <div className={styles.visualSide}>
            <div className={styles.visualContent}>
              <span className={styles.badge}>Join the Community</span>
              <h1 className={styles.visualTitle}>Start your anime journey today.</h1>
              <p className={styles.visualText}>Create your account and join thousands of fans tracking their favorite anime and discovering new series.</p>
            </div>
            <div className={styles.visualFooter}>
              <div className={styles.avatars}>
                <div className={styles.avatar}></div>
                <div className={styles.avatar}></div>
                <div className={styles.avatar}></div>
              </div>
              <p className={styles.onlineText}>+12k Voyagers online</p>
            </div>
          </div>

          {/* Right Side: Register Form */}
          <div className={styles.formSide}>
            <div className={styles.formHeader}>
              <h2 className={styles.formTitle}>Create Account</h2>
              <p className={styles.formSubtitle}>Join AniParadise and start tracking your favorite anime.</p>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              {error && <div className={styles.error}>{error}</div>}

              {/* Username Field */}
              <div className={styles.field}>
                <label className={styles.label}>Username</label>
                <div className={styles.inputWrapper}>
                  <span className="material-symbols-outlined">person</span>
                  <input
                    type="text"
                    placeholder="Choose a username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className={styles.input}
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className={styles.field}>
                <label className={styles.label}>Email Address</label>
                <div className={styles.inputWrapper}>
                  <span className="material-symbols-outlined">mail</span>
                  <input
                    type="email"
                    placeholder="voyager@aniparadise.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className={styles.input}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className={styles.field}>
                <label className={styles.label}>Password</label>
                <div className={styles.inputWrapper}>
                  <span className="material-symbols-outlined">lock</span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className={styles.input}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={styles.eyeButton}
                  >
                    <span className="material-symbols-outlined">visibility</span>
                  </button>
                </div>
              </div>

              {/* Register Button */}
              <button
                type="submit"
                disabled={loading}
                className={styles.submitButton}
              >
                <span>{loading ? 'Creating account...' : 'Join the Community'}</span>
                <span className="material-symbols-outlined">person_add</span>
              </button>
            </form>

            {/* Divider */}
            <div className={styles.divider}>
              <div className={styles.dividerLine}></div>
              <span className={styles.dividerText}>Or continue with</span>
            </div>

            {/* Social Login */}
            <div className={styles.socialButtons}>
              <button type="button" className={styles.socialButton}>
                <svg fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.909 3.148-1.908 4.148-1.207 1.208-3.074 2.512-6.132 2.512-4.91 0-8.854-3.996-8.854-8.904s3.944-8.904 8.854-8.904c2.652 0 4.592 1.048 5.992 2.392l2.32-2.32C18.6 1.144 15.84 0 12.48 0 6.504 0 1.624 4.88 1.624 10.86s4.88 10.86 10.856 10.86c3.216 0 5.64-1.064 7.52-3.032 1.944-1.944 2.552-4.664 2.552-6.792 0-.648-.056-1.264-.16-1.84h-9.912z"></path>
                </svg>
                Google
              </button>
              <button type="button" className={styles.socialButton}>
                <svg fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"></path>
                </svg>
                Discord
              </button>
            </div>

            {/* Footer Link */}
            <p className={styles.footerLink}>
              Already have an account?{' '}
              <Link to="/login" className={styles.footerLinkAnchor}>Login</Link>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>© 2024 AniParadise Media Group. All rights reserved. Built for fans, by fans.</p>
      </footer>
    </PageTransition>
  );
}
