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
        <div className="min-h-screen flex items-center justify-center bg-dark-bg">
            <div className="app-card w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4 text-center">
                    {isLogin ? 'Sign In' : 'Sign Up'}
                </h2>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <input
                            type="text"
                            name="name"
                            placeholder="Name"
                            value={formData.name}
                            onChange={handleChange}
                            className="app-input w-full"
                        />
                    )}
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        className="app-input w-full"
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        className="app-input w-full"
                    />
                    {!isLogin && (
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="app-select w-full"
                        >
                            <option value="MANAGER">Manager</option>
                            <option value="WAREHOUSE STAFF">Warehouse Staff</option>
                            <option value="ADMIN">Admin</option>
                        </select>
                    )}
                    <button
                        type="submit"
                        className="btn-primary w-full"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Loading...' : isLogin ? 'Sign In' : 'Sign Up'}
                    </button>
                </form>
                <p className="text-center mt-4">
                    {isLogin ? 'Don’t have an account?' : 'Already have an account?'}{' '}
                    <button
                        type="button"
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-dark-accent hover:underline"
                    >
                        {isLogin ? 'Sign Up' : 'Sign In'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default AuthForm;