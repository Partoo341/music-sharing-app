import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';
import './Home.css';

const Home = () => {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        styles: 0,
        voices: 0,
        multipads: 0,
        midi: 0,
        audioBeats: 0
    });

    useEffect(() => {
        fetchFiles();
        fetchStats();
    }, []);

    const fetchFiles = async () => {
        try {
            const q = query(collection(db, 'uploads'), orderBy('timestamp', 'desc'));
            const querySnapshot = await getDocs(q);
            const filesData = [];
            querySnapshot.forEach((doc) => {
                filesData.push({ id: doc.id, ...doc.data() });
            });
            setFiles(filesData);
        } catch (error) {
            console.error('Error fetching files:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'uploads'));
            const statsData = {
                styles: 0,
                voices: 0,
                multipads: 0,
                midi: 0,
                audioBeats: 0
            };

            querySnapshot.forEach((doc) => {
                const file = doc.data();
                if (statsData[file.category] !== undefined) {
                    statsData[file.category]++;
                }
            });

            setStats(statsData);
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const recentFiles = files.slice(0, 6); // Show only 6 recent files

    return (
        <div className="home-container">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <h1>LENSKINGS PRODUCTIONS</h1>
                    <p className="tagline">Capturing Life, Creating Art</p>
                    <p className="subtitle">Share Your Piano/Organ files with the World</p>
                </div>
            </section>

            {/* Stats Section */}
            <section className="stats-section">
                <div className="stats-grid">
                    <div className="stat-item">
                        <div className="stat-number">0+</div>
                        <div className="stat-label">STYLES</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-number">0+</div>
                        <div className="stat-label">VOICES</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-number">0+</div>
                        <div className="stat-label">MULTIPADS</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-number">0+</div>
                        <div className="stat-label">MIDI FILES</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-number">0+</div>
                        <div className="stat-label">AUDIO BEATS</div>
                    </div>
                </div>
            </section>

            {/* Recently Added Section */}
            <section className="recent-section">
                <div className="section-header">
                    <h2>Recently Added</h2>
                    <p>Discover the latest uploads from our community</p>
                </div>

                {loading ? (
                    <div className="loading">Loading...</div>
                ) : recentFiles.length === 0 ? (
                    <div className="no-files">
                        <h3>No files yet</h3>
                        <p>Be the first to share your sounds with the community!</p>
                        <button className="upload-cta">UPLOAD FIRST FILE</button>
                    </div>
                ) : (
                    <div className="files-grid">
                        {recentFiles.map((file) => (
                            <div key={file.id} className="file-card">
                                <div className="file-icon"></div>
                                <div className="file-info">
                                    <h4>{file.title}</h4>
                                    <div className="file-meta">
                                        <span className="file-size">{(file.fileSize / 1024 / 1024).toFixed(1)} MB</span>
                                        <span className="file-date">{file.timestamp?.toDate?.().toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Categories Section */}
            <section className="categories-section">
                <div className="section-header">
                    <h2>Explore Categories</h2>
                    <p>Find exactly what you need for your productions</p>
                </div>

                <div className="categories-grid">
                    <div className="category-card">
                        <h3>Styles</h3>
                        <p className="file-types">.SFF1 .SFF2 .STY</p>
                        <p className="file-count">{stats.styles} files</p>
                    </div>

                    <div className="category-card">
                        <h3>Voices</h3>
                        <p className="file-types">.VCE FILES</p>
                        <p className="file-count">{stats.voices} files</p>
                    </div>

                    <div className="category-card">
                        <h3>Multipads</h3>
                        <p className="file-types">.PAD FILES</p>
                        <p className="file-count">{stats.multipads} files</p>
                    </div>

                    <div className="category-card">
                        <h3>MIDI Files</h3>
                        <p className="file-types">.MID .MIDI</p>
                        <p className="file-count">{stats.midi} files</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;