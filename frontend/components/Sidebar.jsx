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
    <div className="w-64 h-screen fixed top-0 left-0 bg-dark-surface border-r border-dark-border flex flex-col">
      {/* Branding */}
      <div className="p-6 text-3xl font-bold text-white border-b border-dark-border">
        StockMaster
      </div>

      {/* Navigation Links */}
      <nav className="flex-grow p-4">
        <ul className="space-y-4">
          {links.map((link) => (
            <li key={link.path}>
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  `block px-4 py-2 rounded-md ${
                    isActive
                      ? 'bg-gradient-primary text-white shadow-glow'
                      : 'text-dark-text-secondary hover:text-dark-accent'
                  }`
                }
              >
                {link.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-dark-border">
        <button
          onClick={onLogout}
          className="btn-danger w-full"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;