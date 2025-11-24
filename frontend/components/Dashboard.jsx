import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [kpis, setKpis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchKpis = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/dashboard/kpis', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setKpis(response.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch KPIs');
      } finally {
        setLoading(false);
      }
    };

    fetchKpis();
  }, []);

  return (
    <div className="p-8 space-y-8">
      {/* Heading */}
      <h1 className="text-3xl font-bold text-dark-text">Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading && <p className="text-dark-text-secondary">Loading KPIs...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {kpis && (
          <>
            <div className="app-card">
              <h2 className="text-xl font-semibold">Total Stock</h2>
              <p className="text-2xl font-bold">{kpis.totalStock}</p>
            </div>
            <div className="app-card">
              <h2 className="text-xl font-semibold">Low Stock Count</h2>
              <p className="text-2xl font-bold">{kpis.lowStockCount}</p>
            </div>
            <div className="app-card">
              <h2 className="text-xl font-semibold">Pending Receipts</h2>
              <p className="text-2xl font-bold">
                {kpis.documentCounts.RECEIPT_Draft + kpis.documentCounts.RECEIPT_Waiting || 0}
              </p>
            </div>
            <div className="app-card">
              <h2 className="text-xl font-semibold">Pending Deliveries</h2>
              <p className="text-2xl font-bold">
                {kpis.documentCounts.DELIVERY_Draft +
                  kpis.documentCounts.DELIVERY_Waiting +
                  kpis.documentCounts.DELIVERY_Ready || 0}
              </p>
            </div>
            <div className="app-card">
              <h2 className="text-xl font-semibold">Pending Transfers</h2>
              <p className="text-2xl font-bold">
                {kpis.documentCounts.TRANSFER_Draft + kpis.documentCounts.TRANSFER_Waiting || 0}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Filters Section */}
      <div className="app-card p-6">
        <h2 className="text-xl font-semibold mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="app-label">Document Type</label>
            <select className="app-select">
              <option value="">All</option>
              <option value="RECEIPT">Receipt</option>
              <option value="DELIVERY">Delivery</option>
              <option value="TRANSFER">Transfer</option>
              <option value="ADJUSTMENT">Adjustment</option>
            </select>
          </div>
          <div>
            <label className="app-label">Status</label>
            <select className="app-select">
              <option value="">All</option>
              <option value="Draft">Draft</option>
              <option value="Waiting">Waiting</option>
              <option value="Ready">Ready</option>
              <option value="Done">Done</option>
              <option value="Canceled">Canceled</option>
            </select>
          </div>
          <div>
            <label className="app-label">Warehouse</label>
            <select className="app-select">
              <option value="">All</option>
              <option value="1">Warehouse 1</option>
              <option value="2">Warehouse 2</option>
            </select>
          </div>
          <div>
            <label className="app-label">Category</label>
            <select className="app-select">
              <option value="">All</option>
              <option value="Electronics">Electronics</option>
              <option value="Furniture">Furniture</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;