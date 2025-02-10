import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./editPage.css";


const EditProduct = ({ productId }) => {
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: ''
  });
  const [newCategory, setNewCategory] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('https://store-server-xi.vercel.app/api/categories');
        setCategories(response.data);
      } catch (err) {
        setError('Failed to load categories');
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`https://store-server-xi.vercel.app/api/products/${productId}`);
        setProduct(response.data);
        setFormData({
          name: response.data.name,
          price: response.data.price,
          category: response.data.category
        });
      } catch (err) {
        setError('Error fetching product');
      }
    };
    if (productId) fetchProduct();
  }, [productId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      if (newCategory) {
        await axios.post('https://store-server-xi.vercel.app/api/categories', { name: newCategory });
        setNewCategory('');
        alert('Category added successfully!');
        const response = await axios.get('https://store-server-xi.vercel.app/api/categories');
        setCategories(response.data);
      }
    } catch (err) {
      setError('Failed to add category');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`https://store-server-xi.vercel.app/api/products/${productId}`, formData);
      alert('Product updated successfully!');
    } catch (err) {
      setError('Failed to update product');
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://store-server-xi.vercel.app/api/products', formData);
      alert('Product added successfully!');
      setFormData({
        name: '',
        price: '',
        category: ''
      });
    } catch (err) {
      setError('Failed to add product');
    }
  };

  if (error) return <div>{error}</div>;

  return (
    <div className="edit-product">
      {product ? (
        <>
          <h1>Edit Product</h1>
          <form onSubmit={handleSubmit}>
            <div>
              <label>Product Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Price</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit">Save Changes</button>
          </form>
        </>
      ) : (
        <div>Product Details</div>
      )}

      <h2>Add a New Product</h2>
      <form onSubmit={handleAddProduct}>
        <div>
          <label>Product Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Price</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Add Product</button>
      </form>

      <h2>Add a New Category</h2>
      <form onSubmit={handleAddCategory}>
        <div>
          <label>Category Name</label>
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            required
          />
        </div>
        <button type="submit">Add Category</button>
      </form>
    </div>
  );
};

export default EditProduct;
