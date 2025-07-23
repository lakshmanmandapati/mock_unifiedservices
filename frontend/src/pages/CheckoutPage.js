// frontend/src/pages/CheckoutPage.js
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { placeOrder } from '../api/api';

function CheckoutPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { cart, serviceType, restaurant, store } = location.state || {}; // Destructure data passed from previous page
    const userId = localStorage.getItem('userId');
    const userLocation = JSON.parse(localStorage.getItem('userLocation'));
    const deliveryAddress = userLocation?.address || "Your default address"; // Use mock user address

    const handlePlaceOrder = async () => {
        try {
            let orderData = {
                userId: userId,
                type: serviceType,
                items: cart.map(item => ({ id: item.id, name: item.name, price: item.price, quantity: item.quantity })),
                total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
                deliveryAddress: deliveryAddress,
            };

            if (serviceType === 'food') {
                orderData.restaurantId = restaurant.id;
            } else if (serviceType === 'grocery') {
                orderData.storeId = store.id;
            }

            const newOrder = await placeOrder(orderData);
            console.log('Order placed successfully:', newOrder);
            // Navigate to order status page
            navigate(`/order-status/${newOrder.id}/${newOrder.type}`, { state: { order: newOrder } });

        } catch (error) {
            console.error('Error placing order:', error);
            alert('Failed to place order. Please try again.');
        }
    };

    if (!cart || cart.length === 0) {
        return (
            <div style={styles.container}>
                <h2 style={styles.title}>Your cart is empty.</h2>
                <button onClick={() => navigate('/home')} style={styles.button}>Go to Home</button>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Checkout</h2>
            <p style={styles.subtitle}>Review your order</p>

            <div style={styles.section}>
                <h3>Items from {serviceType === 'food' ? restaurant?.name : store?.name}</h3>
                <ul style={styles.itemList}>
                    {cart.map(item => (
                        <li key={item.id} style={styles.item}>
                            {item.name} (x{item.quantity}) - ₹{item.price * item.quantity}
                        </li>
                    ))}
                </ul>
                <h3 style={styles.total}>Total: ₹{cart.reduce((sum, item) => sum + item.price * item.quantity, 0)}</h3>
            </div>

            <div style={styles.section}>
                <h3>Delivery Details</h3>
                <p><strong>Deliver to:</strong> {deliveryAddress}</p>
                {/* Simulated payment info */}
                <p><strong>Payment Method:</strong> Cash on Delivery (Simulated)</p>
            </div>

            <button onClick={handlePlaceOrder} style={styles.placeOrderButton}>Place Order (Simulated Payment)</button>
            <button onClick={() => navigate(-1)} style={styles.backButton}>Back to Cart</button>
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
        backgroundColor: '#f8f8f8',
        minHeight: '100vh',
    },
    title: {
        fontSize: '2em',
        color: '#333',
        marginBottom: '10px',
    },
    subtitle: {
        fontSize: '1.1em',
        color: '#666',
        marginBottom: '30px',
    },
    section: {
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
        width: '100%',
        maxWidth: '600px',
        marginBottom: '20px',
        textAlign: 'left',
    },
    itemList: {
        listStyle: 'none',
        padding: '0',
        margin: '0',
    },
    item: {
        padding: '8px 0',
        borderBottom: '1px dashed #eee',
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '1.1em',
        color: '#555',
    },
    total: {
        textAlign: 'right',
        marginTop: '15px',
        fontSize: '1.4em',
        color: '#333',
    },
    placeOrderButton: {
        width: '100%',
        maxWidth: '600px',
        padding: '15px',
        backgroundColor: '#28a745', // Green for placing order
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        fontSize: '1.2em',
        cursor: 'pointer',
        marginTop: '20px',
    },
    backButton: {
        width: '100%',
        maxWidth: '600px',
        padding: '10px',
        backgroundColor: '#6c757d', // Gray for back button
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        fontSize: '1em',
        cursor: 'pointer',
        marginTop: '10px',
    },
    button: { // Reused from generic buttons
        padding: '12px 25px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        fontSize: '1.1em',
        cursor: 'pointer',
        marginTop: '20px',
    },
};

export default CheckoutPage;