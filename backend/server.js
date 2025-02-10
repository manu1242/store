const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const connectDB = require('./config/db');
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const Product = require('./models/Product'); 
const Transaction = require('./models/transactionModel');
const authRoutes = require('./routes/authRoutes');

dotenv.config();


connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


app.get('/api/products/category/:categoryId', async (req, res) => {
  try {
    const { categoryId } = req.params;
    const products = await Product.find({ category: categoryId });

    if (!products || products.length === 0) {
      return res.status(404).json({ message: 'No products found for this category' });
    }

    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products by category:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


app.post('/api/transactions', async (req, res) => {
  const { name, category, products } = req.body;

  if (!name || !category || !products || products.length === 0) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const totalAmount = products.reduce((acc, product) => acc + (product.total || 0), 0);
    const newTransaction = new Transaction({
      name,
      category,
      products,
      totalAmount,
      date: new Date(),
    });

    await newTransaction.save();
    res.status(201).json({ 
      message: 'Transaction saved successfully', 
      transaction: newTransaction 
    });
  } catch (error) {
    console.error('Error saving transaction:', error.message);
    res.status(500).json({ message: 'Error saving transaction' });
  }
});


app.get("/api/transactions", async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.status(200).json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error.message);
    res.status(500).json({ message: "Error fetching transactions" });
  }
});
app.get('/',async(req,res)=>{
  res.send("Its Working Priya")
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
