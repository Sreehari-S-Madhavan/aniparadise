/**
 * Browse/Search Page
 * Search and filter anime
 */

import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import AnimeCard from '../components/AnimeCard';
import { searchAnime, getTopAnime } from '../services/anime';
import styles from './Browse.module.css';

export default function Browse() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadAnime();
  }, [searchParams, page]);

  const loadAnime = async () => {
    try {
      setLoading(true);
      const query = searchParams.get('q');
      const response = query
        ? await searchAnime(query, page, 20)
        : await getTopAnime(page, 20);

      if (response && response.data) {
        setAnimeList(response.data);
      } else {
        console.error('No data received from API');
        setAnimeList([]);
      }
    } catch (error) {
      console.error('Error loading anime:', error);
      // Don't clear the list on error, keep showing existing data
      if (animeList.length === 0) {
        setAnimeList([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery });
      setPage(1);
    }
  };

  const genres = ['Action', 'Romance', 'Sci-Fi', 'Adventure', 'Fantasy', 'Comedy', 'Drama', 'Horror', 'Cyberpunk'];

  return (
    <PageTransition className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Browse Anime</h1>
        <form onSubmit={handleSearch} className={styles.searchForm}>
          <div className={styles.searchContainer}>
            <span className="material-symbols-outlined">search</span>
            <input
              type="text"
              placeholder="Search for your next favorite anime..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </form>
      </div>

      <div className={styles.genresSection}>
        <h2 className={styles.genresTitle}>
          <span className="material-symbols-outlined">filter_list</span>
          Popular Genres
        </h2>
        <div className={styles.genresList}>
          <Link to="/browse" className={styles.genreActive}>All Genres</Link>
          {genres.map((genre) => (
            <Link
              key={genre}
              to={`/browse?q=${genre}`}
              className={styles.genreTag}
            >
              {genre}
            </Link>
          ))}
        </div>
      </div>

      {loading ? (
        <div className={styles.loading}>Loading anime...</div>
      ) : (
        <>
          <div className={styles.grid}>
            {animeList.map((anime) => (
              <AnimeCard key={anime.mal_id} anime={anime} />
            ))}
          </div>
          {animeList.length === 0 && (
            <div className={styles.empty}>
              <p>No anime found. Try a different search.</p>
            </div>
          )}
        </>
      )}
    </PageTransition>
  );
}
