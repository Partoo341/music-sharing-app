import React, { createContext, useContext, useState, useEffect } from 'react';

const AudioContext = createContext();

export const useAudio = () => {
    const context = useContext(AudioContext);
    if (!context) {
        throw new Error('useAudio must be used within an AudioProvider');
    }
    return context;
};

export const AudioProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [audioItems, setAudioItems] = useState([]);
    const [currentPlaying, setCurrentPlaying] = useState(null);

    useEffect(() => {
        // Check if user is logged in
        const savedUser = localStorage.getItem('musicUser');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('musicUser', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('musicUser');
    };

    const addAudioItem = (item) => {
        setAudioItems(prev => [...prev, item]);
    };

    const value = {
        user,
        login,
        logout,
        audioItems,
        addAudioItem,
        currentPlaying,
        setCurrentPlaying
    };

    return (
        <AudioContext.Provider value={value}>
            {children}
        </AudioContext.Provider>
    );
};