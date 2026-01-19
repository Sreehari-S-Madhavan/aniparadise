import { useState, useEffect } from 'react';
import { searchAnime } from '../services/anime';
import { getAnimePlatforms } from '../services/platforms';
import PageTransition from '../components/PageTransition';
import styles from './WhereToWatch.module.css';

/**
 * Where to Watch Page
 * Shows legal streaming platforms for anime
 */
export default function WhereToWatch() {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedAnime, setSelectedAnime] = useState(null);
    const [animeSpecificPlatforms, setAnimeSpecificPlatforms] = useState([]);
    const [searching, setSearching] = useState(false);
    const [loadingPlatforms, setLoadingPlatforms] = useState(false);
    const [error, setError] = useState(null);

    const handleSearch = async (e) => {
        e.preventDefault();

        if (!searchQuery.trim()) {
            alert('Please enter an anime name to search');
            return;
        }

        try {
            setSearching(true);
            setError(null);
            setSelectedAnime(null);
            setAnimeSpecificPlatforms([]);

            const response = await searchAnime(searchQuery.trim(), 1, 10);
            setSearchResults(response.data || []);
        } catch (err) {
            setError('Failed to search anime. Please try again.');
            console.error('Error searching anime:', err);
        } finally {
            setSearching(false);
        }
    };

    const handleAnimeSelect = async (anime) => {
        setSelectedAnime(anime);
        setSearchResults([]);
        setSearchQuery('');

        try {
            setLoadingPlatforms(true);
            const platforms = await getAnimePlatforms(anime.mal_id);
            setAnimeSpecificPlatforms(platforms);
        } catch (err) {
            console.error('Error loading anime platforms:', err);
        } finally {
            setLoadingPlatforms(false);
        }
    };

    // Common streaming platforms (Fallback)
    const commonPlatforms = [
        { display_name: 'Crunchyroll', website_url: 'https://www.crunchyroll.com/', color: '#f47521' },
        { display_name: 'Netflix', website_url: 'https://www.netflix.com/', color: '#e50914' },
        { display_name: 'Funimation', website_url: 'https://www.funimation.com/', color: '#5b0bb5' },
        { display_name: 'HIDIVE', website_url: 'https://www.hidive.com/', color: '#00a1e4' },
        { display_name: 'Hulu', website_url: 'https://www.hulu.com/', color: '#1ce783' },
        { display_name: 'Amazon Prime', website_url: 'https://www.primevideo.com/', color: '#00a8e1' },
    ];

    return (
        <PageTransition className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Where to Watch</h1>
                <p className={styles.subtitle}>Find legal streaming platforms for your favorite anime</p>
            </div>

            {/* Search Section */}
            <div className={styles.searchSection}>
                <form onSubmit={handleSearch} className={styles.searchForm}>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search for anime (e.g., Naruto, One Piece, Attack on Titan)..."
                        className={styles.searchInput}
                        disabled={searching}
                    />
                    <button
                        type="submit"
                        className={styles.searchButton}
                        disabled={searching || !searchQuery.trim()}
                    >
                        {searching ? 'Searching...' : 'Search'}
                    </button>
                </form>

                {/* Search Results */}
                {searchResults.length > 0 && (
                    <div className={styles.searchResults}>
                        <h3 className={styles.resultsTitle}>Select an anime:</h3>
                        <div className={styles.resultsList}>
                            {searchResults.map(anime => (
                                <button
                                    key={anime.mal_id}
                                    onClick={() => handleAnimeSelect(anime)}
                                    className={styles.resultItem}
                                >
                                    <strong>{anime.title}</strong>
                                    {anime.title !== anime.title_english && anime.title_english && (
                                        <span className={styles.englishTitle}>
                                            ({anime.title_english})
                                        </span>
                                    )}
                                    <div className={styles.animeMetadata}>
                                        {anime.type} • {anime.episodes ? `${anime.episodes} episodes` : 'Ongoing'} • Score: {anime.score || 'N/A'}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Error Display */}
            {error && (
                <div className={styles.error}>
                    {error}
                </div>
            )}

            {/* Selected Anime and Platforms */}
            {selectedAnime && (
                <div className={styles.resultsSection}>
                    <div className={styles.animeCard}>
                        <img
                            src={selectedAnime.images?.jpg?.image_url}
                            alt={selectedAnime.title}
                            className={styles.animePoster}
                        />
                        <div className={styles.animeInfo}>
                            <h2>{selectedAnime.title}</h2>
                            {selectedAnime.title !== selectedAnime.title_english && selectedAnime.title_english && (
                                <p className={styles.englishTitle}>{selectedAnime.title_english}</p>
                            )}
                            <div className={styles.animeDetails}>
                                <p><strong>Type:</strong> {selectedAnime.type}</p>
                                <p><strong>Episodes:</strong> {selectedAnime.episodes || 'Ongoing'}</p>
                                <p><strong>Score:</strong> {selectedAnime.score || 'N/A'}</p>
                                <p><strong>Status:</strong> {selectedAnime.status}</p>
                            </div>
                            {selectedAnime.synopsis && (
                                <p className={styles.synopsis}>
                                    {selectedAnime.synopsis.length > 300
                                        ? `${selectedAnime.synopsis.substring(0, 300)}...`
                                        : selectedAnime.synopsis}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className={styles.platformsSection}>
                        <h3 className={styles.platformsTitle}>
                            {animeSpecificPlatforms.length > 0
                                ? 'Available Streaming Platforms:'
                                : 'Try searching on these platforms:'}
                        </h3>

                        {loadingPlatforms ? (
                            <div className={styles.loadingSmall}>Checking availability...</div>
                        ) : (
                            <div className={styles.platformsGrid}>
                                {(animeSpecificPlatforms.length > 0 ? animeSpecificPlatforms : commonPlatforms).map(platform => (
                                    <a
                                        key={platform.id || platform.display_name}
                                        href={platform.platform_url || platform.website_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={styles.platformCard}
                                        style={{ '--platform-color': platform.color || '#47ebeb' }}
                                    >
                                        <div className={styles.platformContent}>
                                            <span className={styles.platformName}>{platform.display_name}</span>
                                            {platform.platform_url && <span className={styles.directLabel}>Direct Link</span>}
                                        </div>
                                        <span className="material-symbols-outlined">open_in_new</span>
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Initial State */}
            {!selectedAnime && !error && searchResults.length === 0 && (
                <div className={styles.emptyState}>
                    <span className="material-symbols-outlined" style={{ fontSize: '4rem', opacity: 0.3 }}>tv</span>
                    <h3>Search for an anime to get started</h3>
                    <p>Enter the name of any anime above to find out where you can legally stream it.</p>
                    <p className={styles.suggestions}>
                        <strong>Popular searches:</strong> Naruto, One Piece, Attack on Titan, My Hero Academia, Demon Slayer
                    </p>
                </div>
            )}
        </PageTransition>
    );
}
