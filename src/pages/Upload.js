import React, { useState } from 'react';
import { useAudio } from '../context/AudioContext';
import { useNavigate } from 'react-router-dom';
import { storage, db } from '../firebase/config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const Upload = () => {
    const { user } = useAudio();
    const navigate = useNavigate();
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        type: 'style',
        fileType: 'sff1',
        description: '',
        audioFile: null
    });

    const fileTypeOptions = {
        style: ['sff1', 'sff2', 'sty'],
        voice: ['vce'],
        multipad: ['pad'],
        midi: ['mid', 'midi'],
        audio: ['wav', 'mp3']
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            alert('Please login to upload');
            return;
        }

        if (!formData.audioFile) {
            alert('Please select a file');
            return;
        }

        setUploading(true);

        try {
            // Upload file to Firebase Storage
            const fileRef = ref(storage, `audio/${Date.now()}_${formData.audioFile.name}`);
            const uploadResult = await uploadBytes(fileRef, formData.audioFile);
            const downloadURL = await getDownloadURL(uploadResult.ref);

            // Save file info to Firestore
            const audioData = {
                title: formData.title,
                type: formData.type,
                fileType: formData.fileType,
                description: formData.description,
                audioUrl: downloadURL,
                artist: user.username,
                artistEmail: user.email,
                downloads: 0,
                createdAt: serverTimestamp(),
                fileSize: formData.audioFile.size,
                fileName: formData.audioFile.name
            };

            await addDoc(collection(db, 'audioFiles'), audioData);

            alert('Upload successful! File is now permanently stored.');
            navigate('/');

        } catch (error) {
            console.error('Upload error:', error);
            alert('Upload failed: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleFileChange = (e) => {
        setFormData(prev => ({
            ...prev,
            audioFile: e.target.files[0]
        }));
    };

    return (
        <div className="upload">
            <h2>Upload Your File</h2>
            <p>Files are now stored permanently in the cloud!</p>
            <form onSubmit={handleSubmit} className="upload-form">
                <div className="form-group">
                    <label>Title:</label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        required
                        disabled={uploading}
                    />
                </div>

                <div className="form-group">
                    <label>Category:</label>
                    <select
                        value={formData.type}
                        onChange={(e) => setFormData(prev => ({
                            ...prev,
                            type: e.target.value,
                            fileType: fileTypeOptions[e.target.value][0]
                        }))}
                        disabled={uploading}
                    >
                        <option value="style">Styles (.sff1, .sff2, .sty)</option>
                        <option value="voice">Voices (.vce)</option>
                        <option value="multipad">Multipads (.pad)</option>
                        <option value="midi">MIDI Files (.mid, .midi)</option>
                        <option value="audio">Audio Beats (.wav, .mp3)</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>File Type:</label>
                    <select
                        value={formData.fileType}
                        onChange={(e) => setFormData(prev => ({ ...prev, fileType: e.target.value }))}
                        disabled={uploading}
                    >
                        {fileTypeOptions[formData.type].map(option => (
                            <option key={option} value={option}>.{option}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Description:</label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        rows="4"
                        disabled={uploading}
                    />
                </div>

                <div className="form-group">
                    <label>File:</label>
                    <input
                        type="file"
                        accept={fileTypeOptions[formData.type].map(ext => `.${ext}`).join(',')}
                        onChange={handleFileChange}
                        required
                        disabled={uploading}
                    />
                    <small>Accepted: {fileTypeOptions[formData.type].map(ext => `.${ext}`).join(', ')}</small>
                </div>

                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={uploading}
                >
                    {uploading ? 'Uploading...' : 'Upload to Cloud'}
                </button>
            </form>
        </div>
    );
};

export default Upload;