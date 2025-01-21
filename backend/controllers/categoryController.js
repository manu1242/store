const Category = require('../models/Category');

const addCategory = async (req, res) => {
  const { name } = req.body;
  const category = new Category({ name });
  await category.save();
  res.status(201).json(category);
};

const getCategories = async (req, res) => {
  const categories = await Category.find();
  res.status(200).json(categories);
};

module.exports = { addCategory, getCategories };
