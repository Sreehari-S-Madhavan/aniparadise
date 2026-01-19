/**
 * Anime Detail Page
 * Shows full anime information and allows adding to tracker
 */

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import AnimatedButton from '../components/AnimatedButton';
import { getAnimeById } from '../services/anime';
import { addToTracker } from '../services/tracker';
import { useAuth } from '../contexts/AuthContext';
import styles from './AnimeDetail.module.css';

export default function AnimeDetail() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [status, setStatus] = useState('watching');

  useEffect(() => {
    loadAnime();
  }, [id]);

  const loadAnime = async () => {
    try {
      setLoading(true);
      const response = await getAnimeById(id);
      if (response.data) {
        setAnime(response.data);
      }
    } catch (error) {
      console.error('Error loading anime:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToTracker = async () => {
    if (!isAuthenticated) {
      alert('Please login to add anime to your tracker');
      return;
    }

    try {
      setAdding(true);
      await addToTracker(anime.mal_id, status);
      alert('Added to tracker!');
    } catch (error) {
      alert('Failed to add to tracker: ' + (error.message || 'Unknown error'));
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <PageTransition>
        <div className={styles.loading}>Loading anime details...</div>
      </PageTransition>
    );
  }

  if (!anime) {
    return (
      <PageTransition>
        <div className={styles.error}>Anime not found</div>
      </PageTransition>
    );
  }

  const imageUrl = anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url;
  const genres = anime.genres?.map(g => g.name) || [];

  return (
    <PageTransition>
      {/* Hero Section */}
      <div className={styles.hero} style={{ backgroundImage: imageUrl ? `url(${imageUrl})` : 'none' }}>
        <div className={styles.heroGradient}></div>
        <div className={styles.heroContent}>
          <div className={styles.posterContainer}>
            {imageUrl && <img src={imageUrl} alt={anime.title} className={styles.poster} />}
          </div>
          <div className={styles.heroInfo}>
            <div className={styles.genresList}>
              {genres.slice(0, 3).map((genre) => (
                <span key={genre} className={styles.genreTag}>{genre}</span>
              ))}
            </div>
            <h1 className={styles.title}>{anime.title || anime.title_english}</h1>
            <p className={styles.description}>{anime.synopsis}</p>
          </div>
        </div>
      </div>

      <div className={styles.container}>
        <div className={styles.main}>
          {/* Stats */}
          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statValue}>{anime.score || 'N/A'}</span>
              <span className={styles.statLabel}>Global Rating</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>#{anime.rank || 'N/A'}</span>
              <span className={styles.statLabel}>Ranking</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>#{anime.popularity || 'N/A'}</span>
              <span className={styles.statLabel}>Popularity</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>{anime.episodes || 'N/A'}</span>
              <span className={styles.statLabel}>Episodes</span>
            </div>
          </div>

          {/* Synopsis */}
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>
              <span className="material-symbols-outlined">description</span>
              Synopsis
            </h3>
            <div className={styles.synopsis}>
              <p>{anime.synopsis || 'No synopsis available.'}</p>
            </div>
          </section>

          {/* Where to Watch */}
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>
              <span className="material-symbols-outlined">play_circle</span>
              Where to Watch
            </h3>
            <div className={styles.watchGrid}>
              <a href="#" className={styles.watchCard}>
                <div className={styles.watchLogo}>CR</div>
                <span className={styles.watchName}>Crunchyroll</span>
                <span className="material-symbols-outlined">open_in_new</span>
              </a>
              <a href="#" className={styles.watchCard}>
                <div className={styles.watchLogo}>N</div>
                <span className={styles.watchName}>Netflix</span>
                <span className="material-symbols-outlined">open_in_new</span>
              </a>
              <a href="#" className={styles.watchCard}>
                <div className={styles.watchLogo}>H</div>
                <span className={styles.watchName}>Hulu</span>
                <span className="material-symbols-outlined">open_in_new</span>
              </a>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className={styles.sidebar}>
          <div className={styles.actionCard}>
            {isAuthenticated ? (
              <>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className={styles.statusSelect}
                >
                  <option value="watching">Watching</option>
                  <option value="completed">Completed</option>
                  <option value="on-hold">On Hold</option>
                  <option value="dropped">Dropped</option>
                  <option value="plan-to-watch">Plan to Watch</option>
                </select>
                <AnimatedButton
                  onClick={handleAddToTracker}
                  disabled={adding}
                  className={styles.addButton}
                >
                  <span className="material-symbols-outlined">add_circle</span>
                  {adding ? 'Adding...' : 'Add to Tracker'}
                </AnimatedButton>
              </>
            ) : (
              <Link to="/login">
                <AnimatedButton className={styles.addButton}>
                  <span className="material-symbols-outlined">login</span>
                  Login to Track
                </AnimatedButton>
              </Link>
            )}

            <div className={styles.infoList}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Status</span>
                <span className={styles.infoValue}>{anime.status || 'Unknown'}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Aired</span>
                <span className={styles.infoValue}>
                  {anime.aired?.string || 'Unknown'}
                </span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Rating</span>
                <span className={styles.infoValue}>{anime.rating || 'N/A'}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Source</span>
                <span className={styles.infoValue}>{anime.source || 'Unknown'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
