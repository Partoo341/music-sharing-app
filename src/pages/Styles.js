import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';

const Styles = () => {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchStyles();
    }, []);

    const fetchStyles = async () => {
        try {
            const q = query(
                collection(db, 'uploads'),
                where('category', '==', 'styles'),
                orderBy('timestamp', 'desc')
            );
            const querySnapshot = await getDocs(q);
            const filesData = [];
            querySnapshot.forEach((doc) => {
                filesData.push({ id: doc.id, ...doc.data() });
            });
            setFiles(filesData);
        } catch (error) {
            console.error('Error fetching styles:', error);
            setFiles([]);
        } finally {
            setLoading(false);
        }
    };

    const filteredFiles = (files || []).filter(file => {
        return file.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            file.userEmail?.toLowerCase().includes(searchTerm.toLowerCase());
    });

    if (loading) {
        return (
            <div className="category-container">
                <div className="loading">Loading styles...</div>
            </div>
        );
    }

    return (
        <div className="category-container">
            <h1>Styles</h1>

            <div className="search-section">
                <input
                    type="text"
                    placeholder="Search styles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
            </div>

            <div className="files-grid">
                {filteredFiles.length === 0 ? (
                    <div className="no-files">
                        {searchTerm ? 'No styles match your search.' : 'No styles available yet.'}
                    </div>
                ) : (
                    filteredFiles.map((file) => (
                        <div key={file.id} className="file-card">
                            <div className="file-header">
                                <h3>{file.title || 'Untitled'}</h3>
                                <span className="file-category">{file.category}</span>
                            </div>

                            <div className="file-info">
                                <p><strong>Uploaded by:</strong> {file.userEmail}</p>
                                <p><strong>Size:</strong> {file.fileSize ? (file.fileSize / 1024 / 1024).toFixed(2) + ' MB' : 'Unknown'}</p>
                                <p><strong>Date:</strong> {file.timestamp?.toDate?.().toLocaleDateString() || 'Unknown date'}</p>
                            </div>

                            {file.downloadURL && (
                                <a
                                    href={file.downloadURL}
                                    download
                                    className="download-btn"
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

export default Styles;