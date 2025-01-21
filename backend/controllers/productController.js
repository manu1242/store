const Product = require('../models/Product');
const mongoose = require('mongoose');

const addProduct = async (req, res) => {
  try {
    const { name, price, category } = req.body;
    const product = new Product({ name, price, category });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const addProductsBulk = async (req, res) => {
  try {
    if (!Array.isArray(products)) {
      return res.status(400).json({ message: "Input must be an array of products." });
    }
    const result = await Product.insertMany(products);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('category', 'name');
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const searchProducts = async (req, res) => {
  const { term } = req.query; 

  try {
    // Search for products by name only
    const products = await Product.find({
      name: { $regex: term, $options: 'i' }, 
    });

    if (products.length === 0) {
      return res.status(404).json({ message: 'No products found' });
    }

    res.status(200).json(products);
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({ message: error.message });
  }
};


module.exports = { addProduct, addProductsBulk, getProducts,searchProducts };
