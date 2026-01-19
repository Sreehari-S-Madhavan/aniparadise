/**
 * Anime Card Component
 * Displays anime information in card format
 */

import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cardHover } from '../animations/variants';
import { addToTracker } from '../services/tracker';
import { useAuth } from '../contexts/AuthContext';
import styles from './AnimeCard.module.css';

export default function AnimeCard({ anime }) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!anime) return null;

  const handleQuickAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      await addToTracker(anime.mal_id, 'plan-to-watch');
      alert(`"${anime.title}" added to your Plan to Watch list!`);
    } catch (error) {
      alert('Failed to add to tracker: ' + (error.message || 'Unknown error'));
    }
  };

  const imageUrl = anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url;
  const score = anime.score || 'N/A';
  const title = anime.title || anime.title_english || 'Unknown';
  const genres = anime.genres?.slice(0, 3).map(g => g.name).join(', ') || '';

  return (
    <motion.div
      className={styles.card}
      variants={cardHover}
      initial="rest"
      whileHover="hover"
    >
      <Link to={`/anime/${anime.mal_id}`} className={styles.link}>
        <div className={styles.imageContainer}>
          {imageUrl && (
            <img src={imageUrl} alt={title} className={styles.image} />
          )}
          <div className={styles.overlay}>
            <button
              className={styles.addButton}
              onClick={handleQuickAdd}
            >
              Add to List
            </button>
          </div>
          <div className={styles.rating}>
            <span className="material-symbols-outlined">star</span>
            {score}
          </div>
        </div>
        <div className={styles.info}>
          <h3 className={styles.title}>{title}</h3>
          {genres && <p className={styles.genres}>{genres}</p>}
        </div>
      </Link>
    </motion.div>
  );
}
