import React from 'react';
import { useAudio } from '../context/AudioContext';

const Voices = () => {
    const { audioItems } = useAudio();
    const voices = audioItems.filter(item => item.type === 'voice');

    return (
        <div className="page">
            <h2>All Voices</h2>
            <p>Download .vce voice files</p>
            <div className="audio-grid">
                {voices.map(item => (
                    <div key={item.id} className="audio-card">
                        <h4>{item.title}</h4>
                        <p>By {item.artist}</p>
                        <p className="file-type">.{item.fileType}</p>
                        <a href={item.audioUrl} download className="download-btn">
                            Download .{item.fileType}
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Voices;