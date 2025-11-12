import React, { useState } from 'react';
import { useAudio } from '../context/AudioContext';
import { useNavigate } from 'react-router-dom';

const Upload = () => {
    const { user, addAudioItem } = useAudio();
    const navigate = useNavigate();
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

        const audioUrl = URL.createObjectURL(formData.audioFile);

        const newItem = {
            id: Date.now(),
            title: formData.title,
            type: formData.type,
            fileType: formData.fileType,
            description: formData.description,
            audioUrl: audioUrl,
            artist: user.username,
            downloads: 0,
            createdAt: new Date().toISOString(),
            fileExtension: formData.fileType
        };

        addAudioItem(newItem);

        setFormData({
            title: '',
            type: 'style',
            fileType: 'sff1',
            description: '',
            audioFile: null
        });

        alert('Upload successful!');
        navigate('/'); // Redirect to home page after upload
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
            <form onSubmit={handleSubmit} className="upload-form">
                <div className="form-group">
                    <label>Title:</label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        required
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
                    />
                </div>

                <div className="form-group">
                    <label>File:</label>
                    <input
                        type="file"
                        accept={fileTypeOptions[formData.type].map(ext => `.${ext}`).join(',')}
                        onChange={handleFileChange}
                        required
                    />
                    <small>Accepted: {fileTypeOptions[formData.type].map(ext => `.${ext}`).join(', ')}</small>
                </div>

                <button type="submit" className="btn btn-primary">Upload</button>
            </form>
        </div>
    );
};

export default Upload;