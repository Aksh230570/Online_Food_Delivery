import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Login from './components/Login';
import Restaurants from './components/Restaurants';
import Cart from './components/Cart';
import { ShoppingCart, User, LogOut, Heart, Clock } from 'lucide-react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function App() {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [view, setView] = useState('restaurants');
    const [cart, setCart] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [orderHistory, setOrderHistory] = useState([]);

    useEffect(() => {
        if (token) {
            const userData = JSON.parse(localStorage.getItem('user'));
            setUser(userData);
            fetchFavorites();
            fetchOrders();
        }
    }, [token]);

    const fetchFavorites = async () => {
        try {
            const response = await axios.get(`${API_URL}/favorites`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFavorites(response.data);
        } catch (error) {
            console.error('Error fetching favorites:', error);
        }
    };

    const fetchOrders = async () => {
        try {
            const response = await axios.get(`${API_URL}/orders`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrderHistory(response.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const handleLogin = (userData, authToken) => {
        setUser(userData);
        setToken(authToken);
        localStorage.setItem('token', authToken);
        localStorage.setItem('user', JSON.stringify(userData));
        setView('restaurants');
    };

    const handleLogout = () => {
        setUser(null);
        setToken(null);
        setCart([]);
        setFavorites([]);
        setOrderHistory([]);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setView('login');
    };

    const addToCart = (item, restaurantName) => {
        const existing = cart.find(c => c.id === item.id);
        if (existing) {
            setCart(cart.map(c => c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c));
        } else {
            setCart([...cart, { ...item, quantity: 1, restaurantName }]);
        }
    };

    const updateQuantity = (itemId, delta) => {
        setCart(cart.map(c => {
            if (c.id === itemId) {
                const newQty = c.quantity + delta;
                return newQty > 0 ? { ...c, quantity: newQty } : null;
            }
            return c;
        }).filter(Boolean));
    };

    const removeFromCart = (itemId) => {
        setCart(cart.filter(c => c.id !== itemId));
    };

    const toggleFavorite = async (restaurantId) => {
        try {
            if (favorites.includes(restaurantId)) {
                await axios.delete(`${API_URL}/favorites/${restaurantId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setFavorites(favorites.filter(id => id !== restaurantId));
            } else {
                await axios.post(`${API_URL}/favorites`,
                    { restaurantId },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setFavorites([...favorites, restaurantId]);
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
        }
    };

    const placeOrder = async (address) => {
        try {
            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

            await axios.post(`${API_URL}/orders`,
                {
                    items: cart,
                    total,
                    address
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setCart([]);
            fetchOrders();
            return true;
        } catch (error) {
            console.error('Error placing order:', error);
            return false;
        }
    };

    if (!token) {
        return <Login onLogin={handleLogin} />;
    }

    return (
        <div className="min-h-screen" style={{ background: '#FFF8F0' }}>
            <header className="sticky top-0 z-50 shadow-lg" style={{ background: '#FF5733' }}>
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="text-4xl">🍛</div>
                        <h1 className="text-2xl font-bold text-white">Desi Delights</h1>
                    </div>

                    <div className="flex items-center gap-2 md:gap-4">
                        <button
                            onClick={() => setView('favorites')}
                            className="bg-white p-2 rounded-full hover:bg-[#FFC300] transition-colors relative"
                        >
                            <Heart size={20} style={{ color: '#FF5733' }} fill={favorites.length > 0 ? '#FF5733' : 'none'} />
                            {favorites.length > 0 && (
                                <span className="absolute -top-1 -right-1 bg-[#4CAF50] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                    {favorites.length}
                                </span>
                            )}
                        </button>
                        <button
                            onClick={() => setView('orders')}
                            className="bg-white p-2 rounded-full hover:bg-[#FFC300] transition-colors relative"
                        >
                            <Clock size={20} style={{ color: '#FF5733' }} />
                            {orderHistory.length > 0 && (
                                <span className="absolute -top-1 -right-1 bg-[#4CAF50] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                    {orderHistory.length}
                                </span>
                            )}
                        </button>
                        <div className="hidden md:flex items-center gap-2 bg-white px-4 py-2 rounded-full">
                            <User size={20} style={{ color: '#FF5733' }} />
                            <span className="font-semibold" style={{ color: '#222222' }}>{user?.name}</span>
                        </div>
                        <button
                            onClick={() => setView('cart')}
                            className="relative bg-white p-2 rounded-full hover:bg-[#FFC300] transition-colors"
                        >
                            <ShoppingCart size={20} style={{ color: '#FF5733' }} />
                            {cart.length > 0 && (
                                <span className="absolute -top-1 -right-1 bg-[#4CAF50] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                    {cart.length}
                                </span>
                            )}
                        </button>
                        <button
                            onClick={handleLogout}
                            className="bg-white p-2 rounded-full hover:bg-[#FFC300] transition-colors"
                        >
                            <LogOut size={20} style={{ color: '#FF5733' }} />
                        </button>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto p-4">
                {view === 'restaurants' && (
                    <Restaurants
                        favorites={favorites}
                        onToggleFavorite={toggleFavorite}
                        onAddToCart={addToCart}
                        onViewChange={setView}
                    />
                )}
                {view === 'cart' && (
                    <Cart
                        cart={cart}
                        onUpdateQuantity={updateQuantity}
                        onRemoveFromCart={removeFromCart}
                        onPlaceOrder={placeOrder}
                        onViewChange={setView}
                    />
                )}
                {view === 'orders' && (
                    <div>
                        <button
                            onClick={() => setView('restaurants')}
                            className="mb-6 px-6 py-3 rounded-lg font-bold text-white transition-all"
                            style={{ background: '#FF5733' }}
                        >
                            ← Back
                        </button>
                        <h2 className="text-3xl font-bold mb-6" style={{ color: '#222222' }}>Order History 📦</h2>
                        {orderHistory.length === 0 ? (
                            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                                <div className="text-6xl mb-4">📭</div>
                                <p className="text-xl" style={{ color: '#555555' }}>No orders yet</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {orderHistory.map(order => (
                                    <div key={order._id} className="bg-white rounded-xl shadow-lg p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-xl font-bold mb-2" style={{ color: '#222222' }}>
                                                    Order #{order._id.slice(-6)}
                                                </h3>
                                                <p style={{ color: '#555555' }}>
                                                    {new Date(order.createdAt).toLocaleDateString('en-IN')} at{' '}
                                                    {new Date(order.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                                <p className="mt-2" style={{ color: '#555555' }}>📍 {order.address}</p>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-2xl font-bold" style={{ color: '#4CAF50' }}>₹{order.total}</span>
                                                <p className="text-sm mt-1" style={{ color: '#4CAF50' }}>✓ Delivered</p>
                                            </div>
                                        </div>
                                        <div className="border-t pt-4">
                                            <h4 className="font-semibold mb-2" style={{ color: '#222222' }}>Items:</h4>
                                            {order.items.map((item, idx) => (
                                                <div key={idx} className="flex justify-between items-center py-2">
                                                    <span style={{ color: '#555555' }}>{item.quantity}x {item.name}</span>
                                                    <span style={{ color: '#222222' }}>₹{(item.price * item.quantity).toFixed(2)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;