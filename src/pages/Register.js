import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/config';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const styles = {
        authForm: {
            maxWidth: '450px',
            margin: '60px auto',
            padding: '40px',
            background: 'linear-gradient(145deg, #252525, #1e1e1e)',
            borderRadius: '20px',
            border: '1px solid #333',
            boxShadow: '0 15px 40px rgba(0, 0, 0, 0.5)',
            position: 'relative',
            overflow: 'hidden'
        },
        authFormBefore: {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '5px',
            background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)'
        },
        title: {
            textAlign: 'center',
            marginBottom: '35px',
            fontSize: '2.2rem',
            fontWeight: 800,
            letterSpacing: '2px',
            textTransform: 'uppercase',
            background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            padding: '10px 0'
        },
        formGroup: {
            marginBottom: '25px'
        },
        label: {
            display: 'block',
            marginBottom: '10px',
            color: '#FFD700',
            fontWeight: 700,
            fontSize: '1rem',
            letterSpacing: '0.5px',
            textTransform: 'uppercase'
        },
        input: {
            width: '100%',
            padding: '16px 20px',
            background: '#333',
            border: '2px solid #444',
            borderRadius: '12px',
            color: '#e0e0e0',
            fontSize: '16px',
            fontWeight: 500,
            transition: 'all 0.3s ease',
            boxSizing: 'border-box'
        },
        button: {
            width: '100%',
            padding: '16px 20px',
            border: 'none',
            borderRadius: '12px',
            fontSize: '1.1rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '1px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
            color: '#000',
            boxShadow: '0 6px 20px rgba(255, 215, 0, 0.4)'
        },
        errorMessage: {
            background: 'linear-gradient(135deg, #ff4444, #ff6666)',
            color: '#fff',
            padding: '15px 20px',
            borderRadius: '12px',
            marginBottom: '25px',
            fontWeight: 600,
            textAlign: 'center',
            border: '2px solid #ff3333'
        },
        authLink: {
            textAlign: 'center',
            marginTop: '25px',
            color: '#b0b0b0'
        },
        link: {
            color: '#FFD700',
            textDecoration: 'none',
            fontWeight: 700
        },
        loadingSpinner: {
            display: 'inline-block',
            width: '20px',
            height: '20px',
            border: '2px solid transparent',
            borderTop: '2px solid #000',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginRight: '10px'
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!formData.username || !formData.email || !formData.password) {
            setError('Please fill in all fields');
            setLoading(false);
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            setLoading(false);
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                formData.email,
                formData.password
            );

            alert('Registration successful!');
            navigate('/');

        } catch (error) {
            console.error('Registration error:', error);
            let errorMessage = 'Registration failed. ';

            switch (error.code) {
                case 'auth/email-already-in-use':
                    errorMessage += 'This email is already registered.';
                    break;
                case 'auth/invalid-email':
                    errorMessage += 'Invalid email address.';
                    break;
                case 'auth/operation-not-allowed':
                    errorMessage += 'Email/password accounts are not enabled.';
                    break;
                case 'auth/weak-password':
                    errorMessage += 'Password is too weak.';
                    break;
                default:
                    errorMessage += error.message;
            }

            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Dynamic styles
    const getInputStyle = (isFocused = false) => ({
        ...styles.input,
        borderColor: isFocused ? '#FFD700' : '#444',
        background: isFocused ? '#3a3a3a' : '#333',
        boxShadow: isFocused ? '0 0 0 4px rgba(255, 215, 0, 0.2)' : 'none'
    });

    const getButtonStyle = () => ({
        ...styles.button,
        opacity: loading ? 0.6 : 1,
        cursor: loading ? 'not-allowed' : 'pointer'
    });

    const [usernameFocused, setUsernameFocused] = useState(false);
    const [emailFocused, setEmailFocused] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false);
    const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);

    return (
        <div style={styles.authForm}>
            <div style={styles.authFormBefore}></div>
            <h2 style={styles.title}>Register</h2>

            {error && <div style={styles.errorMessage}>{error}</div>}

            <form onSubmit={handleSubmit}>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Username:</label>
                    <input
                        type="text"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        onFocus={() => setUsernameFocused(true)}
                        onBlur={() => setUsernameFocused(false)}
                        style={getInputStyle(usernameFocused)}
                        required
                        disabled={loading}
                        placeholder="Choose a username"
                    />
                </div>

                <div style={styles.formGroup}>
                    <label style={styles.label}>Email:</label>
                    <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        onFocus={() => setEmailFocused(true)}
                        onBlur={() => setEmailFocused(false)}
                        style={getInputStyle(emailFocused)}
                        required
                        disabled={loading}
                        placeholder="your@email.com"
                    />
                </div>

                <div style={styles.formGroup}>
                    <label style={styles.label}>Password:</label>
                    <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        onFocus={() => setPasswordFocused(true)}
                        onBlur={() => setPasswordFocused(false)}
                        style={getInputStyle(passwordFocused)}
                        required
                        disabled={loading}
                        placeholder="At least 6 characters"
                        minLength="6"
                    />
                </div>

                <div style={styles.formGroup}>
                    <label style={styles.label}>Confirm Password:</label>
                    <input
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        onFocus={() => setConfirmPasswordFocused(true)}
                        onBlur={() => setConfirmPasswordFocused(false)}
                        style={getInputStyle(confirmPasswordFocused)}
                        required
                        disabled={loading}
                        placeholder="Confirm your password"
                        minLength="6"
                    />
                </div>

                <button
                    type="submit"
                    style={getButtonStyle()}
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <span style={styles.loadingSpinner}></span>
                            Creating Account...
                        </>
                    ) : (
                        'Create Account'
                    )}
                </button>
            </form>

            <div style={styles.authLink}>
                <p>
                    Already have an account?{' '}
                    <Link to="/login" style={styles.link}>
                        Login here
                    </Link>
                </p>
            </div>

            <style>
                {`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}
            </style>
        </div>
    );
};

export default Register;