// frontend/src/pages/MyActivityPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserHistory } from '../api/api';

function MyActivityPage() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId'); // Get current user ID

    useEffect(() => {
        const fetchHistory = async () => {
            setLoading(true);
            setError('');
            if (!userId) {
                setError('User not logged in. Please login.');
                setLoading(false);
                navigate('/login'); // Redirect if not logged in
                return;
            }
            try {
                const userHistory = await getUserHistory(userId);
                setHistory(userHistory);
            } catch (err) {
                console.error('Error fetching user history:', err);
                setError('Failed to load activity history. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [userId, navigate]); // Re-fetch if userId changes or navigate function changes

    const getHistoryItemDetails = (item) => {
        if (item.serviceType === 'Food Order') {
            const restaurantName = item.restaurantId === 'rest1' ? 'Spice Route Kitchen' : 
                                   item.restaurantId === 'rest2' ? 'Dosa Delight' : 
                                   item.restaurantId === 'rest3' ? 'Pizza Paradise' :
                                   item.restaurantId === 'rest4' ? 'Burger Haven' : 'Unknown Restaurant';
            return `${item.items.length} item(s) from ${restaurantName}`;
        } else if (item.serviceType === 'Grocery Order') {
            const storeName = item.storeId === 'store1' ? 'FreshBazar Mart' : 
                              item.storeId === 'store2' ? 'DailyNeeds Supply' : 'Unknown Store';
            return `${item.items.length} item(s) from ${storeName}`;
        } else if (item.serviceType === 'Ride') {
            return `Ride from ${item.pickup.address} to ${item.dropoff.address}`;
        }
        return 'Details not available';
    };

    if (loading) {
        return <div style={styles.container}>Loading activity history...</div>;
    }

    if (error) {
        return <div style={styles.container}><p style={styles.errorText}>{error}</p></div>;
    }

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>My Activity</h2>
            <button onClick={() => navigate('/home')} style={styles.backButton}>&larr; Back to Home</button>

            {history.length === 0 ? (
                <p style={styles.noActivity}>No activity found yet. Place an order or request a ride!</p>
            ) : (
                <div style={styles.historyList}>
                    {history.map((item) => (
                        <div key={item.id} style={styles.historyCard}>
                            <div style={styles.cardHeader}>
                                <span style={styles.serviceType}>{item.serviceType}</span>
                                <span style={styles.status}>{item.status}</span>
                            </div>
                            <p style={styles.cardDetails}>{getHistoryItemDetails(item)}</p>
                            {item.total && <p style={styles.cardAmount}>Total: ₹{item.total}</p>}
                            {item.fare && <p style={styles.cardAmount}>Fare: ₹{item.fare}</p>}
                            <p style={styles.cardDate}>{new Date(item.timestamp).toLocaleString()}</p>
                            {/* Optional: Add a button to view status if not already 'Delivered'/'Completed' */}
                            {!(item.status === 'Delivered' || item.status === 'Completed' || item.status === 'Ride Completed!') && (
                                <button onClick={() => navigate(`/order-status/${item.id}/${item.type || 'ride'}`, { state: { order: item, ride: item }})} style={styles.viewStatusButton}>View Status</button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// Basic inline styles for POC
const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
        boxSizing: 'border-box',
        backgroundColor: '#f0f2f5',
        minHeight: '100vh',
    },
    title: {
        fontSize: '2em',
        color: '#333',
        marginBottom: '20px',
    },
    errorText: {
        color: 'red',
        fontSize: '1.2em',
    },
    backButton: {
        alignSelf: 'flex-start',
        backgroundColor: '#6c757d',
        color: 'white',
        padding: '8px 15px',
        borderRadius: '5px',
        border: 'none',
        cursor: 'pointer',
        marginBottom: '20px',
        marginLeft: '20px', // Align with container padding
    },
    noActivity: {
        fontSize: '1.2em',
        color: '#555',
        marginTop: '50px',
    },
    historyList: {
        width: '100%',
        maxWidth: '700px',
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
    },
    historyCard: {
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
        textAlign: 'left',
    },
    cardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '10px',
    },
    serviceType: {
        fontSize: '1.3em',
        fontWeight: 'bold',
        color: '#007bff',
    },
    status: {
        fontSize: '1em',
        fontWeight: 'bold',
        padding: '5px 10px',
        borderRadius: '5px',
        backgroundColor: '#ffe0b2', // Light orange for status
        color: '#fb8c00',
    },
    cardDetails: {
        fontSize: '1em',
        color: '#333',
        marginBottom: '5px',
    },
    cardAmount: {
        fontSize: '1.1em',
        fontWeight: 'bold',
        color: '#28a745', // Green for amount
        marginBottom: '5px',
    },
    cardDate: {
        fontSize: '0.85em',
        color: '#777',
        textAlign: 'right',
        marginTop: '10px',
    },
    viewStatusButton: {
        backgroundColor: '#007bff',
        color: 'white',
        padding: '8px 15px',
        borderRadius: '5px',
        border: 'none',
        cursor: 'pointer',
        marginTop: '10px',
        fontSize: '0.9em',
    }
};

export default MyActivityPage;