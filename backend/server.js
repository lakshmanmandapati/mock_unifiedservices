// backend/server.js

/**
 * Super App POC Backend Server
 *
 * This server provides mock API endpoints for:
 * - User Authentication
 * - Food Service (Restaurants, Menus, Order Placement)
 * - Grocery Service (Products, Order Placement)
 * - Ride Service (Drivers, Ride Request)
 * - Unified User History
 *
 * All data is in-memory and will reset on server restart.
 * Designed for a 40-hour Proof of Concept (POC) with a React.js frontend.
 */

const express = require('express');
const cors = require('cors'); // Import cors middleware

const app = express();

// --- Middleware Configuration ---
// Enable CORS for all origins. This is crucial for local frontend development.
// !!! WARNING: In a production environment, restrict 'origin' to your actual frontend domain(s) for security.
app.use(cors({
    origin: '*', // Allows all origins to access your backend
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'] // Allowed request headers
}));
app.use(express.json()); // Enable JSON body parsing for POST requests

// --- Import Mock Data (using 'let' for arrays that will be modified) ---
// These files should be in the 'backend/data/' directory
const users = require('./data/users');
const restaurants = require('./data/restaurants');
const menus = require('./data/menus');
const groceryStores = require('./data/groceryStores'); // Not directly used by current frontend API, but good to have
const groceryProducts = require('./data/groceryProducts');
let drivers = require('./data/drivers'); // Use 'let' because driver status will change
let orders = require('./data/orders');   // Use 'let' because new orders will be added
let rides = require('./data/rides');     // Use 'let' because new rides will be added

// --- Utility Functions ---
// Helper to generate a unique ID for new orders/rides
const generateUniqueId = (prefix) => {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
};

// --- API Endpoints ---

// 1. Basic Root Endpoint: To verify if the server is running
app.get('/', (req, res) => {
    res.send('Super App POC Backend Running!');
});

// 2. Authentication
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        // Return a simplified user object, excluding sensitive password
        res.json({
            success: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                location: user.location
            }
        });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

// 3. Food Service Endpoints
// Get all available restaurants
app.get('/api/restaurants', (req, res) => {
    res.json(restaurants);
});

// Get menu items for a specific restaurant by ID
app.get('/api/restaurants/:id/menu', (req, res) => {
    const menu = menus.find(m => m.restaurantId === req.params.id);
    if (menu) {
        res.json(menu.items);
    } else {
        res.status(404).json({ message: 'Menu not found for this restaurant.' });
    }
});

// 4. Grocery Service Endpoints
// Get all available grocery products
app.get('/api/groceries/products', (req, res) => {
    // For this POC, we return all products. In a real app, you might filter by store, category, etc.
    res.json(groceryProducts);
});

// 5. Ride Service Endpoints
// Get currently available drivers
app.get('/api/drivers', (req, res) => {
    res.json(drivers.filter(d => d.status === 'available'));
});

// 6. Order and Ride Placement Endpoints (POST requests to create new entries)
app.post('/api/orders', (req, res) => {
    const { userId, type, items, total, deliveryAddress, restaurantId, storeId } = req.body;

    // Basic server-side validation for critical fields
    if (!userId || !type || !Array.isArray(items) || items.length === 0 || !total || !deliveryAddress) {
        return res.status(400).json({ message: 'Missing required order fields or invalid items data.' });
    }
    if (type === 'food' && !restaurantId) {
        return res.status(400).json({ message: 'Food orders require a restaurantId.' });
    }
    if (type === 'grocery' && !storeId) {
        return res.status(400).json({ message: 'Grocery orders require a storeId.' });
    }

    const newOrder = {
        id: generateUniqueId('order'),
        userId,
        type, // 'food' or 'grocery'
        items, // Array of { id, name, price, quantity }
        total,
        deliveryAddress,
        restaurantId: type === 'food' ? restaurantId : undefined, // Include only if food order
        storeId: type === 'grocery' ? storeId : undefined,       // Include only if grocery order
        status: 'Pending', // Initial status
        timestamp: new Date().toISOString()
    };
    orders.push(newOrder); // Add the new order to the in-memory array
    console.log(`[BACKEND] New ${type} order placed:`, newOrder.id);
    res.status(201).json(newOrder);
});

app.post('/api/rides', (req, res) => {
    const { userId, pickup, dropoff } = req.body;

    // Basic server-side validation
    if (!userId || !pickup || !dropoff) {
        return res.status(400).json({ message: 'Missing required ride fields.' });
    }

    // Simulate driver assignment: find an available driver
    const availableDrivers = drivers.filter(d => d.status === 'available');
    if (availableDrivers.length === 0) {
        // Return 503 Service Unavailable if no drivers are free
        return res.status(503).json({ message: 'No drivers available at the moment. Please try again shortly.' });
    }

    // Assign a random available driver
    const assignedDriver = availableDrivers[Math.floor(Math.random() * availableDrivers.length)];
    // Simulate updating driver status (in-memory)
    // Note: In a real app, this would be more robust to prevent double-booking.
    assignedDriver.status = 'on-trip';

    // Calculate a mock fare (random for POC)
    const mockFare = Math.floor(Math.random() * (250 - 100 + 1) + 100); // Fare between 100 and 250 INR

    const newRide = {
        id: generateUniqueId('ride'),
        userId,
        pickup, // Object: { lat, lon, address }
        dropoff, // Object: { lat, lon, address }
        driver: {
            id: assignedDriver.id,
            name: assignedDriver.name,
            vehicleType: assignedDriver.vehicleType,
            licensePlate: assignedDriver.licensePlate,
            currentLocation: assignedDriver.currentLocation // Initial driver location for frontend
        },
        fare: mockFare,
        status: 'Searching', // Initial ride status (e.g., waiting for driver acceptance, or driver en route)
        timestamp: new Date().toISOString()
    };
    rides.push(newRide); // Add the new ride to the in-memory array
    console.log('[BACKEND] New ride requested:', newRide.id);
    res.status(201).json(newRide);
});

// 7. History Retrieval Endpoint
app.get('/api/users/:userId/history', (req, res) => {
    const userId = req.params.userId;

    // Filter orders and rides for the specific user
    const userOrders = orders.filter(o => o.userId === userId).map(o => ({
        ...o,
        serviceType: o.type === 'food' ? 'Food Order' : 'Grocery Order' // Add a display type
    }));
    const userRides = rides.filter(r => r.userId === userId).map(r => ({
        ...r,
        serviceType: 'Ride' // Add a display type
    }));

    // Combine all history items and sort by timestamp (most recent first)
    const history = [...userOrders, ...userRides].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    res.json(history);
});


// --- Server Listener ---
const PORT = process.env.PORT || 3001; // <--- PORT CHANGED TO 3001
app.listen(PORT, () => console.log(`Super App Backend running on port ${PORT}`));