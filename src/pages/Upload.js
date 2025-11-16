import React, { useState } from 'react';
import { storage, db, auth } from '../firebase/config';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const Upload = () => {
    const [file, setFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [category, setCategory] = useState('styles');
    const [title, setTitle] = useState('');
    const [uploading, setUploading] = useState(false);
    const [fileName, setFileName] = useState('');
    const [titleFocused, setTitleFocused] = useState(false);
    const [categoryFocused, setCategoryFocused] = useState(false);
    const [fileFocused, setFileFocused] = useState(false);

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

            // Upload the file first
            const snapshot = await new Promise((resolve, reject) => {
                uploadTask.on('state_changed',
                    (snapshot) => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        setUploadProgress(progress);
                    },
                    (error) => {
                        reject(error);
                    },
                    () => {
                        resolve(uploadTask.snapshot);
                    }
                );
            });

            console.log('Upload complete, getting download URL...');

            // Get download URL
            const downloadURL = await getDownloadURL(snapshot.ref);
            console.log('Download URL obtained:', downloadURL);

            // Save to Firestore
            console.log('Saving to Firestore...');
            await addDoc(collection(db, 'uploads'), {
                title: title,
                category: category,
                fileName: filename,
                fileSize: file.size,
                fileType: file.type,
                downloadURL: downloadURL,
                storagePath: storagePath,
                userId: user.uid,
                userEmail: user.email,
                timestamp: serverTimestamp()
            });
            console.log('Firestore save complete');

            // Success - reset form
            alert('File uploaded successfully!');
            setUploadProgress(0);
            setTitle('');
            setFile(null);
            setFileName('');
            setCategory('styles');

        } catch (error) {
            console.error('Upload error:', error);
            alert('Upload failed: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setFileName(selectedFile.name);
            // Auto-set title from filename if not already set
            if (!title) {
                const nameWithoutExtension = selectedFile.name.replace(/\.[^/.]+$/, "");
                setTitle(nameWithoutExtension);
            }
        }
    };

    // Styles - Black, White, Golden, Yellow Theme
    const styles = {
        // Container
        uploadContainer: {
            maxWidth: '500px',
            margin: '60px auto',
            padding: '40px',
            background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
            borderRadius: '20px',
            border: '2px solid #333',
            boxShadow: '0 15px 40px rgba(255, 215, 0, 0.1)',
            position: 'relative',
            overflow: 'hidden',
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
        },
        containerHeader: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '5px',
            background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
            boxShadow: '0 2px 10px rgba(255, 215, 0, 0.5)'
        },

        // Title
        uploadTitle: {
            textAlign: 'center',
            marginBottom: '35px',
            fontSize: '2.2rem',
            fontWeight: '800',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            padding: '10px 0',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
        },

        // Form Groups
        formGroup: {
            marginBottom: '25px',
            position: 'relative'
        },
        formLabel: {
            display: 'block',
            marginBottom: '10px',
            color: '#FFD700',
            fontWeight: '700',
            fontSize: '1rem',
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
        },

        // Inputs
        formInput: {
            width: '100%',
            padding: '16px 20px',
            background: '#2d2d2d',
            border: '2px solid #444',
            borderRadius: '12px',
            color: 'white',
            fontSize: '16px',
            fontWeight: '500',
            transition: 'all 0.3s ease',
            boxSizing: 'border-box',
            boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.3)'
        },
        formInputFocused: {
            borderColor: '#FFD700',
            background: '#333',
            boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.3), 0 0 0 4px rgba(255, 215, 0, 0.2)',
            transform: 'translateY(-2px)'
        },

        // Select
        formSelect: {
            width: '100%',
            padding: '16px 20px',
            background: '#2d2d2d',
            border: '2px solid #444',
            borderRadius: '12px',
            color: 'white',
            fontSize: '16px',
            fontWeight: '500',
            transition: 'all 0.3s ease',
            boxSizing: 'border-box',
            boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.3)',
            appearance: 'none',
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%23FFD700' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 20px center',
            backgroundSize: '12px'
        },
        formSelectFocused: {
            borderColor: '#FFD700',
            background: '#333',
            boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.3), 0 0 0 4px rgba(255, 215, 0, 0.2)',
            transform: 'translateY(-2px)'
        },

        // File Input
        fileInput: {
            width: '100%',
            padding: '16px 20px',
            background: '#2d2d2d',
            border: '2px solid #444',
            borderRadius: '12px',
            color: 'white',
            fontSize: '16px',
            transition: 'all 0.3s ease',
            boxSizing: 'border-box',
            boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.3)',
            cursor: 'pointer'
        },
        fileInputFocused: {
            borderColor: '#FFD700',
            background: '#333',
            boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.3), 0 0 0 4px rgba(255, 215, 0, 0.2)',
            transform: 'translateY(-2px)'
        },

        // File Name
        fileName: {
            marginTop: '10px',
            color: '#FFD700',
            fontSize: '14px',
            fontWeight: '600',
            textAlign: 'center',
            padding: '8px 12px',
            background: 'rgba(255, 215, 0, 0.1)',
            borderRadius: '6px',
            border: '1px solid rgba(255, 215, 0, 0.3)'
        },

        // Upload Button
        uploadButton: {
            width: '100%',
            padding: '18px 20px',
            border: 'none',
            borderRadius: '12px',
            fontSize: '1.1rem',
            fontWeight: '800',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            cursor: 'pointer',
            transition: 'all 0.4s ease',
            background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%)',
            color: '#000',
            boxShadow: '0 6px 20px rgba(255, 215, 0, 0.4), 0 2px 4px rgba(0, 0, 0, 0.3)',
            position: 'relative',
            overflow: 'hidden'
        },
        uploadButtonHover: {
            transform: 'translateY(-3px)',
            boxShadow: '0 10px 30px rgba(255, 215, 0, 0.6), 0 4px 8px rgba(0, 0, 0, 0.4)',
            background: 'linear-gradient(135deg, #FFE135 0%, #FFB347 50%, #FFA500 100%)'
        },
        uploadButtonDisabled: {
            opacity: 0.6,
            cursor: 'not-allowed',
            transform: 'none',
            boxShadow: '0 2px 8px rgba(255, 215, 0, 0.2)'
        },

        // Progress Bar
        progressContainer: {
            marginTop: '25px',
            animation: 'fadeIn 0.5s ease'
        },
        progressBar: {
            width: '100%',
            height: '20px',
            background: '#2d2d2d',
            borderRadius: '10px',
            overflow: 'hidden',
            border: '2px solid #555',
            boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.3)',
            position: 'relative'
        },
        progressFill: {
            height: '100%',
            background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%)',
            borderRadius: '8px',
            transition: 'width 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#000',
            fontWeight: 'bold',
            fontSize: '12px',
            textShadow: '0 1px 1px rgba(255, 255, 255, 0.5)',
            boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.3), 0 2px 4px rgba(255, 140, 0, 0.4)',
            position: 'relative',
            overflow: 'hidden'
        }
    };

    // Hover handlers
    const handleInputHover = (e, isFocused) => {
        if (!uploading) {
            e.target.style.borderColor = isFocused ? '#FFD700' : '#555';
            e.target.style.background = isFocused ? '#333' : '#2d2d2d';
            if (isFocused) {
                e.target.style.boxShadow = 'inset 0 2px 4px rgba(0, 0, 0, 0.3), 0 0 0 4px rgba(255, 215, 0, 0.2)';
                e.target.style.transform = 'translateY(-2px)';
            }
        }
    };

    const handleInputLeave = (e, isFocused) => {
        if (!uploading) {
            e.target.style.borderColor = isFocused ? '#FFD700' : '#444';
            e.target.style.background = isFocused ? '#333' : '#2d2d2d';
            if (!isFocused) {
                e.target.style.boxShadow = 'inset 0 2px 4px rgba(0, 0, 0, 0.3)';
                e.target.style.transform = 'translateY(0)';
            }
        }
    };

    const handleButtonHover = (e) => {
        if (!uploading && file && title) {
            e.target.style.transform = 'translateY(-3px)';
            e.target.style.boxShadow = '0 10px 30px rgba(255, 215, 0, 0.6), 0 4px 8px rgba(0, 0, 0, 0.4)';
            e.target.style.background = 'linear-gradient(135deg, #FFE135 0%, #FFB347 50%, #FFA500 100%)';
        }
    };

    const handleButtonLeave = (e) => {
        if (!uploading && file && title) {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 6px 20px rgba(255, 215, 0, 0.4), 0 2px 4px rgba(0, 0, 0, 0.3)';
            e.target.style.background = 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%)';
        }
    };

    return (
        <div style={styles.uploadContainer}>
            <div style={styles.containerHeader}></div>
            <h2 style={styles.uploadTitle}>Upload File</h2>

            <div style={styles.formGroup}>
                <label style={styles.formLabel}>File Title:</label>
                <input
                    type="text"
                    placeholder="Enter file title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onFocus={() => setTitleFocused(true)}
                    onBlur={() => setTitleFocused(false)}
                    onMouseEnter={(e) => handleInputHover(e, titleFocused)}
                    onMouseLeave={(e) => handleInputLeave(e, titleFocused)}
                    style={{
                        ...styles.formInput,
                        ...(titleFocused ? styles.formInputFocused : {})
                    }}
                    disabled={uploading}
                />
            </div>

            <div style={styles.formGroup}>
                <label style={styles.formLabel}>Category:</label>
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    onFocus={() => setCategoryFocused(true)}
                    onBlur={() => setCategoryFocused(false)}
                    onMouseEnter={(e) => handleInputHover(e, categoryFocused)}
                    onMouseLeave={(e) => handleInputLeave(e, categoryFocused)}
                    style={{
                        ...styles.formSelect,
                        ...(categoryFocused ? styles.formSelectFocused : {})
                    }}
                    disabled={uploading}
                >
                    <option value="styles">Styles</option>
                    <option value="voices">Voices</option>
                    <option value="multipads">Multipads</option>
                    <option value="midifiles">MIDI Files</option>
                    <option value="audiobeats">Audio Beats</option>
                </select>
            </div>

            <div style={styles.formGroup}>
                <label style={styles.formLabel}>Select File:</label>
                <input
                    type="file"
                    onChange={handleFileChange}
                    onFocus={() => setFileFocused(true)}
                    onBlur={() => setFileFocused(false)}
                    onMouseEnter={(e) => handleInputHover(e, fileFocused)}
                    onMouseLeave={(e) => handleInputLeave(e, fileFocused)}
                    style={{
                        ...styles.fileInput,
                        ...(fileFocused ? styles.fileInputFocused : {})
                    }}
                    disabled={uploading}
                    accept=".sty,.sff1,.sff2,.vce,.pad,.mid,.midi,.wav,.mp3"
                />
                {fileName && <div style={styles.fileName}>Selected: {fileName}</div>}
            </div>

            <button
                onClick={handleUpload}
                onMouseEnter={handleButtonHover}
                onMouseLeave={handleButtonLeave}
                style={{
                    ...styles.uploadButton,
                    ...(uploading || !file || !title ? styles.uploadButtonDisabled : {})
                }}
                disabled={uploading || !file || !title}
            >
                {uploading ? `Uploading... ${Math.round(uploadProgress)}%` : 'Upload File'}
            </button>

            {uploadProgress > 0 && (
                <div style={styles.progressContainer}>
                    <div style={styles.progressBar}>
                        <div
                            style={{
                                ...styles.progressFill,
                                width: `${uploadProgress}%`
                            }}
                        >
                            {Math.round(uploadProgress)}%
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Upload;