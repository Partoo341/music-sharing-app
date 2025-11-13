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
    const [uploading, setUploading] = useState(false);

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

        try {
            const fileExtension = file.name.split('.').pop();
            const filename = `${title.replace(/\s+/g, '-')}.${fileExtension}`;
            const storagePath = `uploads/${category}/${user.uid}/${filename}`;

            const storageRef = ref(storage, storagePath);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setUploadProgress(progress);
                },
                (error) => {
                    console.error('Upload failed:', error);
                    alert('Upload failed: ' + error.message);
                    setUploading(false);
                },
                async () => {
                    try {
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

                        // Save file metadata to Firestore
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

                        alert('File uploaded successfully!');
                        setUploadProgress(0);
                        setTitle('');
                        setFile(null);
                    } catch (error) {
                        console.error('Error saving metadata:', error);
                        alert('Error saving file metadata');
                    } finally {
                        setUploading(false);
                    }
                }
            );
        } catch (error) {
            console.error('Error starting upload:', error);
            alert('Error starting upload: ' + error.message);
            setUploading(false);
        }
    };

    return (
        <div className="upload-container">
            <h2>Upload File</h2>
            <input
                type="text"
                placeholder="File title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={uploading}
            />
            <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={uploading}
            >
                <option value="styles">Styles</option>
                <option value="documents">Documents</option>
                <option value="images">Images</option>
            </select>
            <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                disabled={uploading}
            />
            <button
                onClick={handleUpload}
                disabled={uploading || !file || !title}
            >
                {uploading ? 'Uploading...' : 'Upload'}
            </button>
            {uploadProgress > 0 && (
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