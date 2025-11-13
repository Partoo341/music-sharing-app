import React, { useState } from 'react';
import { storage, db, auth } from '../firebase/config';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import './upload.css';

const Upload = () => {
    const [file, setFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [category, setCategory] = useState('styles');
    const [title, setTitle] = useState('');

    const handleUpload = async () => {
        if (!file || !title) return;

        const user = auth.currentUser;
        if (!user) {
            alert('Please log in to upload files');
            return;
        }

        const fileExtension = file.name.split('.').pop();
        const fileName = `${title.replace(/\s+/g, '_')}.${fileExtension}`;
        const storagePath = `uploads/${category}/${user.uid}/${fileName}`;

        const storageRef = ref(storage, storagePath);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setUploadProgress(progress);
            },
            (error) => {
                console.error('Upload failed:', error);
                alert(`Upload failed: ${error.message}`);
            },
            async () => {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

                await addDoc(collection(db, 'uploads'), {
                    title: title,
                    category: category,
                    fileName: file.name,
                    fileSize: file.size,
                    fileType: file.type,
                    downloadURL: downloadURL,
                    storagePath: storagePath,
                    userId: user.uid,
                    userEmail: user.email,
                    timestamp: new Date(),
                    likes: 0,
                    downloads: 0
                });

                setUploadProgress(100);
                alert('File uploaded successfully!');

                setFile(null);
                setTitle('');
                setUploadProgress(0);
            }
        );
    };

    const getAcceptedFileTypes = () => {
        switch (category) {
            case 'styles':
                return '.sff1,.sff2,.sty';
            case 'voices':
                return '.vce,.uvn,.lib';
            case 'multipads':
                return '.mpd,.pad';
            case 'midi':
                return '.mid,.midi';
            case 'audio-beats':
                return '.wav,.mp3,.aiff';
            default:
                return '*';
        }
    };

    return (
        <div className="upload-container">
            <h2>Upload File</h2>

            <div className="form-group">
                <label>Category:</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="styles">Styles (.sff1, .sff2, .sty)</option>
                    <option value="voices">Voices</option>
                    <option value="multipads">Multipads</option>
                    <option value="midi">MIDI</option>
                    <option value="audio-beats">Audio Beats</option>
                </select>
            </div>

            <div className="form-group">
                <label>Title:</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter file title"
                />
            </div>

            <div className="form-group">
                <label>File:</label>
                <input
                    type="file"
                    accept={getAcceptedFileTypes()}
                    onChange={(e) => setFile(e.target.files[0])}
                />
                <small>Accepted types: {getAcceptedFileTypes()}</small>
            </div>

            <button onClick={handleUpload} disabled={!file || !title}>
                Upload File
            </button>

            {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="progress-bar">
                    <div
                        className="progress"
                        style={{ width: `${uploadProgress}%` }}
                    >
                        {Math.round(uploadProgress)}%
                    </div>
                </div>
            )}
        </div>
    );
};

export default Upload;