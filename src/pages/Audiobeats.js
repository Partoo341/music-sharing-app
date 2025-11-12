import React from 'react';
import { useAudio } from '../context/AudioContext';

const Audiobeats = () => {
    const { audioItems } = useAudio();
    const audioBeats = audioItems.filter(item => item.type === 'audio');

    return (
        <div className="page">
            <h2>All Audio Beats</h2>
            <p>Download .wav and .mp3 audio files</p>
            <div className="audio-grid">
                {audioBeats.map(item => (
                    <div key={item.id} className="audio-card">
                        <h4>{item.title}</h4>
                        <p>By {item.artist}</p>
                        <p className="file-type">.{item.fileType}</p>
                        <audio controls className="audio-player">
                            <source src={item.audioUrl} type={`audio/${item.fileType}`} />
                            Your browser does not support the audio element.
                        </audio>
                        <a href={item.audioUrl} download className="download-btn">
                            Download .{item.fileType}
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Audiobeats;