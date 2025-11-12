import React from 'react';
import { useAudio } from '../context/AudioContext';

const Styles = () => {
    const { audioItems } = useAudio();
    const styles = audioItems.filter(item => item.type === 'style');

    return (
        <div className="page">
            <h2>All Styles</h2>
            <p>Download .sff1, .sff2, and .sty files for your keyboard</p>
            <div className="audio-grid">
                {styles.map(item => (
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

export default Styles;