// frontend/src/pages/FoodService.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // useParams for menu screen later
import { getRestaurants, getRestaurantMenu } from '../api/api';

function FoodService() {
    const [restaurants, setRestaurants] = useState([]);
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);
    const [menu, setMenu] = useState([]);
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { restaurantId } = useParams(); // To get restaurant ID from URL for menu

    useEffect(() => {
        const fetchInitialData = async () => {
            setLoading(true);
            setError('');
            try {
                if (restaurantId) {
                    // If restaurantId is in URL, fetch menu
                    const menuData = await getRestaurantMenu(restaurantId);
                    setMenu(menuData);
                    // Find the selected restaurant to display its name
                    const allRestaurants = await getRestaurants(); // Fetch all to find the one
                    const currentRest = allRestaurants.find(r => r.id === restaurantId);
                    setSelectedRestaurant(currentRest);
                } else {
                    // Otherwise, fetch list of restaurants
                    const restData = await getRestaurants();
                    setRestaurants(restData);
                }
            } catch (err) {
                console.error('Error fetching data for FoodService:', err);
                setError('Failed to load data. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, [restaurantId]); // Re-run effect if restaurantId in URL changes

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
        navigate('/checkout', { state: { cart, serviceType: 'food', restaurant: selectedRestaurant } });
    };

    if (loading) {
        return <div style={styles.container}>Loading food options...</div>;
    }

    if (error) {
        return <div style={styles.container}><p style={styles.errorText}>{error}</p></div>;
    }

    // --- Render Restaurant List ---
    if (!restaurantId) {
        return (
            <div style={styles.container}>
                <h2 style={styles.title}>Food Delivery</h2>
                <p style={styles.subtitle}>Choose a restaurant</p>
                <div style={styles.cardContainer}>
                    {restaurants.map((restaurant) => (
                        <div key={restaurant.id} style={styles.card} onClick={() => navigate(`/food/menu/${restaurant.id}`)}>
                            <img src={restaurant.imageUrl} alt={restaurant.name} style={styles.cardImage} />
                            <h3 style={styles.cardTitle}>{restaurant.name}</h3>
                            <p style={styles.cardDescription}>{restaurant.cuisine} - {restaurant.rating} ⭐</p>
                            <p style={styles.cardDescription}>Est. Delivery: {restaurant.deliveryTime}</p>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // --- Render Restaurant Menu ---
    return (
        <div style={styles.container}>
            <button onClick={() => navigate('/food')} style={styles.backButton}>&larr; Back to Restaurants</button>
            <h2 style={styles.title}>{selectedRestaurant?.name || 'Restaurant Menu'}</h2>
            <p style={styles.subtitle}>{selectedRestaurant?.cuisine}</p>

            <div style={styles.menuContainer}>
                {menu.length > 0 ? (
                    menu.map((item) => (
                        <div key={item.id} style={styles.menuItem}>
                            <img src={item.imageUrl} alt={item.name} style={styles.menuItemImage} />
                            <div style={styles.menuItemDetails}>
                                <h4 style={styles.menuItemTitle}>{item.name}</h4>
                                <p style={styles.menuItemDescription}>{item.description}</p>
                                <p style={styles.menuItemPrice}>₹{item.price}</p>
                            </div>
                            <button onClick={() => addToCart(item)} style={styles.addToCartButton}>Add to Cart</button>
                        </div>
                    ))
                ) : (
                    <p>No menu items available.</p>
                )}
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

// Basic inline styles for POC
const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
        boxSizing: 'border-box',
        minHeight: 'calc(100vh - 60px)', // Adjust for potential header
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
    cardContainer: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '25px',
        width: '100%',
        maxWidth: '900px',
    },
    card: {
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
    cardHover: {
        transform: 'translateY(-5px)',
    },
    cardImage: {
        width: '100%',
        height: '180px',
        objectFit: 'cover',
        borderBottom: '1px solid #eee'
    },
    cardTitle: {
        fontSize: '1.4em',
        color: '#333',
        margin: '15px 0 5px'
    },
    cardDescription: {
        fontSize: '0.95em',
        color: '#555',
        marginBottom: '5px'
    },
    backButton: {
        alignSelf: 'flex-start',
        backgroundColor: '#007bff',
        color: 'white',
        padding: '8px 15px',
        borderRadius: '5px',
        border: 'none',
        cursor: 'pointer',
        marginBottom: '20px',
        marginLeft: '20px', // Align with container padding
    },
    menuContainer: {
        width: '100%',
        maxWidth: '700px',
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
    },
    menuItem: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 0',
        borderBottom: '1px solid #eee',
    },
    menuItemImage: {
        width: '70px',
        height: '70px',
        objectFit: 'cover',
        borderRadius: '5px',
        marginRight: '15px',
    },
    menuItemDetails: {
        flexGrow: 1,
        textAlign: 'left',
    },
    menuItemTitle: {
        margin: '0',
        fontSize: '1.2em',
        color: '#333',
    },
    menuItemDescription: {
        margin: '5px 0',
        fontSize: '0.9em',
        color: '#777',
    },
    menuItemPrice: {
        fontWeight: 'bold',
        color: '#333',
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
        backgroundColor: '#e9f7ef', // Light green background for cart
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

export default FoodService;