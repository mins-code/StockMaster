import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Receipts = () => {
  const [documents, setDocuments] = useState([]);
  const [formData, setFormData] = useState({
    targetWarehouseId: '',
    lines: [],
  });
  const [warehouses, setWarehouses] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');

        // Fetch warehouses
        const warehouseResponse = await axios.get('http://localhost:3000/products/lookup', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setWarehouses(warehouseResponse.data.warehouses);

        // Fetch products
        const productResponse = await axios.get('http://localhost:3000/products', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProducts(productResponse.data);

        // Fetch documents
        const documentResponse = await axios.get('http://localhost:3000/inventory/RECEIPT', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDocuments(documentResponse.data);

        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLineChange = (index, field, value) => {
    const updatedLines = [...formData.lines];
    updatedLines[index][field] = value;
    setFormData((prev) => ({ ...prev, lines: updatedLines }));
  };

  const addLine = () => {
    setFormData((prev) => ({
      ...prev,
      lines: [...prev.lines, { productId: '', quantity: '' }],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:3000/inventory/RECEIPT', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Receipt created successfully!');
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create receipt');
    }
  };

  const handleValidate = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:3000/inventory/RECEIPT/${id}/validate`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Receipt validated successfully!');
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to validate receipt');
    }
  };

  return (
    <div className="p-8 space-y-8">
      {/* Heading */}
      <h1 className="text-3xl font-bold text-dark-text">Receipts</h1>

      {/* Error Handling */}
      {loading && <p className="text-dark-text-secondary">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Create Receipt Form */}
      <div className="app-card p-6">
        <h2 className="text-xl font-semibold mb-4">Create Receipt</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="targetWarehouseId" className="app-label">Target Warehouse</label>
            <select
              id="targetWarehouseId"
              name="targetWarehouseId"
              value={formData.targetWarehouseId}
              onChange={handleFormChange}
              className="app-select w-full"
              required
            >
              <option value="">Select a warehouse</option>
              {warehouses.map((warehouse) => (
                <option key={warehouse.id} value={warehouse.id}>
                  {warehouse.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <h3 className="app-label">Document Lines</h3>
            {formData.lines.map((line, index) => (
              <div key={index} className="flex space-x-4 mb-4">
                <select
                  value={line.productId}
                  onChange={(e) => handleLineChange(index, 'productId', e.target.value)}
                  className="app-select flex-1"
                  required
                >
                  <option value="">Select a product</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  value={line.quantity}
                  onChange={(e) => handleLineChange(index, 'quantity', e.target.value)}
                  className="app-input flex-1"
                  placeholder="Quantity"
                  required
                />
              </div>
            ))}
            <button type="button" onClick={addLine} className="btn-secondary">
              Add Line
            </button>
          </div>
          <button type="submit" className="btn-primary w-full">
            Create Receipt
          </button>
        </form>
      </div>

      {/* Document List */}
      <div className="app-card p-6">
        <h2 className="text-xl font-semibold mb-4">Receipts List</h2>
        <table className="w-full border-collapse border border-dark-border">
          <thead>
            <tr className="bg-dark-surface text-dark-text">
              <th className="border border-dark-border p-2">ID</th>
              <th className="border border-dark-border p-2">Status</th>
              <th className="border border-dark-border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => (
              <tr key={doc.id} className="hover:bg-dark-bg">
                <td className="border border-dark-border p-2">{doc.id}</td>
                <td className="border border-dark-border p-2">{doc.status}</td>
                <td className="border border-dark-border p-2">
                  {doc.status === 'Draft' && (
                    <button
                      onClick={() => handleValidate(doc.id)}
                      className="btn-primary"
                    >
                      Validate
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Receipts;