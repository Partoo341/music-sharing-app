import React from 'react';
import { useAudio } from '../context/AudioContext';

const Multipads = () => {
    const { audioItems } = useAudio();
    const multipads = audioItems.filter(item => item.type === 'multipad');

    return (
        <div className="page">
            <h2>All Multipads</h2>
            <p>Download .pad multipad files</p>
            <div className="audio-grid">
                {multipads.map(item => (
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

export default Multipads;