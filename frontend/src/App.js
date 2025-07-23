// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginScreen from './pages/LoginScreen';
import HomeScreen from './pages/HomeScreen';
import FoodService from './pages/FoodService';
import GroceryService from './pages/GroceryService';
import RideService from './pages/RideService';
import CheckoutPage from './pages/CheckoutPage';
import OrderStatusPage from './pages/OrderStatusPage';
import MyActivityPage from './pages/MyActivityPage';

// A simple component to manage authentication state for routing
const PrivateRoute = ({ children }) => {
    // In a real app, this would check a token or more complex auth state
    const isAuthenticated = localStorage.getItem('userId');
    return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
    return (
        <Router>
            <div className="App">
                {/* You can add a global header component here if needed later */}
                {/* <Header /> */}

                <Routes>
                    <Route path="/login" element={<LoginScreen />} />

                    {/* Protected Routes */}
                    <Route
                        path="/home"
                        element={
                            <PrivateRoute>
                                <HomeScreen />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/food"
                        element={
                            <PrivateRoute>
                                <FoodService />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/food/menu/:restaurantId"
                        element={
                            <PrivateRoute>
                                <FoodService /> {/* Reusing FoodService for simplicity to display menu */}
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/grocery"
                        element={
                            <PrivateRoute>
                                <GroceryService />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/rides"
                        element={
                            <PrivateRoute>
                                <RideService />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/checkout"
                        element={
                            <PrivateRoute>
                                <CheckoutPage />
                            </PrivateRoute>
                        }
                    />
                     <Route
                        path="/order-status/:orderId/:type" // type could be 'food', 'grocery', 'ride'
                        element={
                            <PrivateRoute>
                                <OrderStatusPage />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/my-activity"
                        element={
                            <PrivateRoute>
                                <MyActivityPage />
                            </PrivateRoute>
                        }
                    />

                    {/* Redirect root to login or home */}
                    <Route path="/" element={<Navigate to="/login" replace />} />
                    {/* Fallback for unknown routes (optional) */}
                    <Route path="*" element={<Navigate to="/home" replace />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;