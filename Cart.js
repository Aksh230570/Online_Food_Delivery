import React, { useState } from 'react';
import { Plus, Minus, Trash2, CreditCard, CheckCircle } from 'lucide-react';

function Cart({ cart, onUpdateQuantity, onRemoveFromCart, onPlaceOrder, onViewChange }) {
    const [showPayment, setShowPayment] = useState(false);
    const [orderComplete, setOrderComplete] = useState(false);
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [address, setAddress] = useState('');

    const getTotalPrice = () => {
        return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);
    };

    const handlePayment = async () => {
        if (cardNumber && expiryDate && cvv && address) {
            const success = await onPlaceOrder(address);
            if (success) {
                setOrderComplete(true);
                setTimeout(() => {
                    setOrderComplete(false);
                    setShowPayment(false);
                    setCardNumber('');
                    setExpiryDate('');
                    setCvv('');
                    setAddress('');
                    onViewChange('restaurants');
                }, 3000);
            }
        }
    };

    if (orderComplete) {
        return (
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                    <div className="mb-6">
                        <CheckCircle size={80} className="mx-auto" style={{ color: '#4CAF50' }} />
                    </div>
                    <h2 className="text-4xl font-bold mb-4" style={{ color: '#4CAF50' }}>Order Confirmed! 🎉</h2>
                    <p className="text-xl mb-6" style={{ color: '#555555' }}>
                        Your delicious food is on the way!
                    </p>
                    <div className="text-6xl">🚚💨</div>
                </div>
            </div>
        );
    }

    if (showPayment) {
        return (
            <div className="max-w-2xl mx-auto">
                <button
                    onClick={() => setShowPayment(false)}
                    className="mb-6 px-6 py-3 rounded-lg font-bold text-white transition-all"
                    style={{ background: '#FF5733' }}
                >
                    ← Back to Cart
                </button>

                <div className="bg-white rounded-xl shadow-lg p-8">
                    <h2 className="text-3xl font-bold mb-6" style={{ color: '#222222' }}>Payment Details 💳</h2>

                    <div className="space-y-6">
                        <div>
                            <label className="block mb-2 font-semibold" style={{ color: '#222222' }}>Card Number</label>
                            <input
                                type="text"
                                value={cardNumber}
                                onChange={(e) => setCardNumber(e.target.value)}
                                placeholder="1234 5678 9012 3456"
                                className="w-full p-4 border-2 rounded-lg focus:outline-none focus:border-[#FF5733]"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block mb-2 font-semibold" style={{ color: '#222222' }}>Expiry Date</label>
                                <input
                                    type="text"
                                    value={expiryDate}
                                    onChange={(e) => setExpiryDate(e.target.value)}
                                    placeholder="MM/YY"
                                    className="w-full p-4 border-2 rounded-lg focus:outline-none focus:border-[#FF5733]"
                                />
                            </div>
                            <div>
                                <label className="block mb-2 font-semibold" style={{ color: '#222222' }}>CVV</label>
                                <input
                                    type="text"
                                    value={cvv}
                                    onChange={(e) => setCvv(e.target.value)}
                                    placeholder="123"
                                    className="w-full p-4 border-2 rounded-lg focus:outline-none focus:border-[#FF5733]"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block mb-2 font-semibold" style={{ color: '#222222' }}>Delivery Address</label>
                            <textarea
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="Enter your full address"
                                className="w-full p-4 border-2 rounded-lg focus:outline-none focus:border-[#FF5733]"
                                rows="3"
                            />
                        </div>

                        <div className="border-t-2 pt-6">
                            <div className="flex justify-between items-center mb-6">
                                <span className="text-2xl font-bold" style={{ color: '#222222' }}>Total Amount:</span>
                                <span className="text-3xl font-bold" style={{ color: '#FF5733' }}>₹{getTotalPrice()}</span>
                            </div>

                            <button
                                onClick={handlePayment}
                                className="w-full py-4 rounded-lg font-bold text-white text-xl transition-all transform hover:scale-105 flex items-center justify-center gap-3"
                                style={{ background: '#4CAF50' }}
                            >
                                <CreditCard size={24} />
                                Complete Payment
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <button
                onClick={() => onViewChange('restaurants')}
                className="mb-6 px-6 py-3 rounded-lg font-bold text-white transition-all"
                style={{ background: '#FF5733' }}
            >
                ← Continue Shopping
            </button>

            <h2 className="text-3xl font-bold mb-6" style={{ color: '#222222' }}>Your Cart 🛒</h2>

            {cart.length === 0 ? (
                <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                    <div className="text-6xl mb-4">🍽️</div>
                    <p className="text-xl" style={{ color: '#555555' }}>Your cart is empty</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {cart.map(item => (
                        <div key={item.id} className="bg-white rounded-xl shadow-lg p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h4 className="text-xl font-bold mb-1" style={{ color: '#222222' }}>{item.name}</h4>
                                    <p style={{ color: '#555555' }}>{item.restaurantName}</p>
                                </div>
                                <button
                                    onClick={() => onRemoveFromCart(item.id)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => onUpdateQuantity(item.id, -1)}
                                        className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white"
                                        style={{ background: '#FF5733' }}
                                    >
                                        <Minus size={16} />
                                    </button>
                                    <span className="text-xl font-bold" style={{ color: '#222222' }}>{item.quantity}</span>
                                    <button
                                        onClick={() => onUpdateQuantity(item.id, 1)}
                                        className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white"
                                        style={{ background: '#4CAF50' }}
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>
                                <span className="text-2xl font-bold" style={{ color: '#FF5733' }}>
                                    ₹{(item.price * item.quantity).toFixed(2)}
                                </span>
                            </div>
                        </div>
                    ))}

                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-2xl font-bold" style={{ color: '#222222' }}>Total:</span>
                            <span className="text-3xl font-bold" style={{ color: '#FF5733' }}>₹{getTotalPrice()}</span>
                        </div>
                        <button
                            onClick={() => setShowPayment(true)}
                            className="w-full py-4 rounded-lg font-bold text-white text-xl transition-all transform hover:scale-105"
                            style={{ background: '#4CAF50' }}
                        >
                            Proceed to Checkout 🚀
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Cart;