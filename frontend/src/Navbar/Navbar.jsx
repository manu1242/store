import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { AiFillHome, AiOutlineTransaction, AiOutlineLogout } from "react-icons/ai";
import { FaShoppingCart, FaEdit } from "react-icons/fa";
import "./Navbar.css";

const Navbar = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const navigate = useNavigate();

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  const closeNav = () => {
    setIsNavOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    // Optionally navigate to login page after logout
    navigate("/login", { replace: true });
  };

  return (
    <div className="container-nav">
      <div className="hamburger" onClick={toggleNav}>
        <GiHamburgerMenu size={24} />
      </div>
      <nav className={`navbar ${isNavOpen ? "open" : ""}`}>
        <ul>
          <li>
            <Link to="/" onClick={closeNav} className="nav-link">
              <AiFillHome className="nav-icon" />
              Home
            </Link>
          </li>
          <li>
            <Link to="/sales" onClick={closeNav} className="nav-link">
              <FaShoppingCart className="nav-icon" />
              Buy Items
            </Link>
          </li>
          <li>
            <Link to="/editProduct" onClick={closeNav} className="nav-link">
              <FaEdit className="nav-icon" />
              Edit Items
            </Link>
          </li>
          <li>
            <Link to="/transactions" onClick={closeNav} className="nav-link">
              <AiOutlineTransaction className="nav-icon" />
              Transactions
            </Link>
          </li>
          <li>
            <Link
              to="/login" // Redirect to login page after logout
              onClick={handleLogout}
              className="nav-linklogout-btn"
            >
              <AiOutlineLogout className="nav-icon" />
              Logout
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
