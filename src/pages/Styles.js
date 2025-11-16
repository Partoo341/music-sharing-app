import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { storage, db } from '../firebase/config';
import { ref, listAll, getDownloadURL, getMetadata } from 'firebase/storage';
import { addDoc, serverTimestamp } from 'firebase/firestore';

const Styles = () => {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [migrating, setMigrating] = useState(false);
    const [migrationStatus, setMigrationStatus] = useState('');

    // Add useEffect to call fetchStyles on component mount
    useEffect(() => {
        fetchStyles();
    }, []);

    const fetchStyles = async () => {
        try {
            console.log('🔍 Fetching styles from Firestore...');
            setLoading(true);

            // ONLY check the uploads collection which actually exists
            let allFiles = [];

            try {
                console.log('📁 Checking uploads collection for styles...');

                // First, try to query styles specifically
                const stylesQuery = query(
                    collection(db, 'uploads'),
                    where('category', '==', 'styles')
                );
                const stylesSnapshot = await getDocs(stylesQuery);

                console.log(`🎯 Styles in uploads: ${stylesSnapshot.size} documents`);

                stylesSnapshot.forEach((doc) => {
                    const data = doc.data();
                    console.log(`📄 Style: ${data.title || data.fileName}`, data);
                    allFiles.push({
                        id: doc.id,
                        ...data,
                        collection: 'uploads'
                    });
                });

                // If no styles found with category query, get all uploads and filter manually
                if (stylesSnapshot.size === 0) {
                    console.log('🔍 No styles found with category query, checking all uploads...');
                    const allUploadsQuery = query(collection(db, 'uploads'));
                    const allUploadsSnapshot = await getDocs(allUploadsQuery);

                    console.log(`📊 All documents in uploads: ${allUploadsSnapshot.size}`);

                    allUploadsSnapshot.forEach((doc) => {
                        const data = doc.data();
                        // Check if it's a style file by category or file extension
                        if (data.category === 'styles' ||
                            data.fileName?.toLowerCase().includes('.sty') ||
                            data.fileName?.toLowerCase().includes('.sff') ||
                            data.fileName?.toLowerCase().includes('.sff1') ||
                            data.fileName?.toLowerCase().includes('.sff2')) {
                            console.log(`🎯 Found style in all uploads: ${data.fileName}`);
                            allFiles.push({
                                id: doc.id,
                                ...data,
                                collection: 'uploads'
                            });
                        }
                    });
                }

            } catch (uploadError) {
                console.error('❌ Error accessing uploads collection:', uploadError);
            }

            console.log('📊 Total styles found:', allFiles.length);
            setFiles(allFiles);

        } catch (error) {
            console.error('❌ Final error fetching styles:', error);
            setFiles([]);
        } finally {
            setLoading(false);
        }
    };

    // Migration function
    const migrateFilesToFirestore = async () => {
        try {
            setMigrating(true);
            setMigrationStatus('🚀 Starting migration from Storage to Firestore...');

            // List all files in storage
            const storageRef = ref(storage, 'uploads/');
            const result = await listAll(storageRef);

            setMigrationStatus(`📁 Found ${result.items.length} files in Storage`);

            let migratedCount = 0;
            let errorCount = 0;

            // Process each file
            for (const itemRef of result.items) {
                try {
                    // Get file metadata and download URL
                    const [downloadURL, metadata] = await Promise.all([
                        getDownloadURL(itemRef),
                        getMetadata(itemRef)
                    ]);

                    // Extract category from path (uploads/styles/... or uploads/voices/...)
                    const pathParts = itemRef.fullPath.split('/');
                    const category = pathParts[1] || 'styles'; // Default to styles if no category in path

                    // Check if file already exists in Firestore
                    const existingQuery = query(
                        collection(db, 'uploads'),
                        where('fileName', '==', metadata.name)
                    );
                    const existingSnapshot = await getDocs(existingQuery);

                    if (existingSnapshot.empty) {
                        // Create Firestore document only if it doesn't exist
                        await addDoc(collection(db, 'uploads'), {
                            title: metadata.name.replace(/\.[^/.]+$/, ""), // Remove extension
                            category: category,
                            fileName: metadata.name,
                            fileSize: metadata.size,
                            fileType: metadata.contentType,
                            downloadURL: downloadURL,
                            storagePath: itemRef.fullPath,
                            userId: 'migration',
                            userEmail: 'migration@lenskings.com',
                            timestamp: serverTimestamp()
                        });

                        console.log(`✅ Migrated: ${metadata.name}`);
                        setMigrationStatus(`✅ Migrated: ${metadata.name}`);
                        migratedCount++;
                    } else {
                        console.log(`⚠️ Already exists: ${metadata.name}`);
                        setMigrationStatus(`⚠️ Already exists: ${metadata.name}`);
                    }

                } catch (error) {
                    console.error(`❌ Failed to migrate ${itemRef.name}:`, error);
                    setMigrationStatus(`❌ Failed: ${itemRef.name}`);
                    errorCount++;
                }
            }

            const finalMessage = `🎉 Migration complete! ${migratedCount} files migrated, ${errorCount} errors`;
            setMigrationStatus(finalMessage);
            console.log(finalMessage);

            // Refresh the styles list after migration
            await fetchStyles(); // Wait for fetch to complete

        } catch (error) {
            console.error('❌ Migration failed:', error);
            setMigrationStatus(`❌ Migration failed: ${error.message}`);
        } finally {
            setMigrating(false);
        }
    };

    const filteredFiles = files.filter(file => {
        if (!file) return false;
        return file.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            file.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            file.fileName?.toLowerCase().includes(searchTerm.toLowerCase());
    });

    // ... (keep all your existing styles and JSX code exactly as they are)
    // Styles - Black, White, Golden, Yellow Theme
    const styles = {
        // Container
        categoryContainer: {
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

        // Migration Section
        migrationSection: {
            background: '#1a1a1a',
            padding: '20px',
            borderRadius: '10px',
            border: '2px solid #FFD700',
            marginBottom: '30px',
            textAlign: 'center'
        },
        migrationButton: {
            background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
            color: '#000',
            border: 'none',
            padding: '12px 25px',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            marginBottom: '15px'
        },
        migrationButtonDisabled: {
            background: '#666',
            color: '#999',
            cursor: 'not-allowed'
        },
        migrationStatus: {
            color: '#FFD700',
            fontSize: '0.9rem',
            marginTop: '10px',
            minHeight: '20px'
        },

        // Search Section
        searchSection: {
            maxWidth: '600px',
            margin: '0 auto 40px',
            textAlign: 'center'
        },
        searchInput: {
            width: '100%',
            padding: '15px 20px',
            background: '#2d2d2d',
            border: '2px solid #444',
            borderRadius: '25px',
            color: 'white',
            fontSize: '16px',
            transition: 'all 0.3s ease',
            boxSizing: 'border-box'
        },

        // Files Grid
        filesGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '25px',
            maxWidth: '1200px',
            margin: '0 auto'
        },

        // File Card
        fileCard: {
            background: '#1a1a1a',
            padding: '25px',
            borderRadius: '15px',
            border: '2px solid #333',
            boxShadow: '0 5px 20px rgba(255, 215, 0, 0.1)',
            transition: 'all 0.3s ease',
            display: 'flex',
            flexDirection: 'column',
            height: '100%'
        },
        fileHeader: {
            marginBottom: '15px',
            borderBottom: '1px solid #333',
            paddingBottom: '15px'
        },
        fileTitle: {
            fontSize: '1.3rem',
            color: '#FFD700',
            marginBottom: '8px',
            fontWeight: '600'
        },
        fileCategory: {
            background: 'linear-gradient(135deg, #FFD700, #FFA500)',
            color: '#000',
            padding: '4px 12px',
            borderRadius: '12px',
            fontSize: '0.8rem',
            fontWeight: '600',
            display: 'inline-block'
        },
        fileInfo: {
            flex: 1,
            marginBottom: '20px'
        },
        fileInfoText: {
            margin: '8px 0',
            color: '#cccccc',
            fontSize: '0.9rem'
        },

        // Download Button
        downloadBtn: {
            background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
            color: '#000',
            border: 'none',
            padding: '12px 25px',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            textDecoration: 'none',
            textAlign: 'center',
            display: 'block',
            marginTop: 'auto'
        },

        // Loading State
        loading: {
            textAlign: 'center',
            padding: '60px 20px',
            fontSize: '1.2rem',
            color: '#FFD700'
        },

        // No Files State
        noFiles: {
            textAlign: 'center',
            padding: '60px 20px',
            background: '#1a1a1a',
            borderRadius: '15px',
            border: '2px solid #333',
            color: '#cccccc',
            fontSize: '1.1rem',
            maxWidth: '500px',
            margin: '0 auto'
        },

        // Stats
        stats: {
            textAlign: 'center',
            marginBottom: '30px',
            color: '#FFD700',
            fontSize: '1.1rem'
        }
    };

    // Hover effects
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
        if (!migrating) {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 8px 25px rgba(255, 215, 0, 0.4)';
        }
    };

    const handleButtonLeave = (e) => {
        e.target.style.transform = 'translateY(0)';
        e.target.style.boxShadow = 'none';
    };

    const handleInputFocus = (e) => {
        e.target.style.borderColor = '#FFD700';
        e.target.style.background = '#333';
    };

    const handleInputBlur = (e) => {
        e.target.style.borderColor = '#444';
        e.target.style.background = '#2d2d2d';
    };

    if (loading) {
        return (
            <div style={styles.categoryContainer}>
                <div style={styles.loading}>
                    <div>Loading styles...</div>
                    <div style={{ fontSize: '14px', color: '#cccccc', marginTop: '10px' }}>
                        Checking Firestore collections...
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.categoryContainer}>
            {/* Header */}
            <div style={styles.header}>
                <h1 style={styles.title}>STYLES</h1>
                <p style={{ color: '#cccccc', fontSize: '1.1rem' }}>
                    Discover and download amazing style files for your music productions
                </p>
            </div>

            {/* Migration Section - Only show if no files found */}
            {files.length === 0 && (
                <div style={styles.migrationSection}>
                    <h3 style={{ color: '#FFD700', marginBottom: '15px' }}>
                        No Styles Found in Database
                    </h3>
                    <p style={{ color: '#cccccc', marginBottom: '20px' }}>
                        Your files are in Storage but not in Firestore. Click below to migrate them.
                    </p>
                    <button
                        onClick={migrateFilesToFirestore}
                        disabled={migrating}
                        style={{
                            ...styles.migrationButton,
                            ...(migrating ? styles.migrationButtonDisabled : {})
                        }}
                        onMouseEnter={handleButtonHover}
                        onMouseLeave={handleButtonLeave}
                    >
                        {migrating ? '🔄 Migrating...' : '🚀 Migrate Files from Storage'}
                    </button>
                    {migrationStatus && (
                        <div style={styles.migrationStatus}>
                            {migrationStatus}
                        </div>
                    )}
                </div>
            )}

            {/* Stats */}
            {files.length > 0 && (
                <div style={styles.stats}>
                    {filteredFiles.length} {filteredFiles.length === 1 ? 'style' : 'styles'} found
                    {searchTerm && ` for "${searchTerm}"`}
                </div>
            )}

            {/* Search Section */}
            {files.length > 0 && (
                <div style={styles.searchSection}>
                    <input
                        type="text"
                        placeholder="Search styles by title, filename, or uploader..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                        style={styles.searchInput}
                    />
                </div>
            )}

            {/* Files Grid */}
            <div style={styles.filesGrid}>
                {filteredFiles.length === 0 && files.length > 0 ? (
                    <div style={styles.noFiles}>
                        <h3 style={{ color: '#FFD700', marginBottom: '15px' }}>
                            {searchTerm ? 'No styles found' : 'No styles available'}
                        </h3>
                        <p>
                            {searchTerm
                                ? `No styles match "${searchTerm}". Try a different search term.`
                                : 'Be the first to upload style files to the community!'
                            }
                        </p>
                    </div>
                ) : (
                    filteredFiles.map((file) => (
                        <div
                            key={file.id}
                            style={styles.fileCard}
                            onMouseEnter={handleCardHover}
                            onMouseLeave={handleCardLeave}
                        >
                            <div style={styles.fileHeader}>
                                <h3 style={styles.fileTitle}>
                                    {file.title || file.fileName || 'Untitled Style'}
                                </h3>
                                <span style={styles.fileCategory}>
                                    {file.category?.toUpperCase() || 'STYLE'}
                                </span>
                            </div>

                            <div style={styles.fileInfo}>
                                <p style={styles.fileInfoText}>
                                    <strong>File:</strong> {file.fileName || 'Unknown'}
                                </p>
                                <p style={styles.fileInfoText}>
                                    <strong>Size:</strong> {file.fileSize ? (file.fileSize / 1024 / 1024).toFixed(2) + ' MB' : 'Unknown'}
                                </p>
                                <p style={styles.fileInfoText}>
                                    <strong>Uploaded by:</strong> {file.userEmail || 'Unknown'}
                                </p>
                                <p style={styles.fileInfoText}>
                                    <strong>Date:</strong> {
                                        file.timestamp?.toDate?.().toLocaleDateString() ||
                                        file.createdAt?.toDate?.().toLocaleDateString() ||
                                        'Unknown date'
                                    }
                                </p>
                            </div>

                            {(file.downloadURL || file.url) && (
                                <a
                                    href={file.downloadURL || file.url}
                                    download
                                    style={styles.downloadBtn}
                                    onMouseEnter={handleButtonHover}
                                    onMouseLeave={handleButtonLeave}
                                >
                                    📥 DOWNLOAD STYLE
                                </a>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Styles;