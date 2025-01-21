import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "../utils/auth"; // Import the function to check auth status

const PrivateRoute = () => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" />; // If not authenticated, redirect to login page
  }

  return <Outlet />; // If authenticated, render the nested routes
};

export default PrivateRoute;
