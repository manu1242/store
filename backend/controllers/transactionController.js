const Transaction = require('../models/transactionModel');

const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching transactions' });
  }
};

const createTransaction = async (req, res) => {
  try {
    const { name, category, products, totalAmount } = req.body;

    if (!name || !category || !products || !totalAmount) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const transaction = new Transaction({
      name,
      category,
      products,
      totalAmount,
    });

    const savedTransaction = await transaction.save();
    res.status(201).json(savedTransaction);
  } catch (error) {
    res.status(500).json({ message: 'Error creating transaction' });
  }
};

const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTransaction = await Transaction.findByIdAndDelete(id);

    if (!deletedTransaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.status(200).json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting transaction' });
  }
};

module.exports = {
  getTransactions,
  createTransaction,
  deleteTransaction,
};
