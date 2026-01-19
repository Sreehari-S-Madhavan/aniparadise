/**
 * Home Page
 * Minimal hero-focused landing page
 */

import { Link } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import AnimatedButton from '../components/AnimatedButton';
import { useAuth } from '../contexts/AuthContext';
import styles from './Home.module.css';

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <PageTransition>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.heroBadge}>ANIPARADISE EXCLUSIVE</span>
          <h1 className={styles.heroTitle}>
            Discover Your <br />
            <span className={styles.heroAccent}>Next Favorite</span> Anime
          </h1>
          <p className={styles.heroDescription}>
            Track your progress, explore seasonal hits, and join a global community of fans. Your journey starts here.
          </p>
          <div className={styles.heroButtons}>
            {isAuthenticated ? (
              <Link to="/tracker">
                <AnimatedButton className={styles.primaryButton}>
                  <span className="material-symbols-outlined">play_arrow</span>
                  Start Tracking
                </AnimatedButton>
              </Link>
            ) : (
              <Link to="/register">
                <AnimatedButton className={styles.primaryButton}>
                  <span className="material-symbols-outlined">play_arrow</span>
                  Get Started
                </AnimatedButton>
              </Link>
            )}
            <Link to="/browse">
              <AnimatedButton variant="secondary" className={styles.secondaryButton}>
                Explore Browse
              </AnimatedButton>
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <main className={styles.main}>
        <section className={styles.featuresSection}>
          <div className={styles.featureCard}>
            <span className="material-symbols-outlined" style={{ fontSize: '3rem', color: 'var(--color-primary)' }}>trending_up</span>
            <h3>Track Your Progress</h3>
            <p>Keep track of every episode you watch. Never lose your place again with our intuitive tracking system.</p>
          </div>

          <div className={styles.featureCard}>
            <span className="material-symbols-outlined" style={{ fontSize: '3rem', color: 'var(--color-primary)' }}>explore</span>
            <h3>Discover New Anime</h3>
            <p>Browse through thousands of anime titles. Find your next obsession with powerful search and filters.</p>
          </div>

          <div className={styles.featureCard}>
            <span className="material-symbols-outlined" style={{ fontSize: '3rem', color: 'var(--color-primary)' }}>groups</span>
            <h3>Join the Community</h3>
            <p>Connect with fellow anime fans. Share your thoughts and discuss your favorite series.</p>
          </div>
        </section>

        {/* CTA Section */}
        <section className={styles.ctaSection}>
          <h2>Ready to Begin Your Journey?</h2>
          <p>Join thousands of anime fans tracking their favorite shows</p>
          <Link to={isAuthenticated ? "/browse" : "/register"}>
            <AnimatedButton className={styles.ctaButton}>
              {isAuthenticated ? "Browse Anime" : "Create Account"}
            </AnimatedButton>
          </Link>
        </section>
      </main>
    </PageTransition>
  );
}
