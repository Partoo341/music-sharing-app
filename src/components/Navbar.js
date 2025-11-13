import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useAudio } from '../context/AudioContext';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useAudio();

    return (
        <nav className="navbar">
            <div className="nav-container">
                <Link to="/" className="nav-logo">
                    <img
                        src="/logo.png"
                        alt="Lenskings Productions"
                        className="logo-image"
                    />
                    <div className="logo-text">
                        <span className="logo-main">LENSKINGS</span>
                        <span className="logo-sub">PRODUCTIONS</span>
                    </div>
                </Link>
                <div className="nav-menu">
                    <Link to="/" className="nav-link">Home</Link>
                    <Link to="/styles" className="nav-link">Styles</Link>
                    <Link to="/voices" className="nav-link">Voices</Link>
                    <Link to="/multipads" className="nav-link">Multipads</Link>
                    <Link to="/midi" className="nav-link">MIDI</Link>
                    <Link to="/audiobeats" className="nav-link">Audio Beats</Link>
                    {user ? (
                        <>
                            <Link to="/upload" className="nav-link">Upload</Link>
                            <Link to="/profile" className="nav-link">Profile</Link>
                            <button onClick={logout} className="nav-link logout-btn">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="nav-link">Login</Link>
                            <Link to="/register" className="nav-link">Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;