/**
 * Discussions/Community Page
 * Community feed with posts and discussions
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getDiscussions, createDiscussion, toggleLike } from '../services/discussions';
import PageTransition from '../components/PageTransition';
import styles from './Discussions.module.css';
import modalStyles from './DiscussionsModal.module.css';

export default function Discussions() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', category: 'general' });
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDiscussions();
  }, [filter]);

  const loadDiscussions = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = filter !== 'all' ? { category: filter } : {};
      const response = await getDiscussions(params);
      setPosts(response.discussions || []);
    } catch (err) {
      console.error('Error loading discussions:', err);
      setError('Failed to load discussions');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setShowCreateModal(true);
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPost.title.trim() || !newPost.content.trim()) {
      alert('Please fill in all fields');
      return;
    }

    try {
      await createDiscussion(newPost);
      setShowCreateModal(false);
      setNewPost({ title: '', content: '', category: 'general' });
      loadDiscussions();
    } catch (err) {
      console.error('Error creating post:', err);
      alert('Failed to create post');
    }
  };

  const handleLike = async (discussionId) => {
    if (!isAuthenticated) {
      alert('Please login to like posts');
      return;
    }

    try {
      await toggleLike(discussionId);
      // Reload discussions to get updated counts
      loadDiscussions();
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <PageTransition className={styles.container}>
      {/* Background Glows */}
      <div className={styles.bgGlow1}></div>
      <div className={styles.bgGlow2}></div>

      <div className={styles.content}>
        {/* Left Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarNav}>
            <button
              className={filter === 'all' ? styles.sidebarLinkActive : styles.sidebarLink}
              onClick={() => setFilter('all')}
            >
              <span className="material-symbols-outlined">forum</span>
              All Discussions
            </button>
            <button
              className={filter === 'general' ? styles.sidebarLinkActive : styles.sidebarLink}
              onClick={() => setFilter('general')}
            >
              <span className="material-symbols-outlined">chat_bubble</span>
              General
            </button>
            <button
              className={filter === 'anime' ? styles.sidebarLinkActive : styles.sidebarLink}
              onClick={() => setFilter('anime')}
            >
              <span className="material-symbols-outlined">movie</span>
              Anime
            </button>
            <button
              className={filter === 'manga' ? styles.sidebarLinkActive : styles.sidebarLink}
              onClick={() => setFilter('manga')}
            >
              <span className="material-symbols-outlined">menu_book</span>
              Manga
            </button>
            <button
              className={filter === 'theory' ? styles.sidebarLinkActive : styles.sidebarLink}
              onClick={() => setFilter('theory')}
            >
              <span className="material-symbols-outlined">psychology</span>
              Theories
            </button>
            <button
              className={filter === 'review' ? styles.sidebarLinkActive : styles.sidebarLink}
              onClick={() => setFilter('review')}
            >
              <span className="material-symbols-outlined">rate_review</span>
              Reviews
            </button>
          </div>

          <div className={styles.trendingTags}>
            <h3 className={styles.tagsTitle}>Trending Tags</h3>
            <div className={styles.tagsList}>
              <span className={styles.tag}>#JujutsuKaisen</span>
              <span className={styles.tag}>#OnePiece1115</span>
              <span className={styles.tag}>#MAPPA</span>
              <span className={styles.tag}>#SoloLeveling</span>
            </div>
          </div>
        </aside>

        {/* Main Feed */}
        <section className={styles.feed}>
          {/* Create Post Input */}
          <div className={styles.createPost}>
            <div className={styles.createPostAvatar}>
              {isAuthenticated ? (user?.username?.charAt(0).toUpperCase() || 'U') : '?'}
            </div>
            <button
              className={styles.createPostButton}
              onClick={handleCreateClick}
            >
              {isAuthenticated
                ? "What's on your mind? Share a theory or review..."
                : "Login to share a theory or review..."}
            </button>
          </div>

          {/* Loading State */}
          {loading && <div className={styles.loading}>Loading discussions...</div>}

          {/* Error State */}
          {error && <div className={styles.error}>{error}</div>}

          {/* Discussion Cards */}
          {!loading && !error && (
            <div className={styles.posts}>
              {posts.length === 0 ? (
                <div className={styles.emptyState}>
                  <span className="material-symbols-outlined" style={{ fontSize: '4rem', opacity: 0.3 }}>
                    forum
                  </span>
                  <h3>No discussions yet</h3>
                  <p>Be the first to start a discussion!</p>
                </div>
              ) : (
                posts.map((post) => (
                  <article key={post.id} className={styles.post}>
                    <div className={styles.postHeader}>
                      <div className={styles.postAuthor}>
                        <div className={styles.authorAvatar}>
                          {post.username?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div>
                          <p className={styles.authorName}>@{post.username || 'Anonymous'}</p>
                          <p className={styles.postMeta}>
                            {formatTimeAgo(post.created_at)} •{' '}
                            <span className={styles.tagInline}>#{post.category}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                    <h2 className={styles.postTitle}>{post.title}</h2>
                    <p className={styles.postContent}>{post.content}</p>
                    {post.image_url && (
                      <div
                        className={styles.postImage}
                        style={{ backgroundImage: `url(${post.image_url})` }}
                      ></div>
                    )}
                    <div className={styles.postActions}>
                      <div className={styles.voteButtons}>
                        <button
                          className={styles.voteButton}
                          onClick={() => handleLike(post.id)}
                        >
                          <span className="material-symbols-outlined">thumb_up</span>
                          <span>Like</span>
                        </button>
                        <div className={styles.voteCount}>+{post.likes_count || 0}</div>
                      </div>
                      <div className={styles.actionButtons}>
                        <button className={styles.actionButton}>
                          <span className="material-symbols-outlined">chat_bubble</span>
                          <span>{post.comments_count || 0}</span>
                        </button>
                        <button className={styles.actionButton}>
                          <span className="material-symbols-outlined">share</span>
                        </button>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>
          )}
        </section>

        {/* Right Sidebar */}
        <aside className={styles.rightSidebar}>
          <div className={styles.hotTopics}>
            <h3 className={styles.hotTopicsTitle}>
              <span className="material-symbols-outlined">local_fire_department</span>
              Hot Topics
            </h3>
            <div className={styles.topicList}>
              <div className={styles.topic}>
                <p className={styles.topicCategory}>Anime News</p>
                <h4 className={styles.topicTitle}>Chainsaw Man Movie Release Date Confirmed!</h4>
                <p className={styles.topicMeta}>2.4k users discussing</p>
              </div>
              <div className={styles.topicDivider}></div>
              <div className={styles.topic}>
                <p className={styles.topicCategory}>Manga Spoilers</p>
                <h4 className={styles.topicTitle}>Blue Lock Chapter 265: The Final Strike?</h4>
                <p className={styles.topicMeta}>1.1k users discussing</p>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Floating Action Button */}
      <button className={styles.fab} onClick={handleCreateClick}>
        <span className="material-symbols-outlined">add</span>
      </button>

      {/* Create Post Modal */}
      {showCreateModal && (
        <div className={modalStyles.modal} onClick={() => setShowCreateModal(false)}>
          <div className={modalStyles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={modalStyles.modalHeader}>
              <h2>Create New Discussion</h2>
              <button
                className={modalStyles.modalClose}
                onClick={() => setShowCreateModal(false)}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleCreatePost}>
              <input
                type="text"
                placeholder="Discussion Title"
                value={newPost.title}
                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                className={modalStyles.modalInput}
                required
              />
              <div style={{ marginBottom: '0.5rem', color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem' }}>
                Select Category
              </div>
              <select
                value={newPost.category}
                onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                className={modalStyles.modalSelect}
              >
                <option value="general">General</option>
                <option value="anime">Anime</option>
                <option value="manga">Manga</option>
                <option value="theory">Theory</option>
                <option value="review">Review</option>
              </select>
              <textarea
                placeholder="Share your thoughts..."
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                className={modalStyles.modalTextarea}
                rows={6}
                required
              />
              <div className={modalStyles.modalActions}>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className={modalStyles.modalCancel}
                >
                  Cancel
                </button>
                <button type="submit" className={modalStyles.modalSubmit}>
                  Post Discussion
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageTransition>
  );
}
