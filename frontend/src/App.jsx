import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import Sidebar from '../components/Sidebar';
import Dashboard from '../components/Dashboard';
import ProductList from '../components/ProductList';
import CreateProduct from '../components/CreateProduct';
import Receipts from '../components/Receipts';
import Deliveries from '../components/Deliveries';
import Transfers from '../components/Transfers';
import Adjustments from '../components/Adjustments';
import LedgerView from '../components/LedgerView';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check localStorage for JWT token
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    // Remove token and reset state
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  const handleAuthSuccess = (token) => {
    // Set token and update state
    localStorage.setItem('token', token);
    setIsLoggedIn(true);
  };

  return (
    <BrowserRouter>
      {!isLoggedIn ? (
        // Logged-out rendering
        <div className="min-h-screen flex items-center justify-center bg-dark-bg">
          <Routes>
            <Route
              path="/auth"
              element={<AuthForm onAuthSuccess={handleAuthSuccess} />}
            />
            <Route path="*" element={<Navigate to="/auth" />} />
          </Routes>
        </div>
      ) : (
        // Logged-in rendering
        <div className="flex min-h-screen bg-dark-bg text-white">
          {/* Sidebar */}
          <Sidebar onLogout={handleLogout} />

          {/* Main Content */}
          <div className="flex-1 p-8 ml-64">
            <div className="space-y-8">
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/products" element={<ProductList />} />
                <Route path="/products/new" element={<CreateProduct />} />
                <Route path="/inventory/receipts" element={<Receipts />} />
                <Route path="/inventory/deliveries" element={<Deliveries />} />
                <Route path="/inventory/transfers" element={<Transfers />} />
                <Route path="/inventory/adjustments" element={<Adjustments />} />
                <Route path="/ledger" element={<LedgerView />} />
                <Route path="*" element={<Navigate to="/dashboard" />} />
              </Routes>
            </div>
          </div>
        </div>
      )}
    </BrowserRouter>
  );
};

export default App;