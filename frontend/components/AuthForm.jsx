import React, { useState } from 'react';
import axios from 'axios';

const AuthForm = ({ onAuthSuccess }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'MANAGER',
    });
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const url = isLogin
                ? 'http://localhost:3000/auth/login'
                : 'http://localhost:3000/auth/register';
            const response = await axios.post(url, formData);

            if (isLogin) {
                const { token } = response.data;
                localStorage.setItem('token', token);
                onAuthSuccess(token);
            } else {
                alert('Registration successful! Please log in.');
                setIsLogin(true);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-dark-bg p-6">
            <div className="app-card w-full max-w-xl p-8">
                <div className="text-center space-y-6">
                    <h1 className="app-heading">StockMaster</h1>
                    <p className="text-dark-text-secondary">
                        {isLogin ? 'Sign in to your account' : 'Create a new account'}
                    </p>
                </div>
                {error && <p className="text-red-500 text-center mb-6">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-8">
                    {!isLogin && (
                        <div>
                            <label htmlFor="name" className="app-label">Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                placeholder="Enter your name"
                                value={formData.name}
                                onChange={handleChange}
                                className="app-input w-full"
                            />
                        </div>
                    )}
                    <div>
                        <label htmlFor="email" className="app-label">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            className="app-input w-full"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="app-label">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            className="app-input w-full"
                        />
                    </div>
                    {!isLogin && (
                        <div>
                            <label htmlFor="role" className="app-label">Role</label>
                            <select
                                id="role"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="app-select w-full"
                            >
                                <option value="MANAGER">Manager</option>
                                <option value="WAREHOUSE STAFF">Warehouse Staff</option>
                                <option value="ADMIN">Admin</option>
                            </select>
                        </div>
                    )}
                    <button
                        type="submit"
                        className="btn-primary w-full"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Loading...' : isLogin ? 'Sign In' : 'Sign Up'}
                    </button>
                </form>
                <p className="text-center mt-6">
                    {isLogin ? 'Don’t have an account?' : 'Already have an account?'}{' '}
                    <button
                        type="button"
                        onClick={() => setIsLogin(!isLogin)}
                        className="btn-secondary"
                    >
                        {isLogin ? 'Sign Up' : 'Sign In'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default AuthForm;