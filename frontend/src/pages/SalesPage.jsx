import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./SalesPage.css";

const HomePage = () => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [addedProducts, setAddedProducts] = useState([]);
  const [transactionSaved, setTransactionSaved] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/categories");
        setCategories(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (category) {
      const fetchProducts = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/products/category/${category}`
          );
          setProducts(response.data);
        } catch (error) {
          console.error(error);
        }
      };
      fetchProducts();
    } else {
      setProducts([]);
    }
  }, [category]);

  const handleAddProduct = () => {
    if (selectedProduct && quantity > 0) {
      const newProduct = {
        name: selectedProduct.name,
        price: selectedProduct.price,
        quantity: parseInt(quantity),
        total: selectedProduct.price * parseInt(quantity),
        date: new Date().toLocaleString(),
      };
      setAddedProducts((prevProducts) => [...prevProducts, newProduct]);
      setSelectedProduct(null);
      setQuantity("");
    }
  };

  const handleSaveTransaction = async () => {
    if (name && category && addedProducts.length > 0) {
      const totalAmount = addedProducts.reduce((acc, product) => acc + product.total, 0);
  
      const transaction = {
        name,
        category,
        products: addedProducts,
        totalAmount, // Ensure totalAmount is included
        date: new Date().toISOString(),
      };
  
      try {
        const response = await axios.post(
          "http://localhost:5000/api/transactions",
          transaction
        );
        if (response.status === 201) {
          setTransactionSaved(true);
          setName("");
          setCategory("");
          setAddedProducts([]);
          alert("Transaction saved successfully!");
        } else {
          alert("Failed to save transaction");
        }
      } catch (error) {
        console.error("Error saving transaction:", error);
        alert("Error saving transaction. Please try again.");
      }
    }
  };
  
  const handlePrintTransaction = () => {
    const printContent = document.querySelector(".printable").innerHTML;
    const printWindow = window.open("", "_blank");
    printWindow.document.open();
    printWindow.document.write(`
      <html>
        <head>
          <title>Transaction Details</title>
          <link rel="stylesheet" href="styles.css" />
        </head>
        <body>
          ${printContent}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
    printWindow.close();
  };

  return (
    <div className="homepage-container">
      <h1>Buying Page</h1>
      <div className="form-container">
        <label>Name:</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
        />
        <label>Category:</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
        <label>Product:</label>
        <select
          value={selectedProduct ? selectedProduct._id : ""}
          onChange={(e) =>
            setSelectedProduct(
              products.find((prod) => prod._id === e.target.value)
            )
          }
          disabled={!category}
        >
          <option value="">Select Product</option>
          {products.map((prod) => (
            <option key={prod._id} value={prod._id}>
              {prod.name} - ₹{prod.price}
            </option>
          ))}
        </select>
        {selectedProduct && (
          <>
            <div>
              <strong>Selected Product:</strong> {selectedProduct.name} - ₹
              {selectedProduct.price}
            </div>
            <label>Quantity:</label>
            <input
              type="number"
              value={quantity}
              min="1"
              onChange={(e) => setQuantity(e.target.value)}
            />
          </>
        )}
      </div>
      <div className="button-container">
        <button
          onClick={handleAddProduct}
          disabled={!quantity || !selectedProduct}
        >
          Add Product
        </button>
        <button onClick={handleSaveTransaction} disabled={!addedProducts.length}>
          Save Transaction
        </button>
        <button
          onClick={handlePrintTransaction}
          disabled={!addedProducts.length}
        >
          Print Transaction
        </button>
      </div>
      {addedProducts.length > 0 && !transactionSaved && (
        <div className="products-list printable">
          <h2>Transaction Details - {name}</h2>
          <p>
            <strong>Name:</strong> {name}
          </p>
          <p>
            <strong>Date:</strong> {new Date().toLocaleString()}
          </p>
          <table>
            <thead>
              <tr>
                <th>Serial No.</th>
                <th>Product Name</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total Price</th>
              </tr>
            </thead>
            <tbody>
              {addedProducts.map((product, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{product.name}</td>
                  <td>₹{product.price}</td>
                  <td>{product.quantity}</td>
                  <td>₹{product.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {transactionSaved && (
        <div className="transaction-saved">
          <h2>Transaction Saved!</h2>
          <button onClick={() => setTransactionSaved(false)}>
            Clear Transaction
          </button>
          <button onClick={() => navigate("/transactions")}>
            View Transaction
          </button>
        </div>
      )}
    </div>
  );
};

export default HomePage;
