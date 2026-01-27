/**
 * Tracker Page
 * User's anime watch list with status filters
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import AnimatedButton from '../components/AnimatedButton';
import { getTracker, updateTracker } from '../services/tracker';
import { getAnimeById } from '../services/anime';
import styles from './Tracker.module.css';

export default function Tracker() {
  const [trackerItems, setTrackerItems] = useState([]);
  const [animeData, setAnimeData] = useState({});
  const [statusFilter, setStatusFilter] = useState('watching');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTracker();
  }, []);

  const loadTracker = async () => {
    try {
      setLoading(true);
      // Fetch ALL items to get accurate counts
      const response = await getTracker(null);
      if (response.tracker) {
        setTrackerItems(response.tracker);

        // Load anime details for each item, but only if not already in cache
        const itemsToFetch = response.tracker.filter(item => !animeData[item.anime_id]);

        if (itemsToFetch.length > 0) {
          const animePromises = itemsToFetch.map(item =>
            getAnimeById(item.anime_id).catch(() => null)
          );
          const animeResults = await Promise.all(animePromises);

          setAnimeData(prev => {
            const next = { ...prev };
            animeResults.forEach((result, index) => {
              if (result?.data) {
                next[itemsToFetch[index].anime_id] = result.data;
              }
            });
            return next;
          });
        }
      }
    } catch (error) {
      console.error('Error loading tracker:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTracker = async (trackerId, updateData) => {
    try {
      // Optimistic update or just avoid full page loading
      await updateTracker(trackerId, updateData);
      // Refresh only the data, without setting loading=true
      const response = await getTracker(null);
      if (response.tracker) {
        setTrackerItems(response.tracker);
      }
    } catch (error) {
      alert('Failed to update tracker: ' + (error.message || 'Unknown error'));
    }
  };

  const filteredItems = statusFilter === 'all'
    ? trackerItems
    : trackerItems.filter(item => item.status === statusFilter);

  const statuses = ['all', 'watching', 'completed', 'plan-to-watch', 'on-hold', 'dropped'];

  const getStatusLabel = (status) => {
    switch (status) {
      case 'plan-to-watch': return 'Plan to Watch';
      case 'on-hold': return 'On Hold';
      default: return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  return (
    <PageTransition className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>My Tracker</h1>
          <p className={styles.subtitle}>Personal anime library & progress tracking</p>
        </div>
      </div>

      <div className={styles.filters}>
        <div className={styles.statusFilters}>
          {statuses.map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`${styles.statusButton} ${statusFilter === status ? styles.active : ''}`}
            >
              {getStatusLabel(status)} ({status === 'all' ? trackerItems.length : trackerItems.filter(i => i.status === status).length})
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className={styles.loading}>Accessing your library...</div>
      ) : filteredItems.length === 0 ? (
        <div className={styles.empty}>
          <p>No anime in your tracker {statusFilter !== 'all' ? `with status "${getStatusLabel(statusFilter)}"` : ''}.</p>
          <Link to="/browse">
            <AnimatedButton>Explore Anime</AnimatedButton>
          </Link>
        </div>
      ) : (
        <div className={styles.list}>
          {filteredItems.map((item) => {
            const anime = animeData[item.anime_id];

            return (
              <div key={item.id} className={styles.trackerItem}>
                <div className={styles.itemMain}>
                  <Link to={`/anime/${item.anime_id}`} className={styles.animeLink}>
                    <div className={styles.poster}>
                      {anime?.images?.jpg?.image_url ? (
                        <img src={anime.images.jpg.image_url} alt={anime.title} />
                      ) : (
                        <div className={styles.placeholder}>?</div>
                      )}
                    </div>
                  </Link>
                  <div className={styles.info}>
                    <div className={styles.headerRow}>
                      <div className={styles.titleGroup}>
                        <Link to={`/anime/${item.anime_id}`}>
                          <h3 className={styles.animeTitle}>{anime?.title || `Anime #${item.anime_id}`}</h3>
                        </Link>
                        <p className={styles.studio}>
                          ⭐ {anime?.score || 'N/A'} • {anime?.type || 'Unknown'}
                        </p>
                      </div>
                    </div>

                    <div className={styles.controlsGrid}>
                      <div className={styles.controlGroup}>
                        <label>Status</label>
                        <select
                          value={item.status}
                          onChange={(e) => handleUpdateTracker(item.id, { status: e.target.value })}
                          className={styles.statusSelect}
                        >
                          <option value="watching">Watching</option>
                          <option value="completed">Completed</option>
                          <option value="on-hold">On Hold</option>
                          <option value="dropped">Dropped</option>
                          <option value="plan-to-watch">Plan to Watch</option>
                        </select>
                      </div>

                      <div className={styles.controlGroup}>
                        <label>Progress</label>
                        <div className={styles.progressInputWrapper}>
                          <input
                            type="number"
                            min="0"
                            value={item.progress || 0}
                            onChange={(e) => handleUpdateTracker(item.id, { progress: e.target.value })}
                            className={styles.progressInput}
                          />
                          <span className={styles.progressDivider}>/</span>
                          <span className={styles.totalEpisodes}>{anime?.episodes || '??'}</span>
                        </div>
                      </div>

                      <div className={styles.controlGroup}>
                        <label>Score</label>
                        <select
                          value={item.rating || ''}
                          onChange={(e) => handleUpdateTracker(item.id, { rating: e.target.value || null })}
                          className={styles.ratingSelect}
                        >
                          <option value="">No Score</option>
                          {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map(n => (
                            <option key={n} value={n}>({n}) {n === 10 ? 'Masterpiece' : n === 9 ? 'Great' : n === 8 ? 'Very Good' : n === 7 ? 'Good' : n === 6 ? 'Fine' : n === 5 ? 'Average' : 'Below Average'}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={`${styles.statusBadge} ${styles['status-' + item.status]}`}>
                  {getStatusLabel(item.status)}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </PageTransition>
  );
}
