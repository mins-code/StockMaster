import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const Sidebar = ({ onLogout }) => {
  const location = useLocation();

  const links = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Products', path: '/products' },
    { name: 'Receipts', path: '/inventory/receipts' },
    { name: 'Deliveries', path: '/inventory/deliveries' },
    { name: 'Transfers', path: '/inventory/transfers' },
    { name: 'Adjustments', path: '/inventory/adjustments' },
    { name: 'Ledger', path: '/ledger' },
  ];

  return (
    <div className="w-64 bg-dark-surface h-screen border-r border-dark-border flex flex-col">
      {/* Branding */}
      <div className="p-4 text-2xl font-bold text-dark-text border-b border-dark-border">
        StockMaster
      </div>

      {/* Navigation Links */}
      <nav className="flex-grow p-4">
        <ul className="space-y-4">
          {links.map((link) => (
            <li key={link.path}>
              <NavLink
                to={link.path}
                className={`block text-dark-text-secondary hover:text-dark-accent ${
                  location.pathname === link.path ? 'font-bold text-dark-accent' : ''
                }`}
              >
                {link.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout Button */}
      <button
        onClick={onLogout}
        className="btn-danger mx-4 mb-4"
      >
        Logout
      </button>
    </div>
  );
};

export default Sidebar;