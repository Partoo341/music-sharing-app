import React from 'react';
import { Link } from 'react-router-dom';
import { useAudio } from '../context/AudioContext';

const AudioCard = ({ item }) => (
    <div className="audio-card">
        <div className="audio-info">
            <h4>{item.title}</h4>
            <p>By {item.artist}</p>
            <span className="file-type">.{item.fileType}</span>
        </div>
        {item.type === 'audio' && (
            <audio controls className="audio-player">
                <source src={item.audioUrl} type={`audio/${item.fileType}`} />
                Your browser does not support the audio element.
            </audio>
        )}
        <a href={item.audioUrl} download className="download-btn">
            Download .{item.fileType}
        </a>
    </div>
);

const Home = () => {
    const { user, audioItems } = useAudio();

    return (
        <div className="home">
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-content">
                    <div className="hero-logo">
                        <img src="/logo.png" alt="Lenskings Productions" className="hero-logo-image" />
                    </div>
                    <h1>LENSKINGS PRODUCTIONS</h1>
                    <p className="hero-tagline">Capturing Life, Creating Art</p>
                    <p className="hero-description">Share Your Musical Masterpieces with the World</p>
                    {!user && (
                        <div className="hero-buttons">
                            <Link to="/register" className="btn btn-primary">Join Now</Link>
                            <Link to="/styles" className="btn btn-secondary">Explore Sounds</Link>
                        </div>
                    )}
                </div>
            </section>

            {/* Stats Section */}
            <section className="stats">
                <div className="stat-item">
                    <h3>{audioItems.filter(item => item.type === 'style').length}+</h3>
                    <p>Styles</p>
                </div>
                <div className="stat-item">
                    <h3>{audioItems.filter(item => item.type === 'voice').length}+</h3>
                    <p>Voices</p>
                </div>
                <div className="stat-item">
                    <h3>{audioItems.filter(item => item.type === 'multipad').length}+</h3>
                    <p>Multipads</p>
                </div>
                <div className="stat-item">
                    <h3>{audioItems.filter(item => item.type === 'midi').length}+</h3>
                    <p>MIDI Files</p>
                </div>
                <div className="stat-item">
                    <h3>{audioItems.filter(item => item.type === 'audio').length}+</h3>
                    <p>Audio Beats</p>
                </div>
            </section>

            {/* Recently Added Section */}
            <section className="featured">
                <h2>Recently Added</h2>
                <p className="section-subtitle">Discover the latest uploads from our community</p>
                {audioItems.length > 0 ? (
                    <div className="audio-grid">
                        {audioItems.slice(-6).map(item => (
                            <AudioCard key={item.id} item={item} />
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <h3>No files yet</h3>
                        <p>Be the first to share your sounds with the community!</p>
                        {user ? (
                            <Link to="/upload" className="btn btn-primary">Upload First File</Link>
                        ) : (
                            <Link to="/register" className="btn btn-primary">Join to Upload</Link>
                        )}
                    </div>
                )}
            </section>

            {/* Categories Section */}
            <section className="categories">
                <div className="categories-content">
                    <h2>Explore Categories</h2>
                    <p className="section-subtitle">Find exactly what you need for your productions</p>
                    <div className="category-grid">
                        <Link to="/styles" className="category-card">
                            <div className="category-icon">🎹</div>
                            <h3>Styles</h3>
                            <p>.sff1 .sff2 .sty</p>
                            <span className="category-count">
                                {audioItems.filter(item => item.type === 'style').length} files
                            </span>
                        </Link>

                        <Link to="/voices" className="category-card">
                            <div className="category-icon">🎤</div>
                            <h3>Voices</h3>
                            <p>.vce files</p>
                            <span className="category-count">
                                {audioItems.filter(item => item.type === 'voice').length} files
                            </span>
                        </Link>

                        <Link to="/multipads" className="category-card">
                            <div className="category-icon">🎛️</div>
                            <h3>Multipads</h3>
                            <p>.pad files</p>
                            <span className="category-count">
                                {audioItems.filter(item => item.type === 'multipad').length} files
                            </span>
                        </Link>

                        <Link to="/midi" className="category-card">
                            <div className="category-icon">🎵</div>
                            <h3>MIDI Files</h3>
                            <p>.mid .midi</p>
                            <span className="category-count">
                                {audioItems.filter(item => item.type === 'midi').length} files
                            </span>
                        </Link>

                        <Link to="/audiobeats" className="category-card">
                            <div className="category-icon">🥁</div>
                            <h3>Audio Beats</h3>
                            <p>.wav .mp3</p>
                            <span className="category-count">
                                {audioItems.filter(item => item.type === 'audio').length} files
                            </span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            {!user && (
                <section className="cta-section">
                    <div className="cta-content">
                        <h2>Ready to Share Your Sounds?</h2>
                        <p>Join Lenskings Productions today and start sharing your musical creations with a global community of producers and artists.</p>
                        <div className="cta-buttons">
                            <Link to="/register" className="btn btn-primary">Create Account</Link>
                            <Link to="/styles" className="btn btn-secondary">Browse Library</Link>
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
};

export default Home;