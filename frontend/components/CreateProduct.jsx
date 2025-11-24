import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateProduct = () => {
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    categoryId: '',
    uom: '',
    initialStock: {
      quantity: '',
      warehouseId: '',
    },
  });
  const [categories, setCategories] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLookupData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/products/lookup', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCategories(response.data.categories);
        setWarehouses(response.data.warehouses);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch lookup data');
      } finally {
        setLoading(false);
      }
    };

    fetchLookupData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'quantity' || name === 'warehouseId') {
      setFormData((prev) => ({
        ...prev,
        initialStock: {
          ...prev.initialStock,
          [name]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:3000/products', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Product created successfully!');
      navigate('/products');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create product');
    }
  };

  return (
    <div className="p-8 space-y-8">
      {/* Heading */}
      <h1 className="text-3xl font-bold text-dark-text">Create Product</h1>

      {/* Error Handling */}
      {loading && <p className="text-dark-text-secondary">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Form */}
      {!loading && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="app-label">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="app-input w-full"
              required
            />
          </div>
          <div>
            <label htmlFor="sku" className="app-label">SKU</label>
            <input
              type="text"
              id="sku"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              className="app-input w-full"
              required
            />
          </div>
          <div>
            <label htmlFor="categoryId" className="app-label">Category</label>
            <select
              id="categoryId"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              className="app-select w-full"
              required
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="uom" className="app-label">Unit of Measure (UoM)</label>
            <input
              type="text"
              id="uom"
              name="uom"
              value={formData.uom}
              onChange={handleChange}
              className="app-input w-full"
              required
            />
          </div>
          <div>
            <label htmlFor="quantity" className="app-label">Initial Stock Quantity (Optional)</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={formData.initialStock.quantity}
              onChange={handleChange}
              className="app-input w-full"
            />
          </div>
          <div>
            <label htmlFor="warehouseId" className="app-label">Warehouse (Optional)</label>
            <select
              id="warehouseId"
              name="warehouseId"
              value={formData.initialStock.warehouseId}
              onChange={handleChange}
              className="app-select w-full"
            >
              <option value="">Select a warehouse</option>
              {warehouses.map((warehouse) => (
                <option key={warehouse.id} value={warehouse.id}>
                  {warehouse.name}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn-primary w-full">
            Create Product
          </button>
        </form>
      )}
    </div>
  );
};

export default CreateProduct;