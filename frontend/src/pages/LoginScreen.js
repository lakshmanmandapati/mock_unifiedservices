// frontend/src/pages/LoginScreen.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api/api'; // Import your API function

function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Hook for programmatic navigation

    const handleLogin = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior
        setError(''); // Clear previous errors

        try {
            const data = await loginUser(email, password); // Call your API function
            if (data.success) {
                // Store user info in localStorage for mock authentication
                localStorage.setItem('userId', data.user.id);
                localStorage.setItem('userName', data.user.name);
                localStorage.setItem('userLocation', JSON.stringify(data.user.location)); // Store location
                console.log('Login successful:', data.user);
                navigate('/home'); // Redirect to home screen
            } else {
                setError(data.message || 'Login failed. Please check credentials.');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('An error occurred. Please try again.');
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Welcome to Super App POC</h2>
            <p style={styles.subtitle}>Login to continue</p>
            <form onSubmit={handleLogin} style={styles.form}>
                <div style={styles.formGroup}>
                    <label htmlFor="email" style={styles.label}>Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={styles.input}
                    />
                </div>
                <div style={styles.formGroup}>
                    <label htmlFor="password" style={styles.label}>Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={styles.input}
                    />
                </div>
                {error && <p style={styles.errorText}>{error}</p>}
                <button type="submit" style={styles.button}>Login</button>
            </form>
            <p style={styles.mockInfo}>
                Use mock credentials: <br/>
                Email: `rahul@example.com` / `pass` <br/>
                Email: `priya@example.com` / `pass`
            </p>
        </div>
    );
}

// Basic inline styles for POC - replace with actual CSS later
const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#f0f2f5',
        padding: '20px',
        boxSizing: 'border-box'
    },
    title: {
        color: '#333',
        marginBottom: '10px'
    },
    subtitle: {
        color: '#555',
        marginBottom: '30px'
    },
    form: {
        backgroundColor: '#fff',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '400px'
    },
    formGroup: {
        marginBottom: '15px'
    },
    label: {
        display: 'block',
        marginBottom: '5px',
        color: '#333',
        fontWeight: 'bold'
    },
    input: {
        width: 'calc(100% - 20px)',
        padding: '10px',
        borderRadius: '4px',
        border: '1px solid #ddd',
        fontSize: '16px'
    },
    button: {
        width: '100%',
        padding: '12px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        fontSize: '18px',
        cursor: 'pointer',
        marginTop: '20px',
        transition: 'background-color 0.3s ease'
    },
    buttonHover: {
        backgroundColor: '#0056b3'
    },
    errorText: {
        color: 'red',
        marginTop: '10px',
        textAlign: 'center'
    },
    mockInfo: {
        marginTop: '30px',
        fontSize: '14px',
        color: '#777',
        textAlign: 'center',
        lineHeight: '1.5'
    }
};

export default LoginScreen;