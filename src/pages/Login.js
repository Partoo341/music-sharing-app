import React, { useState } from 'react';
import { useAudio } from '../context/AudioContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const { login } = useAudio();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simple login - in real app, verify with backend
        login({ username: formData.email.split('@')[0], email: formData.email });
        alert('Login successful!');
        navigate('/'); // Redirect to home page after login
    };

    return (
        <div className="auth-form">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Password:</label>
                    <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Login</button>
            </form>
        </div>
    );
};

export default Login;