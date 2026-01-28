/**
 * Profile Page
 * User profile information and settings
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import AnimatedButton from '../components/AnimatedButton';
import { getProfile, updateProfile } from '../services/profile';
import { useAuth } from '../contexts/AuthContext';
import styles from './Profile.module.css';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    display_name: '',
    bio: '',
    avatar_url: '',
    favorite_genres: [],
    location: '',
    website: '',
    birth_date: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await getProfile();
      if (response) {
        setProfile(response);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      // If unauthorized, clear local session
      if (error.message.includes('401') || error.message.includes('Authentication failed') || error.message.includes('No token provided')) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return (
      <PageTransition className={styles.loadingContainer}>
        <div className={styles.loading}>Accessing your personal hub...</div>
      </PageTransition>
    );
  }

  if (!profile || !profile.user) {
    return (
      <PageTransition className={styles.errorContainer}>
        <h1>Identity verification failed</h1>
        <p>Please log in to access your professional dashboard.</p>
        <AnimatedButton onClick={() => navigate('/login')}>Sign In</AnimatedButton>
      </PageTransition>
    );
  }

  const { user: profileUser, stats } = profile;
  const joinDate = new Date(profileUser.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const statsItems = [
    { label: 'Total Library', value: stats.total_anime },
    { label: 'Completed', value: stats.completed },
    { label: 'Currently Watching', value: stats.watching },
    { label: 'Plan to Watch', value: stats.plan_to_watch },
    { label: 'Mean Score', value: stats.mean_score || '0.0', highlight: true }
  ];

  return (
    <PageTransition className={styles.container}>
      {/* Identity Section */}
      <div className={styles.header}>
        <div className={styles.identity}>
          <div className={styles.avatar}>
            {profileUser.username.charAt(0).toUpperCase()}
          </div>
          <div className={styles.userDetails}>
            <h1 className={styles.username}>{profileUser.display_name || profileUser.username}</h1>
            <p className={styles.meta}>
              Joined the hub on <strong>{joinDate}</strong>
            </p>
          </div>
        </div>
        <AnimatedButton variant="secondary" onClick={handleLogout} className={styles.logoutBtn}>
          Sign Out
        </AnimatedButton>
      </div>

      <div className={styles.content}>
        {/* Statistics Grid */}
        <div className={styles.statsGrid}>
          {statsItems.map((stat, idx) => (
            <div key={idx} className={styles.statCard}>
              <p className={styles.statLabel}>{stat.label}</p>
              <p className={`${styles.statValue} ${stat.highlight ? styles.statHighlight : ''}`}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Action Links */}
        <div className={styles.actions}>
          <div className={styles.actionGroup}>
            <h2 className={styles.sectionTitle}>Library Management</h2>
            <p className={styles.sectionDesc}>Manage your collection, update progress, and curate your watch list.</p>
            <AnimatedButton onClick={() => navigate('/tracker')} className={styles.actionBtn}>
              MANAGE LIBRARY
            </AnimatedButton>
          </div>
          <div className={styles.actionGroup}>
            <h2 className={styles.sectionTitle}>Community Engagement</h2>
            <p className={styles.sectionDesc}>Share your thoughts, join discussions, and interact with fellow anime fans.</p>
            <AnimatedButton variant="secondary" onClick={() => navigate('/discussions')} className={styles.actionBtn}>
              COMMUNITY ENGAGEMENT
            </AnimatedButton>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
