import React, { useState } from 'react';
import { useAudio } from '../context/AudioContext';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/config';

const Login = () => {
    const { login } = useAudio();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const styles = {
        authForm: {
            maxWidth: '450px',
            margin: '80px auto',
            padding: '40px',
            background: 'linear-gradient(145deg, #252525, #1e1e1e)',
            borderRadius: '20px',
            border: '1px solid #333',
            boxShadow: '0 15px 40px rgba(0, 0, 0, 0.5)',
            position: 'relative',
            overflow: 'hidden',
            animation: 'formSlideIn 0.6s ease-out'
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
            padding: '10px 0',
            transition: 'all 0.3s ease'
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
            position: 'relative',
            overflow: 'hidden'
        },
        buttonPrimary: {
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
            border: '2px solid #ff3333',
            boxShadow: '0 4px 15px rgba(255, 68, 68, 0.3)',
            animation: 'shake 0.5s ease-in-out'
        },
        authLink: {
            textAlign: 'center',
            marginTop: '25px',
            color: '#b0b0b0'
        },
        link: {
            color: '#FFD700',
            textDecoration: 'none',
            fontWeight: 700,
            transition: 'all 0.3s ease',
            borderBottom: '2px solid transparent'
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!formData.email || !formData.password) {
            setError('Please fill in all fields');
            setLoading(false);
            return;
        }

        try {
            const userCredential = await signInWithEmailAndPassword(
                auth,
                formData.email,
                formData.password
            );

            const user = userCredential.user;

            login({
                username: user.email.split('@')[0],
                email: user.email,
                uid: user.uid
            });

            alert('Login successful!');
            navigate('/');

        } catch (error) {
            console.error('Login error:', error);
            let errorMessage = 'Login failed. ';

            switch (error.code) {
                case 'auth/invalid-email':
                    errorMessage += 'Invalid email address.';
                    break;
                case 'auth/user-disabled':
                    errorMessage += 'This account has been disabled.';
                    break;
                case 'auth/user-not-found':
                    errorMessage += 'No account found with this email.';
                    break;
                case 'auth/wrong-password':
                    errorMessage += 'Incorrect password.';
                    break;
                case 'auth/too-many-requests':
                    errorMessage += 'Too many failed attempts. Try again later.';
                    break;
                default:
                    errorMessage += error.message;
            }

            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Dynamic styles for hover effects
    const getInputStyle = (isFocused = false) => ({
        ...styles.input,
        borderColor: isFocused ? '#FFD700' : '#444',
        background: isFocused ? '#3a3a3a' : '#333',
        boxShadow: isFocused ? '0 0 0 4px rgba(255, 215, 0, 0.2)' : 'none',
        transform: isFocused ? 'translateY(-2px)' : 'none'
    });

    const getButtonStyle = () => ({
        ...styles.button,
        ...styles.buttonPrimary,
        opacity: loading ? 0.6 : 1,
        cursor: loading ? 'not-allowed' : 'pointer'
    });

    const getTitleStyle = (isHovered = false) => ({
        ...styles.title,
        transform: isHovered ? 'scale(1.05)' : 'none',
        textShadow: isHovered ? '0 5px 15px rgba(255, 215, 0, 0.4)' : 'none'
    });

    const [isTitleHovered, setIsTitleHovered] = useState(false);
    const [emailFocused, setEmailFocused] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false);

    return (
        <div style={styles.authForm}>
            <div style={styles.authFormBefore}></div>
            <h2
                style={getTitleStyle(isTitleHovered)}
                onMouseEnter={() => setIsTitleHovered(true)}
                onMouseLeave={() => setIsTitleHovered(false)}
            >
                Login
            </h2>

            {error && <div style={styles.errorMessage}>{error}</div>}

            <form onSubmit={handleSubmit}>
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
                        placeholder="Enter your password"
                        minLength="6"
                    />
                </div>

                <button
                    type="submit"
                    style={getButtonStyle()}
                    disabled={loading}
                    onMouseEnter={(e) => {
                        if (!loading) {
                            e.target.style.transform = 'translateY(-3px)';
                            e.target.style.boxShadow = '0 10px 30px rgba(255, 215, 0, 0.6)';
                            e.target.style.borderRadius = '15px';
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (!loading) {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 6px 20px rgba(255, 215, 0, 0.4)';
                            e.target.style.borderRadius = '12px';
                        }
                    }}
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>

            <div style={styles.authLink}>
                <p>
                    Don't have an account?{' '}
                    <Link
                        to="/register"
                        style={styles.link}
                        onMouseEnter={(e) => {
                            e.target.style.color = '#FFA500';
                            e.target.style.borderBottom = '2px solid #FFA500';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.color = '#FFD700';
                            e.target.style.borderBottom = '2px solid transparent';
                        }}
                    >
                        Register here
                    </Link>
                </p>
            </div>

            <style>
                {`
          @keyframes formSlideIn {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
          }
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          @media (max-width: 768px) {
            .auth-form {
              margin: 40px 20px !important;
              padding: 30px 25px !important;
            }
            
            .auth-form h2 {
              font-size: 1.8rem !important;
            }
            
            .form-group input {
              padding: 14px 18px !important;
            }
            
            .btn {
              padding: 14px 18px !important;
              font-size: 1rem !important;
            }
          }
        `}
            </style>
        </div>
    );
};

export default Login;