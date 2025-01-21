import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from './Navbar/Navbar';
import HomePage from "./components/HomePage";
import TransactionsPage from "./pages/TransactionsPage";
import SalesPage from './pages/SalesPage';
import EditProduct from './pages/editProduct';
import Auth from "./components/Auth"; // Import the combined Auth component

// Function to check if user is authenticated
const isAuthenticated = () => {
  return localStorage.getItem("loggedInUser") !== null;
};

// Protected Route Component
const ProtectedRoute = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Replacing individual Login and Signup components with Auth component */}
        <Route path="/signup" element={<Auth />} />
        <Route path="/login" element={<Auth />} />
        
        <Route path="/" element={<ProtectedRoute element={<HomePage />} />} />
        <Route path="/sales" element={<ProtectedRoute element={<SalesPage />} />} />
        <Route path="/editProduct" element={<ProtectedRoute element={<EditProduct />} />} />
        <Route path="/transactions" element={<ProtectedRoute element={<TransactionsPage />} />} />
      </Routes>
    </Router>
  );
};

export default App;
