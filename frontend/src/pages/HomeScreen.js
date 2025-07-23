// frontend/src/pages/HomeScreen.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function HomeScreen() {
    const [userName, setUserName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Retrieve user name from localStorage
        const storedUserName = localStorage.getItem('userName');
        if (storedUserName) {
            setUserName(storedUserName);
        } else {
            // If no user is logged in, redirect to login (though PrivateRoute should handle this)
            navigate('/login');
        }
    }, [navigate]);

    const handleServiceClick = (servicePath) => {
        navigate(servicePath);
    };

    const handleLogout = () => {
        localStorage.removeItem('userId');
        localStorage.removeItem('userName');
        localStorage.removeItem('userLocation');
        navigate('/login');
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h2 style={styles.title}>Welcome, {userName || 'User'}!</h2>
                <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
            </div>

            <div style={styles.cardContainer}>
                <div style={styles.card} onClick={() => handleServiceClick('/food')}>
                    <h3 style={styles.cardTitle}>Order Food</h3>
                    <p style={styles.cardDescription}>Find restaurants near you</p>
                </div>
                <div style={styles.card} onClick={() => handleServiceClick('/grocery')}>
                    <h3 style={styles.cardTitle}>Order Groceries</h3>
                    <p style={styles.cardDescription}>Fresh produce delivered</p>
                </div>
                <div style={styles.card} onClick={() => handleServiceClick('/rides')}>
                    <h3 style={styles.cardTitle}>Book a Ride</h3>
                    <p style={styles.cardDescription}>Quick & convenient travel</p>
                </div>
            </div>

            <div style={styles.myActivityLink}>
                <p>
                    <span onClick={() => handleServiceClick('/my-activity')} style={styles.linkText}>
                        View My Activity (Orders & Rides)
                    </span>
                </p>
            </div>
        </div>
    );
}

// Basic inline styles for POC
const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f0f2f5',
        padding: '20px',
        boxSizing: 'border-box'
    },
    header: {
        width: '100%',
        maxWidth: '800px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '40px',
        padding: '10px 0'
    },
    title: {
        color: '#333',
        fontSize: '2em'
    },
    logoutButton: {
        padding: '8px 15px',
        backgroundColor: '#dc3545',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '0.9em'
    },
    cardContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '30px',
        width: '100%',
        maxWidth: '900px',
        marginBottom: '40px'
    },
    card: {
        backgroundColor: '#fff',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)',
        width: '280px',
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '150px' // Ensure cards have similar height
    },
    cardHover: {
        transform: 'translateY(-5px)',
        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)'
    },
    cardTitle: {
        color: '#007bff',
        fontSize: '1.5em',
        marginBottom: '10px'
    },
    cardDescription: {
        color: '#666',
        fontSize: '0.9em'
    },
    myActivityLink: {
        marginTop: '20px',
        fontSize: '1.1em',
        color: '#007bff',
        cursor: 'pointer'
    },
    linkText: {
        textDecoration: 'underline',
        cursor: 'pointer'
    }
};

export default HomeScreen;