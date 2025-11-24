import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/products', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProducts(response.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="p-8 space-y-8">
      {/* Heading */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-dark-text">Product List</h1>
        <Link to="/products/new" className="btn-primary">
          Add New Product
        </Link>
      </div>

      {/* Error Handling */}
      {loading && <p className="text-dark-text-secondary">Loading products...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Product Table */}
      {!loading && products.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-dark-border">
            <thead>
              <tr className="bg-dark-surface text-dark-text">
                <th className="border border-dark-border p-2">Name</th>
                <th className="border border-dark-border p-2">SKU</th>
                <th className="border border-dark-border p-2">Category</th>
                <th className="border border-dark-border p-2">UoM</th>
                <th className="border border-dark-border p-2">Total Stock</th>
                <th className="border border-dark-border p-2">Stock by Location</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-dark-bg">
                  <td className="border border-dark-border p-2">{product.name}</td>
                  <td className="border border-dark-border p-2">{product.sku}</td>
                  <td className="border border-dark-border p-2">{product.category?.name || 'N/A'}</td>
                  <td className="border border-dark-border p-2">{product.uom}</td>
                  <td className="border border-dark-border p-2">{product.totalStock}</td>
                  <td className="border border-dark-border p-2">
                    {product.stockByLocation.map((stock, index) => (
                      <div key={index}>
                        {stock.warehouseName}: {stock.quantity}
                      </div>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* No Products */}
      {!loading && products.length === 0 && (
        <p className="text-dark-text-secondary">No products found.</p>
      )}
    </div>
  );
};

export default ProductList;