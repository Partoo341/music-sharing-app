import React, { useState } from 'react';
import { storage, db, auth } from '../firebase/config';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';

const Upload = () => {
    const [file, setFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [category, setCategory] = useState('styles');
    const [title, setTitle] = useState('');
    const [uploading, setUploading] = useState(false);
    const [fileName, setFileName] = useState('');

    const styles = {
        uploadContainer: {
            maxWidth: '500px',
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
        formGroup: {
            marginBottom: '25px'
        },
        label: {
            display: 'block',
            marginBottom: '10px',
            color: '#FFD700',
            fontWeight: 700,
            fontSize: '1rem',
            letterSpacing: '0.5px',
            textTransform: 'uppercase'
        },
        input: {
            width: '100%',
            padding: '16px 20px',
            background: '#333',
            border: '2px solid #444',
            borderRadius: '12px',
            color: '#e0e0e0',
            fontSize: '16px',
            fontWeight: 500,
            transition: 'all 0.3s ease',
            boxSizing: 'border-box'
        },
        select: {
            width: '100%',
            padding: '16px 20px',
            background: '#333',
            border: '2px solid #444',
            borderRadius: '12px',
            color: '#e0e0e0',
            fontSize: '16px',
            fontWeight: 500,
            transition: 'all 0.3s ease',
            boxSizing: 'border-box'
        },
        fileInput: {
            width: '100%',
            padding: '16px 20px',
            background: '#333',
            border: '2px solid #444',
            borderRadius: '12px',
            color: '#e0e0e0',
            fontSize: '16px',
            transition: 'all 0.3s ease',
            boxSizing: 'border-box'
        },
        button: {
            width: '100%',
            padding: '16px 20px',
            border: 'none',
            borderRadius: '12px',
            fontSize: '1.1rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '1px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
            color: '#000',
            boxShadow: '0 6px 20px rgba(255, 215, 0, 0.4)',
            marginTop: '20px'
        },
        progressBar: {
            width: '100%',
            height: '20px',
            backgroundColor: '#333',
            borderRadius: '10px',
            marginTop: '20px',
            overflow: 'hidden',
            border: '2px solid #444'
        },
        progress: {
            height: '100%',
            background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
            borderRadius: '8px',
            transition: 'width 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#000',
            fontWeight: 'bold',
            fontSize: '12px'
        },
        fileName: {
            marginTop: '10px',
            color: '#FFD700',
            fontSize: '14px',
            fontWeight: '600',
            textAlign: 'center'
        }
    };

    const handleUpload = async () => {
        if (!file || !title) {
            alert('Please select a file and enter a title');
            return;
        }

        const user = auth.currentUser;
        if (!user) {
            alert('Please log in to upload files');
            return;
        }

        setUploading(true);
        setUploadProgress(0);

        try {
            const fileExtension = file.name.split('.').pop();
            const filename = `${title.replace(/\s+/g, '-')}.${fileExtension}`;
            const storagePath = `uploads/${category}/${user.uid}/${filename}`;

            const storageRef = ref(storage, storagePath);
            const uploadTask = uploadBytesResumable(storageRef, file);

            // Use promise for better error handling
            await new Promise((resolve, reject) => {
                uploadTask.on('state_changed',
                    (snapshot) => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        setUploadProgress(progress);
                    },
                    (error) => {
                        reject(error);
                    },
                    async () => {
                        try {
                            console.log('Upload complete, getting download URL...');
                            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                            console.log('Download URL obtained');

                            console.log('Saving to Firestore...');
                            await addDoc(collection(db, 'files'), {
                                title: title,
                                category: category,
                                filename: filename,
                                url: downloadURL,
                                userId: user.uid,
                                createdAt: new Date(),
                                size: file.size,
                                type: file.type
                            });
                            console.log('Firestore save complete');

                            resolve();
                        } catch (error) {
                            reject(error);
                        }
                    }
                );
            });

            // Success - reset form
            alert('File uploaded successfully!');
            setUploadProgress(0);
            setTitle('');
            setFile(null);
            setFileName('');

        } catch (error) {
            console.error('Upload error:', error);
            alert('Upload failed: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        setFileName(selectedFile ? selectedFile.name : '');
    };

    // Dynamic styles for hover effects
    const getInputStyle = (isFocused = false) => ({
        ...styles.input,
        borderColor: isFocused ? '#FFD700' : '#444',
        background: isFocused ? '#3a3a3a' : '#333',
        boxShadow: isFocused ? '0 0 0 4px rgba(255, 215, 0, 0.2)' : 'none'
    });

    const getSelectStyle = (isFocused = false) => ({
        ...styles.select,
        borderColor: isFocused ? '#FFD700' : '#444',
        background: isFocused ? '#3a3a3a' : '#333',
        boxShadow: isFocused ? '0 0 0 4px rgba(255, 215, 0, 0.2)' : 'none'
    });

    const getFileInputStyle = (isFocused = false) => ({
        ...styles.fileInput,
        borderColor: isFocused ? '#FFD700' : '#444',
        background: isFocused ? '#3a3a3a' : '#333',
        boxShadow: isFocused ? '0 0 0 4px rgba(255, 215, 0, 0.2)' : 'none'
    });

    const getButtonStyle = () => ({
        ...styles.button,
        opacity: (uploading || !file || !title) ? 0.6 : 1,
        cursor: (uploading || !file || !title) ? 'not-allowed' : 'pointer'
    });

    const [titleFocused, setTitleFocused] = useState(false);
    const [categoryFocused, setCategoryFocused] = useState(false);
    const [fileFocused, setFileFocused] = useState(false);

    return (
        <div style={styles.uploadContainer}>
            <div style={styles.containerBefore}></div>
            <h2 style={styles.title}>Upload File</h2>

            <div style={styles.formGroup}>
                <label style={styles.label}>File Title:</label>
                <input
                    type="text"
                    placeholder="Enter file title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onFocus={() => setTitleFocused(true)}
                    onBlur={() => setTitleFocused(false)}
                    style={getInputStyle(titleFocused)}
                    disabled={uploading}
                />
            </div>

            <div style={styles.formGroup}>
                <label style={styles.label}>Category:</label>
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    onFocus={() => setCategoryFocused(true)}
                    onBlur={() => setCategoryFocused(false)}
                    style={getSelectStyle(categoryFocused)}
                    disabled={uploading}
                >
                    <option value="styles">Styles</option>
                    <option value="Multipads">Multipads</option>
                    <option value="midifiles">Midifiles</option>
                    <option value="audiobeats">Audiobeats</option>
                    <option value="voices">Voices</option>
                </select>
            </div>

            <div style={styles.formGroup}>
                <label style={styles.label}>Select File:</label>
                <input
                    type="file"
                    onChange={handleFileChange}
                    onFocus={() => setFileFocused(true)}
                    onBlur={() => setFileFocused(false)}
                    style={getFileInputStyle(fileFocused)}
                    disabled={uploading}
                />
                {fileName && <div style={styles.fileName}>Selected: {fileName}</div>}
            </div>

            <button
                onClick={handleUpload}
                style={getButtonStyle()}
                disabled={uploading || !file || !title}
                onMouseEnter={(e) => {
                    if (!uploading && file && title) {
                        e.target.style.transform = 'translateY(-3px)';
                        e.target.style.boxShadow = '0 10px 30px rgba(255, 215, 0, 0.6)';
                    }
                }}
                onMouseLeave={(e) => {
                    if (!uploading && file && title) {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 6px 20px rgba(255, 215, 0, 0.4)';
                    }
                }}
            >
                {uploading ? `Uploading... ${Math.round(uploadProgress)}%` : 'Upload File'}
            </button>

            {uploadProgress > 0 && (
                <div style={styles.progressBar}>
                    <div
                        style={{
                            ...styles.progress,
                            width: `${uploadProgress}%`
                        }}
                    >
                        {Math.round(uploadProgress)}%
                    </div>
                </div>
            )}
        </div>
    );
};

export default Upload;