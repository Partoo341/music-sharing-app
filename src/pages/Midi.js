import React from 'react';
import { useAudio } from '../context/AudioContext';

const Midi = () => {
    const { audioItems } = useAudio();
    const midiFiles = audioItems.filter(item => item.type === 'midi');

    return (
        <div className="page">
            <h2>All MIDI Files</h2>
            <p>Download .mid and .midi files</p>
            <div className="audio-grid">
                {midiFiles.map(item => (
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

export default Midi;