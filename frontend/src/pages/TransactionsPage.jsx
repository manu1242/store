import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Transactions.css";

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedTransactions, setSelectedTransactions] = useState([]);
  const [searchName, setSearchName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/categories");
        setCategories(response.data);
        setLoadingCategories(false);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setLoadingCategories(false);
      }
    };

    const fetchTransactions = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/transactions");
        setTransactions(response.data);
        setFilteredTransactions(response.data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchCategories();
    fetchTransactions();
  }, []);

  const handleFilter = () => {
    const start = startDate ? new Date(startDate).setHours(0, 0, 0, 0) : null;
    const end = endDate ? new Date(endDate).setHours(23, 59, 59, 999) : null;

    const filtered = transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date).getTime();
      const isInDateRange =
        (start && transactionDate >= start && transactionDate <= end) || !start;
      const matchesName =
        searchName === "" || transaction.name.toLowerCase().includes(searchName.toLowerCase());

      return isInDateRange && matchesName;
    });

    setFilteredTransactions(filtered);
  };

  const handleSelectTransaction = (index) => {
    setSelectedTransactions((prevSelected) =>
      prevSelected.includes(index)
        ? prevSelected.filter((id) => id !== index)
        : [...prevSelected, index]
    );
  };

  const handleDeleteTransactions = () => {
    const updatedTransactions = transactions.filter(
      (_, index) => !selectedTransactions.includes(index)
    );
    setTransactions(updatedTransactions);
    setFilteredTransactions(updatedTransactions);
    localStorage.setItem("transactions", JSON.stringify(updatedTransactions));
    setSelectedTransactions([]);
  };

  const handlePrint = () => {
    const transactionsToPrint = selectedTransactions.length
      ? selectedTransactions.map((index) => filteredTransactions[index])
      : filteredTransactions;

    const groupedTransactions = transactionsToPrint.reduce((acc, transaction) => {
      const name = transaction.name;
      if (!acc[name]) {
        acc[name] = [];
      }
      acc[name].push(transaction);
      return acc;
    }, {});

    const printWindow = window.open("", "PRINT");
    printWindow.document.write(`
      <html>
      <head>
        <title>Transactions</title>
        <style>
          body { font-family: Arial, sans-serif; }
          table { border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          .header { text-align: center; margin-bottom: 20px; font-size: 24px; }
          .transaction { page-break-before: always; }
        </style>
      </head>
      <body>
        ${Object.keys(groupedTransactions)
          .map((name) => {
            const transactionGroup = groupedTransactions[name];
            return `
              <div class="transaction">
                <div class="header">
                  <h1>Transactions of ${name}</h1>
                  <p>Date: ${new Date().toLocaleString()}</p>
                </div>
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Products</th>
                      <th>Price</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${transactionGroup
                      .map(
                        (transaction) => `
                          <tr>
                            <td>${transaction.name}</td>
                            <td>${getCategoryName(transaction.category)}</td>
                            <td>
                              ${transaction.products
                                .map((prod) => `${prod.name} (${prod.quantity})`)
                                .join(", ")}
                            </td>
                            <td>
                              ₹${transaction.products.reduce(
                                (total, prod) => total + prod.total,
                                0
                              )}
                            </td>
                            <td>${new Date(transaction.date).toLocaleString()}</td>
                          </tr>
                        `
                      )
                      .join("")}
                  </tbody>
                </table>
              </div>
            `;
          })
          .join("")}
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat._id === categoryId);
    return category ? category.name : "Unknown Category";
  };

  return (
    <div>
      <h1>Transactions</h1>
      <div className="filter">
        <label>Start Date:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <label>End Date:</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <label>Search by Name:</label>
        <input
          type="text"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          placeholder="Search by name"
        />
        <button onClick={handleFilter}>Filter</button>
      </div>

      {loadingCategories ? (
        <p>Loading categories...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Select</th>
              <th>Name</th>
              <th>Category</th>
              <th>Products</th>
              <th>Total Price</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((transaction, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedTransactions.includes(index)}
                      onChange={() => handleSelectTransaction(index)}
                    />
                  </td>
                  <td>{transaction.name}</td>
                  <td>{getCategoryName(transaction.category)}</td>
                  <td>
                    {transaction.products
                      .map((prod) => `${prod.name} (${prod.quantity})`)
                      .join(", ")}
                  </td>
                  <td>
                    ₹{transaction.products.reduce((total, prod) => total + prod.total, 0)}
                  </td>
                  <td>{new Date(transaction.date).toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No transactions found for the selected filters.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      <div className="button">
        <button onClick={handleDeleteTransactions}>Delete Selected Transactions</button>
        <button onClick={handlePrint}>Print Transactions</button>
        <button onClick={() => navigate("/")}>Go to Home</button>
      </div>
    </div>
  );
};

export default TransactionsPage;
