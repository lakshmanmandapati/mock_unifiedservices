// frontend/src/pages/OrderStatusPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

// Import a static map image of Vijayawada for simulation
// You would need to add an image file to your project, e.g., src/assets/vijayawada_map.png
// For now, using a placeholder, but ideally put a simple map screenshot here.
import vijayawadaMap from '../assets/vijayawada_map.png'; // <--- YOU NEED TO CREATE THIS FILE
// If you don't have an assets folder, place it directly in 'src' for this POC
// Or simply use a generic placeholder like "https://via.placeholder.com/600x400?text=Vijayawada+Map"

function OrderStatusPage() {
    const { orderId, type } = useParams(); // Get order ID and type from URL
    const location = useLocation(); // To access state passed from navigate
    const navigate = useNavigate();

    const [status, setStatus] = useState('Loading...');
    const [estimatedTime, setEstimatedTime] = useState(null);
    const [rideDetails, setRideDetails] = useState(null); // For ride specific info
    const [driverPosition, setDriverPosition] = useState({ x: 0, y: 0 }); // For map animation
    const [startCoords, setStartCoords] = useState(null);
    const [endCoords, setEndCoords] = useState(null);

    // Helper to convert lat/lon to percentage for basic map positioning (very rough approximation)
    // Assumes map image covers a specific geographic bounding box
    const mapBounds = {
        minLat: 16.4, maxLat: 16.6,
        minLon: 80.5, maxLon: 80.8
    };
    const mapSize = { width: 600, height: 400 }; // Matches placeholder image size

    const latLonToPx = (lat, lon) => {
        const latRange = mapBounds.maxLat - mapBounds.minLat;
        const lonRange = mapBounds.maxLon - mapBounds.minLon;

        const y = ((lat - mapBounds.minLat) / latRange) * mapSize.height;
        const x = ((lon - mapBounds.minLon) / lonRange) * mapSize.width;
        
        // Invert Y because CSS top increases downwards, but latitude increases upwards
        return { x: x, y: mapSize.height - y };
    };

    useEffect(() => {
        let statuses;
        let currentEta;
        let animationInterval;
        let statusUpdateInterval;

        if (type === 'food') {
            statuses = ['Pending Confirmation...', 'Order Confirmed!', 'Preparing your meal...', 'Out for Delivery!', 'Delivered!'];
            currentEta = 20;
        } else if (type === 'grocery') {
            statuses = ['Pending Confirmation...', 'Order Confirmed!', 'Items being picked...', 'Out for Delivery!', 'Delivered!'];
            currentEta = 40;
        } else if (type === 'ride') {
            statuses = ['Searching for driver...', 'Driver Assigned!', 'Driver is en route...', 'Arriving soon!', 'Ride Completed!'];
            currentEta = 15;
            setRideDetails(location.state?.ride); // Get ride details from state
            if (location.state?.ride) {
                // Initialize driver position on map
                const pickupPx = latLonToPx(location.state.ride.pickup.lat, location.state.ride.pickup.lon);
                const dropoffPx = latLonToPx(location.state.ride.dropoff.lat, location.state.ride.dropoff.lon);
                
                setStartCoords(pickupPx);
                setEndCoords(dropoffPx);
                setDriverPosition(pickupPx); // Driver starts at pickup (for visual effect)

                // Simulate driver movement on map over a duration (e.g., 12 seconds)
                const animationDuration = 12000; // milliseconds
                let startTime = Date.now();

                animationInterval = setInterval(() => {
                    const elapsed = Date.now() - startTime;
                    const progress = Math.min(elapsed / animationDuration, 1);

                    const currentX = startCoords.x + (endCoords.x - startCoords.x) * progress;
                    const currentY = startCoords.y + (endCoords.y - startCoords.y) * progress;
                    
                    setDriverPosition({ x: currentX, y: currentY });

                    if (progress >= 1) {
                        clearInterval(animationInterval);
                    }
                }, 50); // Update every 50ms for smooth animation
            }
        } else {
            setStatus('Unknown Order Type');
            return;
        }

        let currentStatusIndex = 0;
        setStatus(statuses[currentStatusIndex]);
        setEstimatedTime(currentEta);

        statusUpdateInterval = setInterval(() => {
            currentStatusIndex++;
            if (currentStatusIndex < statuses.length) {
                setStatus(statuses[currentStatusIndex]);
                // Decrease ETA based on type, ensuring it doesn't go below 0
                setEstimatedTime(prevEta => Math.max(0, prevEta - (type === 'food' ? 5 : (type === 'grocery' ? 10 : 5))));
            } else {
                clearInterval(statusUpdateInterval);
                setEstimatedTime(0); // Set ETA to 0 once completed
            }
        }, type === 'food' ? 5000 : (type === 'grocery' ? 10000 : 5000)); // Update status every 5, 10, or 5 seconds


        return () => {
            clearInterval(statusUpdateInterval);
            if (animationInterval) clearInterval(animationInterval); // Clear map animation interval
        };
    }, [orderId, type, location.state, startCoords, endCoords]); // Include coords in dependency array


    return (
        <div style={styles.container}>
            <h2 style={styles.title}>{type === 'ride' ? 'Ride Status' : 'Order Status'}</h2>
            <p style={styles.orderId}>ID: {orderId}</p>

            <div style={styles.statusBox}>
                <p style={styles.currentStatus}>Status: {status}</p>
                {estimatedTime !== null && estimatedTime > 0 && (
                    <p style={styles.eta}>Estimated Time: {estimatedTime} {type === 'ride' ? 'mins' : 'minutes'}</p>
                )}
                {estimatedTime === 0 && (status.includes('Delivered') || status.includes('Completed')) && (
                    <p style={styles.eta}>{type === 'ride' ? 'Ride Completed!' : 'Order Delivered!'}</p>
                )}
            </div>

            {type === 'ride' && rideDetails && (
                <div style={styles.rideDetailsBox}>
                    <h3>Your Ride Details:</h3>
                    <p><strong>Driver:</strong> {rideDetails.driver.name} ({rideDetails.driver.vehicleType})</p>
                    <p><strong>License Plate:</strong> {rideDetails.driver.licensePlate}</p>
                    <p><strong>Fare:</strong> ₹{rideDetails.fare}</p>
                    <p><strong>Pickup:</strong> {rideDetails.pickup.address}</p>
                    <p><strong>Drop-off:</strong> {rideDetails.dropoff.address}</p>

                    <div style={styles.mapContainer}>
                        <img src={vijayawadaMap} alt="Vijayawada Map" style={styles.mapImage} />
                        {startCoords && <div style={{ ...styles.marker, ...styles.pickupMarker, left: startCoords.x, top: startCoords.y }}>P</div>}
                        {endCoords && <div style={{ ...styles.marker, ...styles.dropoffMarker, left: endCoords.x, top: endCoords.y }}>D</div>}
                        <div 
                            style={{ 
                                ...styles.driverMarker, 
                                transform: `translate(-50%, -50%) translate(${driverPosition.x}px, ${driverPosition.y}px)` 
                            }}
                        >
                            🚗
                        </div>
                    </div>
                </div>
            )}

            <button onClick={() => navigate('/my-activity')} style={styles.button}>View All Activity</button>
            <button onClick={() => navigate('/home')} style={styles.buttonSecondary}>Go to Home</button>
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
    orderId: {
        fontSize: '0.9em',
        color: '#777',
        marginBottom: '30px',
    },
    statusBox: {
        backgroundColor: '#fff',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '500px',
        textAlign: 'center',
        marginBottom: '30px',
    },
    currentStatus: {
        fontSize: '1.5em',
        fontWeight: 'bold',
        color: '#007bff',
        marginBottom: '10px',
    },
    eta: {
        fontSize: '1.2em',
        color: '#555',
    },
    rideDetailsBox: {
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '600px',
        textAlign: 'left',
        marginBottom: '30px',
    },
    mapContainer: {
        position: 'relative',
        width: '100%',
        maxWidth: '600px',
        height: '400px', // Fixed height for map
        border: '1px solid #ccc',
        marginTop: '20px',
        overflow: 'hidden', // Hide overflow from markers
        backgroundColor: '#eee' // Background if image fails
    },
    mapImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        position: 'absolute',
        top: 0,
        left: 0,
    },
    marker: {
        position: 'absolute',
        width: '25px',
        height: '25px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        color: 'white',
        fontSize: '0.8em',
        zIndex: 10,
        transform: 'translate(-50%, -50%)', // Center marker
    },
    pickupMarker: {
        backgroundColor: 'green',
    },
    dropoffMarker: {
        backgroundColor: 'red',
    },
    driverMarker: {
        position: 'absolute',
        fontSize: '2em', // Car emoji size
        zIndex: 11,
        transition: 'transform 0.5s linear', // Smooth animation for driver
    },
    button: {
        padding: '12px 25px',
        backgroundColor: '#28a745', // Green for primary action
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        fontSize: '1.1em',
        cursor: 'pointer',
        marginTop: '20px',
        width: '100%',
        maxWidth: '300px',
    },
    buttonSecondary: {
        padding: '12px 25px',
        backgroundColor: '#6c757d', // Gray for secondary action
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        fontSize: '1.1em',
        cursor: 'pointer',
        marginTop: '10px',
        width: '100%',
        maxWidth: '300px',
    },
};

export default OrderStatusPage;