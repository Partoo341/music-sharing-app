import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AudioProvider } from './context/AudioContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Styles from './pages/Styles';
import Voices from './pages/Voices';
import Multipads from './pages/Multipads';
import Midi from './pages/Midi';
import Audiobeats from './pages/Audiobeats';
import Upload from './pages/Upload';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import './App.css';

function App() {
    return (
        <AudioProvider>
            <Router>
                <div className="App">
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/styles" element={<Styles />} />
                        <Route path="/voices" element={<Voices />} />
                        <Route path="/multipads" element={<Multipads />} />
                        <Route path="/midi" element={<Midi />} />
                        <Route path="/audiobeats" element={<Audiobeats />} />
                        <Route path="/upload" element={<Upload />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/profile" element={<Profile />} />
                    </Routes>
                </div>
            </Router>
        </AudioProvider>
    );
}

export default App;