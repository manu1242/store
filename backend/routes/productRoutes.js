const express = require('express');
const { addProduct, addProductsBulk, getProducts, searchProducts } = require('../controllers/productController');
const router = express.Router();

router.post('/', addProduct);
router.post('/', async (req, res) => {
    try {
      const { name, price, category } = req.body;
      if (!name || !price || !category) {
        return res.status(400).json({ error: 'All fields are required' });
      }
  
      const newProduct = new Product({ name, price, category });
      await newProduct.save();
      res.status(201).json(newProduct); 
    } catch (err) {
      res.status(500).json({ error: 'Failed to add product' });
    }
  });
router.get('/', getProducts);
router.post('/bulk', addProductsBulk);
router.get('/search', searchProducts); 

module.exports = router;
