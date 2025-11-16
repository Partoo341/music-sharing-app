import React from 'react';
import { useAudio } from '../context/AudioContext';
import { auth } from '../firebase/config';

const Profile = () => {
    const { user, audioItems } = useAudio();

    // Safe data handling with fallbacks
    const currentUser = user || auth.currentUser;
    const userItems = audioItems?.filter(item => item.userId === currentUser?.uid) || [];

    // Styles - Black, White, Golden, Yellow Theme
    const styles = {
        // Container
        page: {
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
            color: 'white',
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            padding: '40px 20px'
        },

        // Header
        header: {
            textAlign: 'center',
            marginBottom: '40px'
        },
        title: {
            fontSize: '2.5rem',
            fontWeight: '800',
            marginBottom: '15px',
            background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
        },
        subtitle: {
            fontSize: '1.2rem',
            color: '#cccccc',
            marginBottom: '10px'
        },

        // Profile Info
        profileInfo: {
            background: '#1a1a1a',
            padding: '30px',
            borderRadius: '15px',
            border: '2px solid #333',
            boxShadow: '0 10px 30px rgba(255, 215, 0, 0.1)',
            maxWidth: '600px',
            margin: '0 auto 40px'
        },
        infoItem: {
            marginBottom: '15px',
            fontSize: '1.1rem'
        },
        infoLabel: {
            color: '#FFD700',
            fontWeight: '600',
            marginRight: '10px'
        },
        infoValue: {
            color: 'white'
        },

        // Stats Grid
        statsGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            maxWidth: '600px',
            margin: '0 auto 40px'
        },
        statCard: {
            background: 'linear-gradient(135deg, #1a1a1a, #2d2d2d)',
            padding: '25px',
            borderRadius: '12px',
            border: '2px solid #333',
            textAlign: 'center',
            transition: 'all 0.3s ease'
        },
        statNumber: {
            fontSize: '2rem',
            fontWeight: '800',
            color: '#FFD700',
            marginBottom: '10px'
        },
        statLabel: {
            color: '#cccccc',
            fontSize: '0.9rem',
            textTransform: 'uppercase',
            letterSpacing: '1px'
        },

        // Uploads Section
        uploadsSection: {
            maxWidth: '1200px',
            margin: '0 auto'
        },
        sectionTitle: {
            fontSize: '2rem',
            color: '#FFD700',
            marginBottom: '30px',
            textAlign: 'center'
        },

        // Audio Grid
        audioGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '25px',
            marginBottom: '40px'
        },
        audioCard: {
            background: '#1a1a1a',
            padding: '25px',
            borderRadius: '15px',
            border: '2px solid #333',
            boxShadow: '0 5px 20px rgba(255, 215, 0, 0.1)',
            transition: 'all 0.3s ease'
        },
        audioTitle: {
            fontSize: '1.3rem',
            color: '#FFD700',
            marginBottom: '15px',
            fontWeight: '600'
        },
        audioMeta: {
            color: '#cccccc',
            marginBottom: '15px',
            fontSize: '0.9rem'
        },
        audioPlayer: {
            width: '100%',
            marginTop: '15px'
        },

        // No Uploads State
        noUploads: {
            textAlign: 'center',
            padding: '60px 20px',
            background: '#1a1a1a',
            borderRadius: '15px',
            border: '2px solid #333'
        },
        noUploadsTitle: {
            fontSize: '1.5rem',
            color: '#FFD700',
            marginBottom: '15px'
        },
        noUploadsText: {
            color: '#cccccc',
            marginBottom: '25px'
        },
        uploadCta: {
            background: 'linear-gradient(135deg, #FFD700, #FFA500)',
            color: '#000',
            border: 'none',
            padding: '12px 30px',
            borderRadius: '25px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            textDecoration: 'none',
            display: 'inline-block'
        },

        // User Not Logged In
        notLoggedIn: {
            textAlign: 'center',
            padding: '80px 20px'
        },
        loginMessage: {
            fontSize: '1.5rem',
            color: '#FFD700',
            marginBottom: '20px'
        },
        loginButton: {
            background: 'linear-gradient(135deg, #FFD700, #FFA500)',
            color: '#000',
            border: 'none',
            padding: '15px 30px',
            borderRadius: '25px',
            fontSize: '1.1rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            textDecoration: 'none',
            display: 'inline-block'
        }
    };

    // Hover handlers
    const handleCardHover = (e) => {
        e.target.style.transform = 'translateY(-5px)';
        e.target.style.boxShadow = '0 15px 35px rgba(255, 215, 0, 0.2)';
        e.target.style.borderColor = '#FFD700';
    };

    const handleCardLeave = (e) => {
        e.target.style.transform = 'translateY(0)';
        e.target.style.boxShadow = '0 5px 20px rgba(255, 215, 0, 0.1)';
        e.target.style.borderColor = '#333';
    };

    const handleButtonHover = (e) => {
        e.target.style.transform = 'translateY(-2px)';
        e.target.style.boxShadow = '0 8px 25px rgba(255, 215, 0, 0.4)';
    };

    const handleButtonLeave = (e) => {
        e.target.style.transform = 'translateY(0)';
        e.target.style.boxShadow = 'none';
    };

    // If user is not logged in
    if (!currentUser) {
        return (
            <div style={styles.page}>
                <div style={styles.notLoggedIn}>
                    <h2 style={styles.loginMessage}>Please Log In</h2>
                    <p style={{ color: '#cccccc', marginBottom: '30px' }}>
                        You need to be logged in to view your profile.
                    </p>
                    <a
                        href="/login"
                        style={styles.loginButton}
                        onMouseEnter={handleButtonHover}
                        onMouseLeave={handleButtonLeave}
                    >
                        Go to Login
                    </a>
                </div>
            </div>
        );
    }

    // Calculate stats
    const totalUploads = userItems.length;
    const stylesCount = userItems.filter(item => item.category === 'styles').length;
    const voicesCount = userItems.filter(item => item.category === 'voices').length;
    const midiCount = userItems.filter(item => item.category === 'midifiles').length;
    const multipadsCount = userItems.filter(item => item.category === 'Multipads').length;

    return (
        <div style={styles.page}>
            {/* Header */}
            <div style={styles.header}>
                <h1 style={styles.title}>Your Profile</h1>
                <p style={styles.subtitle}>Manage your uploads and view your statistics</p>
            </div>

            {/* Profile Information */}
            <div style={styles.profileInfo}>
                <div style={styles.infoItem}>
                    <span style={styles.infoLabel}>Username:</span>
                    <span style={styles.infoValue}>{currentUser.displayName || currentUser.email?.split('@')[0] || 'User'}</span>
                </div>
                <div style={styles.infoItem}>
                    <span style={styles.infoLabel}>Email:</span>
                    <span style={styles.infoValue}>{currentUser.email || 'Not provided'}</span>
                </div>
                <div style={styles.infoItem}>
                    <span style={styles.infoLabel}>User ID:</span>
                    <span style={styles.infoValue}>{currentUser.uid.substring(0, 8)}...</span>
                </div>
            </div>

            {/* Statistics */}
            <div style={styles.statsGrid}>
                <div
                    style={styles.statCard}
                    onMouseEnter={handleCardHover}
                    onMouseLeave={handleCardLeave}
                >
                    <div style={styles.statNumber}>{totalUploads}</div>
                    <div style={styles.statLabel}>Total Uploads</div>
                </div>
                <div
                    style={styles.statCard}
                    onMouseEnter={handleCardHover}
                    onMouseLeave={handleCardLeave}
                >
                    <div style={styles.statNumber}>{stylesCount}</div>
                    <div style={styles.statLabel}>Styles</div>
                </div>
                <div
                    style={styles.statCard}
                    onMouseEnter={handleCardHover}
                    onMouseLeave={handleCardLeave}
                >
                    <div style={styles.statNumber}>{voicesCount}</div>
                    <div style={styles.statLabel}>Voices</div>
                </div>
                <div
                    style={styles.statCard}
                    onMouseEnter={handleCardHover}
                    onMouseLeave={handleCardLeave}
                >
                    <div style={styles.statNumber}>{midiCount + multipadsCount}</div>
                    <div style={styles.statLabel}>Other Files</div>
                </div>
            </div>

            {/* Uploads Section */}
            <div style={styles.uploadsSection}>
                <h2 style={styles.sectionTitle}>Your Uploads</h2>

                {userItems.length === 0 ? (
                    <div style={styles.noUploads}>
                        <h3 style={styles.noUploadsTitle}>No Uploads Yet</h3>
                        <p style={styles.noUploadsText}>
                            Start sharing your music files with the community!
                        </p>
                        <a
                            href="/upload"
                            style={styles.uploadCta}
                            onMouseEnter={handleButtonHover}
                            onMouseLeave={handleButtonLeave}
                        >
                            UPLOAD YOUR FIRST FILE
                        </a>
                    </div>
                ) : (
                    <div style={styles.audioGrid}>
                        {userItems.map(item => (
                            <div
                                key={item.id}
                                style={styles.audioCard}
                                onMouseEnter={handleCardHover}
                                onMouseLeave={handleCardLeave}
                            >
                                <h4 style={styles.audioTitle}>{item.title || 'Untitled'}</h4>
                                <div style={styles.audioMeta}>
                                    <p><strong>Type:</strong> {item.category || item.type || 'Unknown'}</p>
                                    <p><strong>Size:</strong> {item.size ? (item.size / 1024 / 1024).toFixed(2) + ' MB' : 'Unknown'}</p>
                                    <p><strong>Uploaded:</strong> {item.createdAt ? new Date(item.createdAt.seconds * 1000).toLocaleDateString() : 'Unknown date'}</p>
                                </div>
                                {item.url && (
                                    <audio controls style={styles.audioPlayer}>
                                        <source src={item.url} type="audio/mpeg" />
                                        Your browser does not support the audio element.
                                    </audio>
                                )}
                                {!item.url && item.audioUrl && (
                                    <audio controls style={styles.audioPlayer}>
                                        <source src={item.audioUrl} type="audio/mpeg" />
                                        Your browser does not support the audio element.
                                    </audio>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;