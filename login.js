import React, { useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function Login({ onLogin }) {
    const [isSignup, setIsSignup] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const endpoint = isSignup ? '/auth/register' : '/auth/login';
            const payload = isSignup ? formData : { email: formData.email, password: formData.password };

            const response = await axios.post(`${API_URL}${endpoint}`, payload);

            onLogin(response.data.user, response.data.token);
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4"
            style={{ background: 'linear-gradient(135deg, #FFF8F0 0%, #FFE5CC 100%)' }}>
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="text-6xl mb-4">🍛</div>
                    <h1 className="text-4xl font-bold mb-2" style={{ color: '#FF5733' }}>Desi Delights</h1>
                    <p style={{ color: '#555555' }}>Authentic Indian food delivered</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                        {error}
                    </div>
                )}

                <div className="space-y-4">
                    {isSignup && (
                        <div>
                            <label className="block mb-2 font-semibold" style={{ color: '#222222' }}>Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full p-3 border-2 rounded-lg focus:outline-none focus:border-[#FF5733]"
                                placeholder="Your name"
                            />
                        </div>
                    )}
                    <div>
                        <label className="block mb-2 font-semibold" style={{ color: '#222222' }}>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full p-3 border-2 rounded-lg focus:outline-none focus:border-[#FF5733]"
                            placeholder="your@email.com"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 font-semibold" style={{ color: '#222222' }}>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full p-3 border-2 rounded-lg focus:outline-none focus:border-[#FF5733]"
                            placeholder="••••••••"
                        />
                    </div>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full py-3 rounded-lg font-bold text-white transition-all transform hover:scale-105 disabled:opacity-50"
                        style={{ background: '#FF5733' }}
                    >
                        {loading ? 'Loading...' : (isSignup ? 'Sign Up' : 'Login')}
                    </button>
                    <p className="text-center" style={{ color: '#555555' }}>
                        {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
                        <button
                            onClick={() => {
                                setIsSignup(!isSignup);
                                setError('');
                                setFormData({ name: '', email: '', password: '' });
                            }}
                            className="font-bold"
                            style={{ color: '#FFC300' }}
                        >
                            {isSignup ? 'Login' : 'Sign up'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;