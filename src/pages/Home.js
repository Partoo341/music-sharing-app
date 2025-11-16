import React, { useState, useEffect, useRef } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase/config';

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
    const [showChatbot, setShowChatbot] = useState(false);
    const [chatMessages, setChatMessages] = useState([]);
    const [currentMessage, setCurrentMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchFiles();
        fetchStats();
        setChatMessages([
            {
                id: 1,
                text: "Hello! I'm your Lenskings Productions assistant. How can I help you today?",
                isBot: true
            }
        ]);
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
            setFiles([]);
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
            setStats({
                styles: 0,
                voices: 0,
                multipads: 0,
                midi: 0,
                audioBeats: 0
            });
        }
    };

    const handleUploadClick = () => {
        if (auth.currentUser) {
            navigate('/upload');
        } else {
            navigate('/login');
        }
    };

    const handleSendMessage = () => {
        if (!currentMessage.trim()) return;

        const userMessage = {
            id: chatMessages.length + 1,
            text: currentMessage,
            isBot: false
        };

        setChatMessages(prev => [...prev, userMessage]);
        setCurrentMessage('');

        setTimeout(() => {
            const botResponse = {
                id: chatMessages.length + 2,
                text: "Thank you for your message! Our team will get back to you soon.",
                isBot: true
            };
            setChatMessages(prev => [...prev, botResponse]);
        }, 1000);
    };

    const AdSenseAd = ({ slot, format = "auto" }) => {
        const adRef = useRef(null);
        const adLoaded = useRef(false);

        useEffect(() => {
            if (adRef.current && !adLoaded.current) {
                try {
                    if (window.adsbygoogle && !adRef.current.querySelector('iframe')) {
                        window.adsbygoogle.push({});
                        adLoaded.current = true;
                    }
                } catch (error) {
                    console.warn('AdSense error:', error);
                }
            }
        }, [slot]);

        return (
            <div style={{ margin: '15px 0', textAlign: 'center' }}>
                <ins
                    ref={adRef}
                    className="adsbygoogle"
                    style={{
                        display: 'block',
                        minHeight: format === 'auto' ? '100px' : '250px'
                    }}
                    data-ad-client="ca-pub-7910564262073474"
                    data-ad-slot={slot}
                    data-ad-format={format}
                    data-full-width-responsive="true"
                />
            </div>
        );
    };

    const recentFiles = files.slice(0, 6);

    // ORIGINAL FONT SIZES but COMPACT SPACING
    const styles = {
        homeContainer: {
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            color: 'white'
        },

        // HERO - COMPACT but ORIGINAL FONT SIZES
        heroSection: {
            background: 'linear-gradient(135deg, #000000 0%, #2d2d2d 100%)',
            padding: '40px 20px',
            textAlign: 'center',
            color: 'white',
            borderBottom: '3px solid #FFD700'
        },
        heroTitle: {
            fontSize: '2.5rem',
            fontWeight: '800',
            marginBottom: '10px',
            background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
        },
        tagline: {
            fontSize: '1.3rem',
            fontWeight: '300',
            marginBottom: '5px',
            color: '#FFD700'
        },
        subtitle: {
            fontSize: '1.1rem',
            color: '#cccccc'
        },

        // STATS - COMPACT but ORIGINAL FONT SIZES
        statsSection: {
            background: '#0a0a0a',
            padding: '30px 20px',
            textAlign: 'center',
            borderBottom: '2px solid #333'
        },
        statsGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '15px',
            maxWidth: '1000px',
            margin: '0 auto'
        },
        statItem: {
            padding: '20px 15px',
            background: 'linear-gradient(135deg, #1a1a1a, #2d2d2d)',
            borderRadius: '10px',
            color: 'white',
            border: '2px solid #333'
        },
        statNumber: {
            fontSize: '2rem',
            fontWeight: '800',
            marginBottom: '5px',
            color: '#FFD700'
        },
        statLabel: {
            fontSize: '0.9rem',
            fontWeight: '600',
            textTransform: 'uppercase',
            color: '#cccccc'
        },

        // RECENT FILES - COMPACT but ORIGINAL FONT SIZES
        recentSection: {
            padding: '40px 20px',
            background: '#111111'
        },
        sectionHeader: {
            textAlign: 'center',
            marginBottom: '25px'
        },
        sectionTitle: {
            fontSize: '2rem',
            color: '#FFD700',
            marginBottom: '8px'
        },
        sectionSubtitle: {
            fontSize: '1rem',
            color: '#cccccc'
        },
        filesGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            maxWidth: '1000px',
            margin: '0 auto'
        },
        fileCard: {
            background: '#1a1a1a',
            padding: '20px',
            borderRadius: '10px',
            border: '2px solid #333',
            borderLeft: '4px solid #FFD700'
        },
        fileIcon: {
            width: '40px',
            height: '40px',
            background: 'linear-gradient(135deg, #FFD700, #FFA500)',
            borderRadius: '6px',
            marginBottom: '12px'
        },
        fileTitle: {
            fontSize: '1.1rem',
            color: 'white',
            marginBottom: '8px'
        },
        fileMeta: {
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '0.85rem',
            color: '#cccccc'
        },

        // CATEGORIES - COMPACT but ORIGINAL FONT SIZES
        categoriesSection: {
            padding: '40px 20px',
            background: '#0a0a0a'
        },
        categoriesGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            maxWidth: '1000px',
            margin: '0 auto'
        },
        categoryCard: {
            background: 'linear-gradient(135deg, #1a1a1a, #2d2d2d)',
            padding: '25px',
            borderRadius: '10px',
            color: 'white',
            textAlign: 'center',
            border: '2px solid #333'
        },
        categoryTitle: {
            fontSize: '1.3rem',
            marginBottom: '10px',
            color: '#FFD700'
        },
        fileTypes: {
            fontSize: '0.85rem',
            color: '#cccccc',
            marginBottom: '8px'
        },
        fileCount: {
            fontSize: '1rem',
            fontWeight: '700',
            color: '#FFD700'
        },

        // CONTACT - COMPACT but ORIGINAL FONT SIZES
        contactSection: {
            padding: '40px 20px',
            background: '#111111',
            borderTop: '2px solid #333'
        },
        contactGrid: {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '30px',
            maxWidth: '1000px',
            margin: '0 auto'
        },
        contactInfo: {
            background: '#1a1a1a',
            padding: '25px',
            borderRadius: '10px',
            border: '2px solid #333'
        },
        contactForm: {
            background: '#1a1a1a',
            padding: '25px',
            borderRadius: '10px',
            border: '2px solid #333'
        },
        formGroup: {
            marginBottom: '20px'
        },
        formLabel: {
            display: 'block',
            marginBottom: '8px',
            color: '#FFD700',
            fontWeight: '600'
        },
        formInput: {
            width: '100%',
            padding: '12px',
            background: '#2d2d2d',
            border: '2px solid #444',
            borderRadius: '6px',
            color: 'white',
            fontSize: '16px'
        },
        formTextarea: {
            width: '100%',
            padding: '12px',
            background: '#2d2d2d',
            border: '2px solid #444',
            borderRadius: '6px',
            color: 'white',
            fontSize: '16px',
            minHeight: '100px',
            resize: 'vertical'
        },
        submitButton: {
            background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
            color: '#000',
            border: 'none',
            padding: '12px 25px',
            borderRadius: '6px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            width: '100%'
        },

        // STATES - COMPACT but ORIGINAL FONT SIZES
        loading: {
            textAlign: 'center',
            padding: '40px 20px',
            fontSize: '1.1rem',
            color: '#cccccc'
        },
        noFiles: {
            textAlign: 'center',
            padding: '40px 20px',
            background: '#1a1a1a',
            borderRadius: '10px',
            border: '2px solid #333',
            maxWidth: '400px',
            margin: '0 auto'
        },
        noFilesTitle: {
            fontSize: '1.3rem',
            color: '#FFD700',
            marginBottom: '12px'
        },
        noFilesText: {
            color: '#cccccc',
            marginBottom: '20px'
        },
        uploadCta: {
            background: 'linear-gradient(135deg, #FFD700, #FFA500)',
            color: '#000',
            border: 'none',
            padding: '10px 25px',
            borderRadius: '20px',
            fontSize: '0.95rem',
            fontWeight: '600',
            cursor: 'pointer'
        },

        // FOOTER - COMPACT but ORIGINAL FONT SIZES
        footerSection: {
            background: '#000000',
            color: 'white',
            padding: '30px 20px 15px',
            borderTop: '3px solid #FFD700'
        },
        footerContent: {
            maxWidth: '1000px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: '1fr 2fr',
            gap: '30px',
            marginBottom: '20px'
        },
        footerLogoTitle: {
            fontSize: '1.5rem',
            marginBottom: '8px',
            background: 'linear-gradient(135deg, #FFD700, #FFA500)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
        },
        footerLogoText: {
            color: '#cccccc',
            fontSize: '0.9rem'
        },
        footerLinks: {
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '20px'
        },
        footerColumnTitle: {
            fontSize: '1.1rem',
            marginBottom: '15px',
            color: '#FFD700'
        },
        footerList: {
            listStyle: 'none',
            padding: 0,
            margin: 0
        },
        footerListItem: {
            marginBottom: '8px'
        },
        footerLink: {
            color: '#cccccc',
            textDecoration: 'none',
            fontSize: '0.9rem'
        },
        footerBottom: {
            maxWidth: '1000px',
            margin: '0 auto',
            paddingTop: '15px',
            borderTop: '1px solid #333',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        },
        footerCopyright: {
            color: '#cccccc',
            fontSize: '0.85rem'
        },
        footerSocial: {
            display: 'flex',
            gap: '12px'
        },
        socialIcon: {
            width: '28px',
            height: '28px'
        },

        // CHATBOT - COMPACT
        chatbotButton: {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: '60px',
            height: '60px',
            background: 'linear-gradient(135deg, #FFD700, #FFA500)',
            borderRadius: '50%',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            zIndex: 1000
        },
        chatbotWindow: {
            position: 'fixed',
            bottom: '90px',
            right: '20px',
            width: '350px',
            height: '500px',
            background: '#1a1a1a',
            border: '2px solid #FFD700',
            borderRadius: '15px',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column'
        },
        chatbotHeader: {
            background: 'linear-gradient(135deg, #FFD700, #FFA500)',
            color: '#000',
            padding: '15px',
            borderRadius: '13px 13px 0 0',
            fontWeight: '600',
            textAlign: 'center'
        },
        chatbotMessages: {
            flex: 1,
            padding: '15px',
            overflowY: 'auto',
            background: '#0a0a0a'
        },
        message: {
            marginBottom: '15px',
            padding: '10px 15px',
            borderRadius: '10px',
            maxWidth: '80%'
        },
        botMessage: {
            background: '#2d2d2d',
            color: 'white',
            alignSelf: 'flex-start'
        },
        userMessage: {
            background: 'linear-gradient(135deg, #FFD700, #FFA500)',
            color: '#000',
            alignSelf: 'flex-end'
        },
        chatbotInput: {
            display: 'flex',
            padding: '15px',
            background: '#1a1a1a',
            borderRadius: '0 0 13px 13px'
        },
        chatInput: {
            flex: 1,
            padding: '10px',
            background: '#2d2d2d',
            border: '1px solid #444',
            borderRadius: '8px',
            color: 'white',
            marginRight: '10px'
        },
        sendButton: {
            background: 'linear-gradient(135deg, #FFD700, #FFA500)',
            color: '#000',
            border: 'none',
            padding: '10px 15px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600'
        }
    };

    return (
        <div style={styles.homeContainer}>
            {/* Hero Section */}
            <section style={styles.heroSection}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <h1 style={styles.heroTitle}>LENSKINGS PRODUCTIONS</h1>
                    <p style={styles.tagline}>Capturing Life, Creating Art</p>
                    <p style={styles.subtitle}>Share Your Piano/Organ files with the World</p>
                </div>
            </section>

            <AdSenseAd slot="home_hero_bottom" format="auto" />

            {/* Stats Section */}
            <section style={styles.statsSection}>
                <div style={styles.statsGrid}>
                    {['styles', 'voices', 'multipads', 'midi', 'audioBeats'].map((stat) => (
                        <div key={stat} style={styles.statItem}>
                            <div style={styles.statNumber}>{stats[stat]}+</div>
                            <div style={styles.statLabel}>{stat.replace(/([A-Z])/g, ' $1').toUpperCase()}</div>
                        </div>
                    ))}
                </div>
            </section>

            <AdSenseAd slot="home_after_stats" format="auto" />

            {/* Recently Added Section */}
            <section style={styles.recentSection}>
                <div style={styles.sectionHeader}>
                    <h2 style={styles.sectionTitle}>Recently Added</h2>
                    <p style={styles.sectionSubtitle}>Discover the latest uploads from our community</p>
                </div>

                {loading ? (
                    <div style={styles.loading}>Loading...</div>
                ) : recentFiles.length === 0 ? (
                    <div style={styles.noFiles}>
                        <h3 style={styles.noFilesTitle}>No files yet</h3>
                        <p style={styles.noFilesText}>Be the first to share your sounds with the community!</p>
                        <button
                            style={styles.uploadCta}
                            onClick={handleUploadClick}
                        >
                            UPLOAD FIRST FILE
                        </button>
                    </div>
                ) : (
                    <div style={styles.filesGrid}>
                        {recentFiles.map((file) => (
                            <div key={file.id} style={styles.fileCard}>
                                <div style={styles.fileIcon}></div>
                                <div>
                                    <h4 style={styles.fileTitle}>{file.title}</h4>
                                    <div style={styles.fileMeta}>
                                        <span>{file.fileSize ? (file.fileSize / 1024 / 1024).toFixed(1) + ' MB' : 'Size unknown'}</span>
                                        <span>{file.timestamp?.toDate?.().toLocaleDateString() || 'Date unknown'}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            <AdSenseAd slot="home_after_recent" format="auto" />

            {/* Categories Section */}
            <section style={styles.categoriesSection}>
                <div style={styles.sectionHeader}>
                    <h2 style={styles.sectionTitle}>Explore Categories</h2>
                    <p style={styles.sectionSubtitle}>Find exactly what you need for your productions</p>
                </div>
                <div style={styles.categoriesGrid}>
                    {[
                        { name: 'Styles', types: '.SFF1 .SFF2 .STY', count: stats.styles },
                        { name: 'Voices', types: '.VCE FILES', count: stats.voices },
                        { name: 'Multipads', types: '.PAD FILES', count: stats.multipads },
                        { name: 'MIDI Files', types: '.MID .MIDI', count: stats.midi }
                    ].map((category) => (
                        <div key={category.name} style={styles.categoryCard}>
                            <h3 style={styles.categoryTitle}>{category.name}</h3>
                            <p style={styles.fileTypes}>{category.types}</p>
                            <p style={styles.fileCount}>{category.count} files</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Contact Form Section */}
            <section style={styles.contactSection}>
                <div style={styles.sectionHeader}>
                    <h2 style={styles.sectionTitle}>Contact Us</h2>
                    <p style={styles.sectionSubtitle}>Get in touch with our team</p>
                </div>
                <div style={styles.contactGrid}>
                    <div style={styles.contactInfo}>
                        <h3 style={{ color: '#FFD700', marginBottom: '15px' }}>Get In Touch</h3>
                        <p style={{ color: '#cccccc', marginBottom: '15px' }}>
                            Have questions about our music files? Need support with your uploads?
                            We're here to help you with all your musical needs.
                        </p>
                        <div style={{ marginBottom: '12px' }}>
                            <strong style={{ color: '#FFD700' }}>Email:</strong>
                            <p style={{ color: '#cccccc' }}>patrickirungumithamo@gmail.com</p>
                        </div>
                        <div>
                            <strong style={{ color: '#FFD700' }}>WhatsApp:</strong>
                            <p style={{ color: '#cccccc' }}>+254 704 742 748</p>
                        </div>
                    </div>
                    <div style={styles.contactForm}>
                        <div style={styles.formGroup}>
                            <label style={styles.formLabel}>Name</label>
                            <input type="text" style={styles.formInput} placeholder="Your name" />
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.formLabel}>Email</label>
                            <input type="email" style={styles.formInput} placeholder="Your email" />
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.formLabel}>Message</label>
                            <textarea style={styles.formTextarea} placeholder="Your message" />
                        </div>
                        <button style={styles.submitButton}>SEND MESSAGE</button>
                    </div>
                </div>
            </section>

            <AdSenseAd slot="home_footer" format="auto" />

            {/* Footer Section */}
            <footer style={styles.footerSection}>
                <div style={styles.footerContent}>
                    <div>
                        <h3 style={styles.footerLogoTitle}>LENSKINGS PRODUCTIONS</h3>
                        <p style={styles.footerLogoText}>Capturing Life, Creating Art</p>
                    </div>
                    <div style={styles.footerLinks}>
                        <div>
                            <h4 style={styles.footerColumnTitle}>Categories</h4>
                            <ul style={styles.footerList}>
                                <li style={styles.footerListItem}><a href="/styles" style={styles.footerLink}>Styles</a></li>
                                <li style={styles.footerListItem}><a href="/voices" style={styles.footerLink}>Voices</a></li>
                                <li style={styles.footerListItem}><a href="/multipads" style={styles.footerLink}>Multipads</a></li>
                                <li style={styles.footerListItem}><a href="/midi" style={styles.footerLink}>MIDI Files</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 style={styles.footerColumnTitle}>Support</h4>
                            <ul style={styles.footerList}>
                                <li style={styles.footerListItem}><a href="#help" style={styles.footerLink}>Help Center</a></li>
                                <li style={styles.footerListItem}><a href="#contact" style={styles.footerLink}>Contact Us</a></li>
                                <li style={styles.footerListItem}><a href="#privacy" style={styles.footerLink}>Privacy Policy</a></li>
                                <li style={styles.footerListItem}><a href="#terms" style={styles.footerLink}>Terms of Service</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 style={styles.footerColumnTitle}>Connect</h4>
                            <ul style={styles.footerList}>
                                <li style={styles.footerListItem}><a href="https://wa.me/254704742748" style={styles.footerLink}>WhatsApp</a></li>
                                <li style={styles.footerListItem}><a href="https://www.youtube.com/@lenskingsproductions" style={styles.footerLink}>YouTube</a></li>
                                <li style={styles.footerListItem}><a href="https://www.tiktok.com/@lenskingsproductions" style={styles.footerLink}>TikTok</a></li>
                                <li style={styles.footerListItem}><a href="https://www.instagram.com/parto_organist/" style={styles.footerLink}>Instagram</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div style={styles.footerBottom}>
                    <div style={styles.footerCopyright}>
                        <p>&copy; 2025 Lenskings Productions. All Rights Reserved.</p>
                    </div>
                    <div style={styles.footerSocial}>
                        <a href="https://wa.me/254704742748" aria-label="WhatsApp"><img src="/icons/whatsapp-icon.png" alt="WhatsApp" style={styles.socialIcon} /></a>
                        <a href="https://www.youtube.com/@lenskingsproductions" aria-label="YouTube"><img src="/icons/youtube-icon.png" alt="YouTube" style={styles.socialIcon} /></a>
                        <a href="https://www.tiktok.com/@lenskingsproductions" aria-label="TikTok"><img src="/icons/tiktok-icon.png" alt="TikTok" style={styles.socialIcon} /></a>
                        <a href="https://www.instagram.com/parto_organist/" aria-label="Instagram"><img src="/icons/instagram-icon.png" alt="Instagram" style={styles.socialIcon} /></a>
                        <a href="mailto:patrickirungumithamo@gmail.com" aria-label="Email"><img src="/icons/email-icon.png" alt="Email" style={styles.socialIcon} /></a>
                    </div>
                </div>
            </footer>

            {/* Chatbot */}
            <button style={styles.chatbotButton} onClick={() => setShowChatbot(!showChatbot)}>💬</button>
            {showChatbot && (
                <div style={styles.chatbotWindow}>
                    <div style={styles.chatbotHeader}>Lenskings Assistant</div>
                    <div style={styles.chatbotMessages}>
                        {chatMessages.map((message) => (
                            <div key={message.id} style={{ ...styles.message, ...(message.isBot ? styles.botMessage : styles.userMessage) }}>
                                {message.text}
                            </div>
                        ))}
                    </div>
                    <div style={styles.chatbotInput}>
                        <input type="text" value={currentMessage} onChange={(e) => setCurrentMessage(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} placeholder="Type your message..." style={styles.chatInput} />
                        <button onClick={handleSendMessage} style={styles.sendButton}>Send</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;