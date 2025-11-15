import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';
import './Home.css';

// Import social media icons (you'll need to add these images to your public folder)
const SocialIcons = () => (
    <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '15px',
        marginBottom: '30px',
        flexWrap: 'wrap'
    }}>
        <a href="https://www.instagram.com/parto_organist/" target="_blank" rel="noopener noreferrer" style={{
            transition: 'transform 0.3s ease'
        }}>
            <img
                src="/icons/instagram-icon.png"
                alt="Instagram"
                style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%'
                }}
                onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'inline';
                }}
            />
            <span style={{ display: 'none', color: '#FFD700', fontSize: '24px' }}>📷</span>
        </a>

        <a href="mailto:patrickirungumithamo@gmail.com" style={{
            transition: 'transform 0.3s ease'
        }}>
            <img
                src="/icons/email-icon.png"
                alt="Email"
                style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%'
                }}
                onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'inline';
                }}
            />
            <span style={{ display: 'none', color: '#FFD700', fontSize: '24px' }}>✉️</span>
        </a>

        <a href="https://www.tiktok.com/@lenskingsproductions" target="_blank" rel="noopener noreferrer" style={{
            transition: 'transform 0.3s ease'
        }}>
            <img
                src="/icons/tiktok-icon.png"
                alt="TikTok"
                style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%'
                }}
                onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'inline';
                }}
            />
            <span style={{ display: 'none', color: '#FFD700', fontSize: '24px' }}>🎵</span>
        </a>

        <a href="https://www.youtube.com/@lenskingsproductions" target="_blank" rel="noopener noreferrer" style={{
            transition: 'transform 0.3s ease'
        }}>
            <img
                src="/icons/youtube-icon.png"
                alt="YouTube"
                style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%'
                }}
                onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'inline';
                }}
            />
            <span style={{ display: 'none', color: '#FFD700', fontSize: '24px' }}>▶️</span>
        </a>

        <a href="https://wa.me/254704742748" target="_blank" rel="noopener noreferrer" style={{
            transition: 'transform 0.3s ease'
        }}>
            <img
                src="/icons/whatsapp-icon.png"
                alt="WhatsApp"
                style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%'
                }}
                onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'inline';
                }}
            />
            <span style={{ display: 'none', color: '#FFD700', fontSize: '24px' }}>💬</span>
        </a>
    </div>
);

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
    const [email, setEmail] = useState('');

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

    const handleEmailSubmit = (e) => {
        e.preventDefault();
        console.log('Email submitted:', email);
        alert('Thank you! Check your email for your free files.');
        setEmail('');
    };

    // WhatsApp redirect function
    const redirectToWhatsApp = (productName, productPrice, serviceType = 'product') => {
        const message = `Hello! I am interested in the ${productName} (${productPrice}) from Lenskings Productions website. I would like to place an order.`;
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/254704742748?text=${encodedMessage}`;
        window.open(whatsappUrl, '_blank');
    };

    // AdSense Component
    const AdSenseAd = ({ slot, format = "auto" }) => {
        React.useEffect(() => {
            if (window.adsbygoogle) {
                window.adsbygoogle.push({});
            }
        }, []);

        return (
            <div style={{ margin: '20px 0', textAlign: 'center' }}>
                <ins
                    className="adsbygoogle"
                    style={{ display: 'block' }}
                    data-ad-client="ca-pub-7910564262073474"
                    data-ad-slot={slot}
                    data-ad-format={format}
                    data-full-width-responsive="true"
                >
                </ins>
            </div>
        );
    };

    // Custom Services Component (Now comes FIRST)
    const CustomServices = () => {
        const services = [
            {
                name: "Custom Style Creation",
                price: "KSh 3,000",
                description: "We create custom styles from your reference songs",
                delivery: "3-5 days",
                features: ["Your preferred tempo", "Specific instrument sounds", "Multiple variations"]
            },
            {
                name: "Voice Programming",
                price: "KSh 4,500",
                description: "Custom voice programming for unique sounds",
                delivery: "5-7 days",
                features: ["Sample-based voices", "Effects programming", "Compatible with your keyboard"]
            },
            {
                name: "MIDI Arrangement",
                price: "KSh 3,500",
                description: "Professional MIDI arrangements from audio",
                delivery: "2-4 days",
                features: ["Multi-track MIDI", "Proper quantization", "Instrument separation"]
            }
        ];

        return (
            <section className="services-section" style={{
                padding: '60px 20px',
                background: 'linear-gradient(135deg, #FFF8DC 0%, #FFEBCD 100%)'
            }}>
                <div className="section-header">
                    <h2 style={{ color: '#8B4513', marginBottom: '10px' }}>Custom File Services</h2>
                    <p style={{ color: '#8B4513', fontSize: '18px' }}>Need something specific? We create custom files just for you</p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '25px',
                    maxWidth: '1200px',
                    margin: '0 auto'
                }}>
                    {services.map(service => (
                        <div key={service.name} style={{
                            background: 'linear-gradient(135deg, #FFD700 0%, #D4AF37 100%)',
                            padding: '30px',
                            borderRadius: '15px',
                            boxShadow: '0 5px 15px rgba(139, 69, 19, 0.3)',
                            textAlign: 'center',
                            border: '2px solid #8B4513'
                        }}>
                            <h3 style={{ color: '#8B4513', marginBottom: '15px' }}>{service.name}</h3>
                            <div style={{
                                fontSize: '28px',
                                fontWeight: 'bold',
                                color: '#8B4513',
                                margin: '10px 0'
                            }}>{service.price}</div>
                            <p style={{ color: '#8B4513', marginBottom: '20px' }}>{service.description}</p>
                            <div style={{ marginBottom: '20px' }}>
                                {service.features.map((feature, index) => (
                                    <div key={index} style={{
                                        color: '#8B4513',
                                        margin: '8px 0',
                                        textAlign: 'left'
                                    }}>• {feature}</div>
                                ))}
                            </div>
                            <div style={{
                                color: '#8B4513',
                                fontWeight: 'bold',
                                marginBottom: '15px'
                            }}>Delivery: {service.delivery}</div>
                            <button
                                onClick={() => redirectToWhatsApp(service.name, service.price, 'service')}
                                style={{
                                    background: 'linear-gradient(135deg, #8B4513 0%, #A0522D 100%)',
                                    color: '#FFD700',
                                    border: 'none',
                                    padding: '12px 30px',
                                    borderRadius: '25px',
                                    cursor: 'pointer',
                                    fontWeight: 'bold',
                                    width: '100%',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                Order Now
                            </button>
                        </div>
                    ))}
                </div>
            </section>
        );
    };

    // Premium Beats Component (Now comes AFTER Custom Services)
    const PremiumBeats = () => {
        const beatsPacks = [
            {
                id: 1,
                name: "Gospel Beats Pack",
                description: "50 professional gospel beats and styles for keyboards",
                price: "KSh 1,500",
                features: ["SFF1 & SFF2 formats", "Compatible with PSR series", "Full demo songs"],
                fileCount: "50 beats",
                popular: true
            },
            {
                id: 2,
                name: "African Beats Collection",
                description: "Authentic African beats and instrument voices",
                price: "KSh 1,000",
                features: ["Traditional rhythms", "Custom effects", "Easy to load"],
                fileCount: "35 beats + 20 voices"
            },
            {
                id: 3,
                name: "Worship Beats Bundle",
                description: "Perfect for church worship teams and live performance",
                price: "KSh 1,300",
                features: ["Modern worship beats", "Ambient sounds", "Easy triggering"],
                fileCount: "40 beats"
            }
        ];

        return (
            <section className="premium-beats-section" style={{
                padding: '60px 20px',
                background: 'linear-gradient(135deg, #FFD700 0%, #D4AF37 100%)',
                color: '#333'
            }}>
                <div className="section-header">
                    <h2 style={{ color: '#8B4513', marginBottom: '10px' }}>Premium Beats Collection</h2>
                    <p style={{ color: '#8B4513', fontSize: '18px' }}>Ready-to-use professional beats for instant creativity</p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '30px',
                    maxWidth: '1200px',
                    margin: '0 auto'
                }}>
                    {beatsPacks.map(pack => (
                        <div key={pack.id} style={{
                            background: 'linear-gradient(135deg, #FFF8DC 0%, #FFEBCD 100%)',
                            color: '#333',
                            padding: '30px',
                            borderRadius: '15px',
                            boxShadow: '0 10px 30px rgba(139, 69, 19, 0.3)',
                            position: 'relative',
                            transition: 'transform 0.3s ease',
                            border: '2px solid #D4AF37'
                        }}>
                            {pack.popular && <div style={{
                                position: 'absolute',
                                top: '-10px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                background: 'linear-gradient(135deg, #FFD700 0%, #B8860B 100%)',
                                color: '#8B4513',
                                padding: '5px 15px',
                                borderRadius: '20px',
                                fontSize: '12px',
                                fontWeight: 'bold'
                            }}>MOST POPULAR</div>}
                            <h3 style={{ color: '#8B4513', marginBottom: '15px' }}>{pack.name}</h3>
                            <p style={{ color: '#666', marginBottom: '20px' }}>{pack.description}</p>
                            <div style={{ margin: '20px 0' }}>
                                {pack.features.map((feature, index) => (
                                    <div key={index} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        margin: '10px 0',
                                        color: '#8B4513'
                                    }}>
                                        <span style={{ color: '#D4AF37', marginRight: '10px', fontWeight: 'bold' }}>✓</span>
                                        {feature}
                                    </div>
                                ))}
                            </div>
                            <div style={{ marginBottom: '20px' }}>
                                <span style={{
                                    background: '#8B4513',
                                    color: '#FFD700',
                                    padding: '5px 10px',
                                    borderRadius: '15px',
                                    fontSize: '14px'
                                }}>{pack.fileCount}</span>
                            </div>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginTop: '20px'
                            }}>
                                <div style={{
                                    fontSize: '24px',
                                    fontWeight: 'bold',
                                    color: '#8B4513'
                                }}>{pack.price}</div>
                                <button
                                    onClick={() => redirectToWhatsApp(pack.name, pack.price)}
                                    style={{
                                        background: 'linear-gradient(135deg, #8B4513 0%, #A0522D 100%)',
                                        color: '#FFD700',
                                        border: 'none',
                                        padding: '12px 25px',
                                        borderRadius: '25px',
                                        cursor: 'pointer',
                                        fontWeight: 'bold',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    Order Now
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        );
    };

    // Email Opt-in Component
    const EmailOptin = () => (
        <section className="email-section" style={{
            padding: '60px 20px',
            background: 'linear-gradient(135deg, #8B4513 0%, #A0522D 100%)',
            color: '#FFD700'
        }}>
            <div style={{
                maxWidth: '800px',
                margin: '0 auto',
                textAlign: 'center'
            }}>
                <h2 style={{ marginBottom: '20px', color: '#FFD700' }}>Get Free Beats Every Week!</h2>
                <p style={{ marginBottom: '30px', fontSize: '18px' }}>Join our email list and receive exclusive content</p>

                <div style={{
                    background: 'linear-gradient(135deg, #FFEBCD 0%, #FFF8DC 100%)',
                    padding: '40px',
                    borderRadius: '15px',
                    boxShadow: '0 10px 30px rgba(139, 69, 19, 0.4)',
                    border: '2px solid #FFD700'
                }}>
                    <div style={{ marginBottom: '25px' }}>
                        <h3 style={{ color: '#8B4513', marginBottom: '15px' }}>You'll Receive:</h3>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                            gap: '15px',
                            color: '#8B4513'
                        }}>
                            <div>🎵 <strong>2 free beats</strong> every week</div>
                            <div>🎹 Exclusive voice files</div>
                            <div>📱 Early access to new uploads</div>
                            <div>🎧 Tutorials and tips</div>
                        </div>
                    </div>

                    <form onSubmit={handleEmailSubmit}>
                        <input
                            type="email"
                            placeholder="Enter your email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{
                                padding: '15px',
                                border: '2px solid #D4AF37',
                                borderRadius: '25px',
                                width: '100%',
                                marginBottom: '15px',
                                fontSize: '16px',
                                textAlign: 'center'
                            }}
                        />
                        <button type="submit" style={{
                            padding: '15px 40px',
                            background: 'linear-gradient(135deg, #8B4513 0%, #A0522D 100%)',
                            color: '#FFD700',
                            border: 'none',
                            borderRadius: '25px',
                            cursor: 'pointer',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            width: '100%',
                            transition: 'all 0.3s ease'
                        }}>
                            Get Free Beats ↓
                        </button>
                    </form>
                    <p style={{
                        fontSize: '12px',
                        marginTop: '15px',
                        opacity: '0.8',
                        color: '#8B4513'
                    }}>
                        No spam. Unsubscribe anytime. We respect your privacy.
                    </p>
                </div>
            </div>
        </section>
    );

    // Footer Component
    const Footer = () => (
        <footer style={{
            background: 'linear-gradient(135deg, #8B4513 0%, #A0522D 100%)',
            color: '#FFD700',
            padding: '40px 20px 20px',
            textAlign: 'center'
        }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto'
            }}>
                {/* Social Icons */}
                <SocialIcons />

                {/* Copyright */}
                <div style={{
                    borderTop: '1px solid #D4AF37',
                    paddingTop: '20px',
                    marginTop: '20px'
                }}>
                    <p style={{
                        margin: 0,
                        fontSize: '14px',
                        color: '#FFD700'
                    }}>
                        All rights reserved ©2025 Lenskings Productions
                    </p>
                </div>
            </div>
        </footer>
    );

    const recentFiles = files.slice(0, 6);

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

            {/* Ad after Hero Section */}
            <AdSenseAd slot="home_hero_bottom" format="auto" />

            {/* Stats Section */}
            <section className="stats-section">
                <div className="stats-grid">
                    <div className="stat-item">
                        <div className="stat-number">{stats.styles}+</div>
                        <div className="stat-label">STYLES</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-number">{stats.voices}+</div>
                        <div className="stat-label">VOICES</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-number">{stats.multipads}+</div>
                        <div className="stat-label">MULTIPADS</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-number">{stats.midi}+</div>
                        <div className="stat-label">MIDI FILES</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-number">{stats.audioBeats}+</div>
                        <div className="stat-label">AUDIO BEATS</div>
                    </div>
                </div>
            </section>

            {/* Ad after Stats Section */}
            <AdSenseAd slot="home_after_stats" format="auto" />

            {/* Custom Services Section (Now comes FIRST) */}
            <CustomServices />

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

            {/* Ad after Recent Files */}
            <AdSenseAd slot="home_after_recent" format="auto" />

            {/* Premium Beats Section (Now comes AFTER Custom Services) */}
            <PremiumBeats />

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

            {/* Email List Section - At the bottom before footer */}
            <EmailOptin />

            {/* Footer */}
            <Footer />

            {/* Final Ad at the bottom */}
            <AdSenseAd slot="home_footer" format="auto" />
        </div>
    );
};

export default Home;