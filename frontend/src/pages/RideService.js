// frontend/src/pages/RideService.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { requestRide } from '../api/api';

function RideService() {
    const [pickupAddress, setPickupAddress] = useState('');
    const [dropoffAddress, setDropoffAddress] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Mock coordinates for Vijayawada for the simulated map
    const mockLocations = [
        { name: "Benz Circle", lat: 16.5062, lon: 80.6480, address: "Benz Circle, Vijayawada" },
        { name: "Mogalrajapuram", lat: 16.4900, lon: 80.6400, address: "Mogalrajapuram, Vijayawada" },
        { name: "Gannavaram Airport", lat: 16.5300, lon: 80.7000, address: "Gannavaram Airport, Vijayawada" },
        { name: "Vijayawada Railway Station", lat: 16.5160, lon: 80.6270, address: "Vijayawada Railway Station, Vijayawada" }
    ];

    useEffect(() => {
        // Pre-fill with user's saved location if available, for convenience
        const userLocation = localStorage.getItem('userLocation');
        if (userLocation) {
            const loc = JSON.parse(userLocation);
            setPickupAddress(loc.address || '');
        }
    }, []);

    const handleRequestRide = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // For POC, find mock coordinates based on entered addresses
        const selectedPickup = mockLocations.find(loc => loc.address.includes(pickupAddress));
        const selectedDropoff = mockLocations.find(loc => loc.address.includes(dropoffAddress));

        if (!selectedPickup || !selectedDropoff) {
            setError('Please enter valid mock addresses like "Benz Circle" or "Mogalrajapuram".');
            setLoading(false);
            return;
        }

        const userId = localStorage.getItem('userId');

        try {
            const rideData = {
                userId,
                pickup: selectedPickup,
                dropoff: selectedDropoff
            };
            const newRide = await requestRide(rideData); // Call your API function
            console.log('Ride requested:', newRide);
            // Navigate to the OrderStatusPage for simulated ride tracking
            // Pass the entire ride object in state for tracking page
            navigate(`/order-status/${newRide.id}/ride`, { state: { ride: newRide } });
        } catch (err) {
            console.error('Ride request error:', err);
            setError(err.message || 'Failed to request ride. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Book a Ride</h2>
            <p style={styles.subtitle}>Enter your pickup and drop-off locations</p>

            <form onSubmit={handleRequestRide} style={styles.form}>
                <div style={styles.formGroup}>
                    <label htmlFor="pickup" style={styles.label}>Pickup Location:</label>
                    <input
                        type="text"
                        id="pickup"
                        value={pickupAddress}
                        onChange={(e) => setPickupAddress(e.target.value)}
                        placeholder="e.g., Benz Circle"
                        required
                        style={styles.input}
                    />
                </div>
                <div style={styles.formGroup}>
                    <label htmlFor="dropoff" style={styles.label}>Drop-off Location:</label>
                    <input
                        type="text"
                        id="dropoff"
                        value={dropoffAddress}
                        onChange={(e) => setDropoffAddress(e.target.value)}
                        placeholder="e.g., Mogalrajapuram"
                        required
                        style={styles.input}
                    />
                </div>
                {error && <p style={styles.errorText}>{error}</p>}
                <button type="submit" style={styles.button} disabled={loading}>
                    {loading ? 'Requesting...' : 'Request Ride'}
                </button>
            </form>
            <p style={styles.mockInfo}>
                Use mock addresses: "Benz Circle", "Mogalrajapuram", "Gannavaram Airport", "Vijayawada Railway Station"
            </p>
        </div>
    );
}

// Basic inline styles for POC - reuse/adapt from other services
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

export default RideService;