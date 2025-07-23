// frontend/src/api/api.js

const API_BASE_URL = 'http://localhost:3001/api'; // Your backend URL

// --- Authentication ---
export const loginUser = async (email, password) => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Login failed');
        }
        return data;
    } catch (error) {
        console.error('Login API error:', error);
        throw error;
    }
};

// --- Food Service ---
export const getRestaurants = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/restaurants`);
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch restaurants');
        }
        return data;
    } catch (error) {
        console.error('Get Restaurants API error:', error);
        throw error;
    }
};

export const getRestaurantMenu = async (restaurantId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/restaurants/${restaurantId}/menu`);
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || `Failed to fetch menu for ${restaurantId}`);
        }
        return data;
    } catch (error) {
        console.error(`Get Restaurant Menu API error for ${restaurantId}:`, error);
        throw error;
    }
};

// --- Grocery Service ---
export const getGroceryProducts = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/groceries/products`);
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch grocery products');
        }
        return data;
    } catch (error) {
        console.error('Get Grocery Products API error:', error);
        throw error;
    }
};

// --- Ride Service ---
export const getDrivers = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/drivers`);
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch drivers');
        }
        return data;
    } catch (error) {
        console.error('Get Drivers API error:', error);
        throw error;
    }
};

// --- Order/Ride Placement ---
export const placeOrder = async (orderData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to place order');
        }
        return data;
    } catch (error) {
        console.error('Place Order API error:', error);
        throw error;
    }
};

export const requestRide = async (rideData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/rides`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(rideData),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to request ride');
        }
        return data;
    } catch (error) {
        console.error('Request Ride API error:', error);
        throw error;
    }
};

// --- History ---
export const getUserHistory = async (userId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/users/${userId}/history`);
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch user history');
        }
        return data;
    } catch (error) {
        console.error('Get User History API error:', error);
        throw error;
    }
};