import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';

const CategoryPage = ({ categoryName }) => {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const styles = {
        container: {
            maxWidth: '1200px',
            margin: '60px auto',
            padding: '40px',
            background: 'linear-gradient(145deg, #252525, #1e1e1e)',
            borderRadius: '20px',
            border: '1px solid #333',
            boxShadow: '0 15px 40px rgba(0, 0, 0, 0.5)',
            position: 'relative',
            overflow: 'hidden'
        },
        containerBefore: {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '5px',
            background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)'
        },
        title: {
            textAlign: 'center',
            marginBottom: '35px',
            fontSize: '2.2rem',
            fontWeight: 800,
            letterSpacing: '2px',
            textTransform: 'uppercase',
            background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            padding: '10px 0'
        },
        searchSection: {
            marginBottom: '30px',
            textAlign: 'center'
        },
        searchInput: {
            width: '60%',
            padding: '15px 20px',
            background: '#333',
            border: '2px solid #444',
            borderRadius: '12px',
            color: '#e0e0e0',
            fontSize: '16px',
            fontWeight: 500,
            transition: 'all 0.3s ease'
        },
        filesGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '25px',
            marginTop: '30px'
        },
        fileCard: {
            background: '#2a2a2a',
            border: '1px solid #444',
            borderRadius: '12px',
            padding: '25px',
            transition: 'all 0.3s ease',
            position: 'relative',
            overflow: 'hidden'
        },
        fileHeader: {
            marginBottom: '15px'
        },
        fileTitle: {
            color: '#FFD700',
            fontSize: '1.3rem',
            fontWeight: '700',
            marginBottom: '8px'
        },
        fileCategory: {
            background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
            color: '#000',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '0.8rem',
            fontWeight: '700',
            display: 'inline-block'
        },
        fileInfo: {
            color: '#b0b0b0',
            marginBottom: '20px'
        },
        infoText: {
            marginBottom: '8px',
            fontSize: '0.9rem'
        },
        downloadBtn: {
            background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
            color: '#000',
            border: 'none',
            padding: '12px 25px',
            borderRadius: '8px',
            fontWeight: '700',
            cursor: 'pointer',
            textDecoration: 'none',
            display: 'inline-block',
            transition: 'all 0.3s ease'
        },
        noFiles: {
            textAlign: 'center',
            color: '#b0b0b0',
            fontSize: '1.1rem',
            marginTop: '50px'
        },
        loading: {
            textAlign: 'center',
            color: '#FFD700',
            fontSize: '1.2rem'
        }
    };

    useEffect(() => {
        fetchFiles();
    }, [categoryName]);

    const fetchFiles = async () => {
        try {
            const q = query(
                collection(db, 'uploads'),
                where('category', '==', categoryName),
                orderBy('timestamp', 'desc')
            );
            const querySnapshot = await getDocs(q);
            const filesData = [];
            querySnapshot.forEach((doc) => {
                filesData.push({ id: doc.id, ...doc.data() });
            });
            setFiles(filesData);
        } catch (error) {
            console.error(`Error fetching ${categoryName}:`, error);
            setFiles([]);
        } finally {
            setLoading(false);
        }
    };

    const filteredFiles = files.filter(file => {
        return file.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            file.userEmail?.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const formatFileSize = (bytes) => {
        if (!bytes) return 'Unknown size';
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    if (loading) {
        return (
            <div style={styles.container}>
                <div style={styles.containerBefore}></div>
                <div style={styles.loading}>Loading {categoryName}...</div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.containerBefore}></div>
            <h1 style={styles.title}>{categoryName.charAt(0).toUpperCase() + categoryName.slice(1)}</h1>

            <div style={styles.searchSection}>
                <input
                    type="text"
                    placeholder={`Search ${categoryName}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={styles.searchInput}
                />
            </div>

            <div style={styles.filesGrid}>
                {filteredFiles.length === 0 ? (
                    <div style={styles.noFiles}>
                        {searchTerm ? `No ${categoryName} match your search.` : `No ${categoryName} available yet.`}
                    </div>
                ) : (
                    filteredFiles.map((file) => (
                        <div key={file.id} style={styles.fileCard}>
                            <div style={styles.fileHeader}>
                                <h3 style={styles.fileTitle}>{file.title || 'Untitled'}</h3>
                                <span style={styles.fileCategory}>{file.category}</span>
                            </div>

                            <div style={styles.fileInfo}>
                                <p style={styles.infoText}><strong>Uploaded by:</strong> {file.userEmail}</p>
                                <p style={styles.infoText}><strong>Size:</strong> {formatFileSize(file.fileSize)}</p>
                                <p style={styles.infoText}><strong>Date:</strong> {file.timestamp?.toDate?.().toLocaleDateString() || 'Unknown date'}</p>
                                <p style={styles.infoText}><strong>Type:</strong> {file.fileType || 'Unknown'}</p>
                            </div>

                            {file.downloadURL && (
                                <a
                                    href={file.downloadURL}
                                    download
                                    style={styles.downloadBtn}
                                    onMouseEnter={(e) => {
                                        e.target.style.transform = 'translateY(-2px)';
                                        e.target.style.boxShadow = '0 5px 15px rgba(255, 215, 0, 0.4)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.transform = 'translateY(0)';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                >
                                    Download
                                </a>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CategoryPage;