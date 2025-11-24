import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LedgerView = () => {
  const [ledgerEntries, setLedgerEntries] = useState([]);
  const [filters, setFilters] = useState({
    docType: '',
    direction: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLedgerEntries = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/ledger', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: filters, // Pass filters as query parameters
        });
        setLedgerEntries(response.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch ledger entries');
      } finally {
        setLoading(false);
      }
    };

    fetchLedgerEntries();
  }, [filters]); // Refetch data when filters change

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-8 space-y-8">
      {/* Heading */}
      <h1 className="text-3xl font-bold text-dark-text">Inventory Movements</h1>

      {/* Filters */}
      <div className="app-card p-6">
        <h2 className="text-xl font-semibold mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label htmlFor="docType" className="app-label">Document Type</label>
            <select
              id="docType"
              name="docType"
              value={filters.docType}
              onChange={handleFilterChange}
              className="app-select w-full"
            >
              <option value="">All</option>
              <option value="RECEIPT">Receipt</option>
              <option value="DELIVERY">Delivery</option>
              <option value="TRANSFER">Transfer</option>
              <option value="ADJUSTMENT">Adjustment</option>
            </select>
          </div>
          <div>
            <label htmlFor="direction" className="app-label">Direction</label>
            <select
              id="direction"
              name="direction"
              value={filters.direction}
              onChange={handleFilterChange}
              className="app-select w-full"
            >
              <option value="">All</option>
              <option value="IN">In</option>
              <option value="OUT">Out</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error Handling */}
      {loading && <p className="text-dark-text-secondary">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Ledger Entries Table */}
      {!loading && ledgerEntries.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-dark-border">
            <thead>
              <tr className="bg-dark-surface text-dark-text">
                <th className="border border-dark-border p-2">Timestamp</th>
                <th className="border border-dark-border p-2">Product Name</th>
                <th className="border border-dark-border p-2">Document Ref</th>
                <th className="border border-dark-border p-2">Direction</th>
                <th className="border border-dark-border p-2">Quantity</th>
                <th className="border border-dark-border p-2">Source Warehouse</th>
                <th className="border border-dark-border p-2">Destination Warehouse</th>
              </tr>
            </thead>
            <tbody>
              {ledgerEntries.map((entry) => (
                <tr key={entry.id} className="hover:bg-dark-bg">
                  <td className="border border-dark-border p-2">{new Date(entry.timestamp).toLocaleString()}</td>
                  <td className="border border-dark-border p-2">{entry.productName}</td>
                  <td className="border border-dark-border p-2">
                    {entry.documentType} (ID: {entry.id})
                  </td>
                  <td className="border border-dark-border p-2">{entry.direction}</td>
                  <td className="border border-dark-border p-2">{entry.quantity}</td>
                  <td className="border border-dark-border p-2">{entry.sourceWarehouse}</td>
                  <td className="border border-dark-border p-2">{entry.destWarehouse}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* No Entries */}
      {!loading && ledgerEntries.length === 0 && (
        <p className="text-dark-text-secondary">No ledger entries found.</p>
      )}
    </div>
  );
};

export default LedgerView;