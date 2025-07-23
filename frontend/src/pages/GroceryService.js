// frontend/src/pages/GroceryService.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getGroceryProducts } from '../api/api';

function GroceryService() {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError('');
            try {
                const productData = await getGroceryProducts();
                setProducts(productData);
            } catch (err) {
                console.error('Error fetching grocery products:', err);
                setError('Failed to load grocery products. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const addToCart = (item) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((i) => i.id === item.id);
            if (existingItem) {
                return prevCart.map((i) =>
                    i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
                );
            }
            return [...prevCart, { ...item, quantity: 1 }];
        });
    };

    const removeFromCart = (itemId) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((i) => i.id === itemId);
            if (existingItem.quantity === 1) {
                return prevCart.filter((i) => i.id !== itemId);
            }
            return prevCart.map((i) =>
                i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i
            );
        });
    };

    const getTotalCartItems = () => {
        return cart.reduce((total, item) => total + item.quantity, 0);
    };

    const getCartTotal = () => {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const handleCheckout = () => {
        // For POC, we'll assume a single mock store for groceries
        const mockStore = { id: 'store1', name: 'FreshBazar Mart' }; // From your backend data
        navigate('/checkout', { state: { cart, serviceType: 'grocery', store: mockStore } });
    };

    if (loading) {
        return <div style={styles.container}>Loading grocery products...</div>;
    }

    if (error) {
        return <div style={styles.container}><p style={styles.errorText}>{error}</p></div>;
    }

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Grocery Delivery</h2>
            <p style={styles.subtitle}>Fresh produce, pantry staples & more</p>

            <div style={styles.productGrid}>
                {products.map((product) => (
                    <div key={product.id} style={styles.productCard}>
                        <img src={product.imageUrl} alt={product.name} style={styles.productImage} />
                        <h3 style={styles.productName}>{product.name}</h3>
                        <p style={styles.productPrice}>₹{product.price} / {product.category}</p>
                        <button onClick={() => addToCart(product)} style={styles.addToCartButton}>Add to Cart</button>
                    </div>
                ))}
            </div>

            {getTotalCartItems() > 0 && (
                <div style={styles.cartSummary}>
                    <h3>Cart Summary ({getTotalCartItems()} items)</h3>
                    <ul style={styles.cartList}>
                        {cart.map((item) => (
                            <li key={item.id} style={styles.cartItem}>
                                {item.name} (x{item.quantity}) - ₹{item.price * item.quantity}
                                <div style={styles.cartItemButtons}>
                                    <button onClick={() => removeFromCart(item.id)} style={styles.cartButton}>-</button>
                                    <button onClick={() => addToCart(item)} style={styles.cartButton}>+</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <h3 style={styles.cartTotal}>Total: ₹{getCartTotal()}</h3>
                    <button onClick={handleCheckout} style={styles.checkoutButton}>Proceed to Checkout</button>
                </div>
            )}
        </div>
    );
}

// Basic inline styles for POC - reuse/adapt from FoodService
const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
        boxSizing: 'border-box',
        minHeight: 'calc(100vh - 60px)',
        backgroundColor: '#f8f8f8',
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
    errorText: {
        color: 'red',
        fontSize: '1.2em',
    },
    productGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        width: '100%',
        maxWidth: '900px',
    },
    productCard: {
        backgroundColor: '#fff',
        borderRadius: '10px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'transform 0.2s ease-in-out',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingBottom: '15px'
    },
    productImage: {
        width: '100%',
        height: '150px',
        objectFit: 'cover',
        borderBottom: '1px solid #eee'
    },
    productName: {
        fontSize: '1.2em',
        color: '#333',
        margin: '15px 0 5px'
    },
    productPrice: {
        fontSize: '0.95em',
        color: '#555',
        marginBottom: '10px'
    },
    addToCartButton: {
        backgroundColor: '#28a745',
        color: 'white',
        padding: '8px 15px',
        borderRadius: '5px',
        border: 'none',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
    },
    cartSummary: {
        backgroundColor: '#e9f7ef',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)',
        marginTop: '30px',
        width: '100%',
        maxWidth: '700px',
    },
    cartList: {
        listStyle: 'none',
        padding: '0',
        margin: '15px 0',
    },
    cartItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px 0',
        borderBottom: '1px dashed #ccc',
    },
    cartItemButtons: {
        display: 'flex',
        gap: '5px',
    },
    cartButton: {
        backgroundColor: '#007bff',
        color: 'white',
        padding: '5px 10px',
        borderRadius: '3px',
        border: 'none',
        cursor: 'pointer',
        fontSize: '0.8em',
    },
    cartTotal: {
        textAlign: 'right',
        fontSize: '1.5em',
        marginTop: '20px',
        color: '#333',
    },
    checkoutButton: {
        width: '100%',
        padding: '12px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        fontSize: '1.2em',
        cursor: 'pointer',
        marginTop: '20px',
    },
};

export default GroceryService;