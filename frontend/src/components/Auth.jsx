import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import loginimage from "../assets/login.png"; 
import signupimage from "../assets/signup.png"; 
import "./auth.css"; 

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); 
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("loggedInUser", JSON.stringify(data.user)); 
        localStorage.setItem("token", data.token);
        navigate("/"); 
      } else {
        setErrorMessage(data.message || "Invalid credentials");
        setEmail(""); 
        setPassword(""); 
      }
    } catch (error) {
      setErrorMessage("Server error. Please try again later.");
      setEmail(""); 
      setPassword(""); 
    }
  };

  const handleSignup = async () => {
    const response = await fetch("http://localhost:5000/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password, confirmPassword }),
    });

    const data = await response.json();

    if (response.status === 201) {
      setIsLogin(true);
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="auth-container">
      <div className={`auth-form-container ${isLogin ? 'login-page' : 'signup-page'}`}>
        <div className={`auth-image ${isLogin ? 'login-page' : 'signup-page'}`}></div>
        <div className="auth-form">
          <h2>{isLogin ? "Login" : "Signup"}</h2>
          {errorMessage && <p>{errorMessage}</p>}

          {!isLogin && (
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {!isLogin && (
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          )}

          <button onClick={isLogin ? handleLogin : handleSignup}>
            {isLogin ? "Login" : "Sign Up"}
          </button>

          {isLogin ? (
            <p>
              Don't have an account? <Link to="#" onClick={() => setIsLogin(false)}>Sign up here</Link>
            </p>
          ) : (
            <p>
              Already have an account? <Link to="#" onClick={() => setIsLogin(true)}>Login here</Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
