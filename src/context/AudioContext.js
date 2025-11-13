import React, { createContext, useState, useContext, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, storage, db } from '../firebase/config';

const AudioContext = createContext();

export const useAudio = () => {
    return useContext(AudioContext);
};

export const AudioProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentAudio, setCurrentAudio] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [audioProgress, setAudioProgress] = useState(0);
    const [audioDuration, setAudioDuration] = useState(0);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const playAudio = (audioUrl) => {
        if (currentAudio) {
            currentAudio.pause();
        }

        const audio = new Audio(audioUrl);
        setCurrentAudio(audio);
        setIsPlaying(true);

        audio.play().catch(error => {
            console.error('Error playing audio:', error);
            setIsPlaying(false);
        });

        audio.addEventListener('timeupdate', () => {
            setAudioProgress((audio.currentTime / audio.duration) * 100);
        });

        audio.addEventListener('loadedmetadata', () => {
            setAudioDuration(audio.duration);
        });

        audio.addEventListener('ended', () => {
            setIsPlaying(false);
            setAudioProgress(0);
        });
    };

    const pauseAudio = () => {
        if (currentAudio) {
            currentAudio.pause();
            setIsPlaying(false);
        }
    };

    const resumeAudio = () => {
        if (currentAudio && !isPlaying) {
            currentAudio.play().then(() => {
                setIsPlaying(true);
            }).catch(error => {
                console.error('Error resuming audio:', error);
            });
        }
    };

    const stopAudio = () => {
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
            setIsPlaying(false);
            setAudioProgress(0);
        }
    };

    const seekAudio = (progress) => {
        if (currentAudio && audioDuration) {
            const newTime = (progress / 100) * audioDuration;
            currentAudio.currentTime = newTime;
            setAudioProgress(progress);
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            setUser(null);
            stopAudio();
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const value = {
        user,
        loading,
        logout,
        currentAudio,
        isPlaying,
        audioProgress,
        audioDuration,
        playAudio,
        pauseAudio,
        resumeAudio,
        stopAudio,
        seekAudio,
        auth,
        storage,
        db
    };

    return (
        <AudioContext.Provider value={value}>
            {!loading && children}
        </AudioContext.Provider>
    );
};