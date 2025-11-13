import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Filter, Heart } from 'lucide-react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function Restaurants({ favorites, onToggleFavorite, onAddToCart, onViewChange }) {
    const [restaurants, setRestaurants] = useState([]);
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('All');
    const [showFilters, setShowFilters] = useState(false);

    const cuisineFilters = ['All', 'Hyderabadi', 'South Indian', 'North Indian', 'Street Food', 'Tandoori', 'Beverages', 'Veg Only'];

    useEffect(() => {
        fetchRestaurants();
    }, []);

    const fetchRestaurants = async () => {
        try {
            const response = await axios.get(`${API_URL}/restaurants`);
            setRestaurants(response.data);
        } catch (error) {
            console.error('Error fetching restaurants:', error);
        }
    };

    const filteredRestaurants = restaurants.filter(r => {
        const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.cuisine.toLowerCase().includes(searchQuery.toLowerCase());

        if (selectedFilter === 'All') return matchesSearch;
        if (selectedFilter === 'Veg Only') {
            return matchesSearch && r.menu.every(item => item.veg);
        }
        return matchesSearch && r.cuisine === selectedFilter;
    });

    if (selectedRestaurant) {
        return (
            <div>
                <button
                    onClick={() => setSelectedRestaurant(null)}
                    className="mb-6 px-6 py-3 rounded-lg font-bold text-white transition-all"
                    style={{ background: '#FF5733' }}
                >
                    ← Back to Restaurants
                </button>

                <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="text-6xl">{selectedRestaurant.image}</div>
                            <div>
                                <h2 className="text-3xl font-bold mb-2" style={{ color: '#222222' }}>{selectedRestaurant.name}</h2>
                                <p className="mb-2" style={{ color: '#555555' }}>{selectedRestaurant.cuisine}</p>
                                <div className="flex gap-4">
                                    <span className="font-bold" style={{ color: '#4CAF50' }}>⭐ {selectedRestaurant.rating}</span>
                                    <span style={{ color: '#555555' }}>🕐 {selectedRestaurant.deliveryTime}</span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => onToggleFavorite(selectedRestaurant.id)}
                            className="bg-white p-3 rounded-full shadow-lg hover:scale-110 transition-transform"
                        >
                            <Heart
                                size={28}
                                style={{ color: '#FF5733' }}
                                fill={favorites.includes(selectedRestaurant.id) ? '#FF5733' : 'none'}
                            />
                        </button>
                    </div>
                </div>

                <h3 className="text-2xl font-bold mb-6" style={{ color: '#222222' }}>Menu</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {selectedRestaurant.menu.map(item => (
                        <div key={item.id} className="bg-white rounded-xl shadow-lg p-6">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <h4 className="text-xl font-bold" style={{ color: '#222222' }}>{item.name}</h4>
                                        <span className={`text-xs px-2 py-1 rounded ${item.veg ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {item.veg ? '🟢 VEG' : '🔴 NON-VEG'}
                                        </span>
                                    </div>
                                    <p className="mb-3" style={{ color: '#555555' }}>{item.desc}</p>
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-2xl font-bold" style={{ color: '#FF5733' }}>₹{item.price}</span>
                                <button
                                    onClick={() => onAddToCart(item, selectedRestaurant.name)}
                                    className="px-6 py-2 rounded-lg font-bold text-white transition-all transform hover:scale-105"
                                    style={{ background: '#4CAF50' }}
                                >
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-6 space-y-4">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2" style={{ color: '#555555' }} size={20} />
                    <input
                        type="text"
                        placeholder="Search restaurants or cuisine..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 rounded-xl border-2 focus:outline-none focus:border-[#FF5733] text-lg"
                    />
                </div>

                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-white whitespace-nowrap"
                        style={{ background: '#FF5733' }}
                    >
                        <Filter size={18} />
                        Filters
                    </button>
                    {showFilters && cuisineFilters.map(filter => (
                        <button
                            key={filter}
                            onClick={() => setSelectedFilter(filter)}
                            className="px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-all"
                            style={{
                                background: selectedFilter === filter ? '#4CAF50' : 'white',
                                color: selectedFilter === filter ? 'white' : '#222222',
                                border: '2px solid',
                                borderColor: selectedFilter === filter ? '#4CAF50' : '#ddd'
                            }}
                        >
                            {filter}
                        </button>
                    ))}
                </div>
            </div>

            <h2 className="text-3xl font-bold mb-6" style={{ color: '#222222' }}>
                {selectedFilter === 'All' ? 'Popular Restaurants 🔥' : `${selectedFilter} Restaurants`}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRestaurants.map(restaurant => (
                    <div
                        key={restaurant.id}
                        className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all hover:scale-105 hover:shadow-2xl relative"
                    >
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onToggleFavorite(restaurant.id);
                            }}
                            className="absolute top-4 right-4 z-10 bg-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform"
                        >
                            <Heart
                                size={22}
                                style={{ color: '#FF5733' }}
                                fill={favorites.includes(restaurant.id) ? '#FF5733' : 'none'}
                            />
                        </button>
                        <div
                            onClick={() => setSelectedRestaurant(restaurant)}
                            className="cursor-pointer"
                        >
                            <div className="p-6 text-center" style={{ background: 'linear-gradient(135deg, #FFE5CC 0%, #FFF8F0 100%)' }}>
                                <div className="text-7xl mb-3">{restaurant.image}</div>
                            </div>
                            <div className="p-5">
                                <h3 className="text-xl font-bold mb-2" style={{ color: '#222222' }}>{restaurant.name}</h3>
                                <p className="mb-3" style={{ color: '#555555' }}>{restaurant.cuisine}</p>
                                <div className="flex justify-between items-center">
                                    <span className="font-bold" style={{ color: '#4CAF50' }}>⭐ {restaurant.rating}</span>
                                    <span style={{ color: '#555555' }}>🕐 {restaurant.deliveryTime}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {filteredRestaurants.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">🔍</div>
                    <p className="text-xl" style={{ color: '#555555' }}>No restaurants found</p>
                </div>
            )}
        </div>
    );
}

export default Restaurants;