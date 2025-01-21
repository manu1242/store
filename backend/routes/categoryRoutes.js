const express = require('express');
const { addCategory, getCategories } = require('../controllers/categoryController');
const router = express.Router();


router.get('/', getCategories);


router.post('/', addCategory);
router.post('/', async (req, res) => {
    try {
      const { name } = req.body;
      if (!name) return res.status(400).json({ error: 'Category name is required' });
      
      const newCategory = new Category({ name });
      await newCategory.save();
      res.status(201).json(newCategory); 
    } catch (err) {
      res.status(500).json({ error: 'Failed to create category' });
    }
  });

module.exports = router;
