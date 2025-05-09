import React from "react";
import { Navigate } from "react-router-dom";
import JWT from "expo-jwt";
import Cookies from "js-cookie";
const PrivateRoute = ({ children }) => {
  // If no token is present, redirect to login page'
  const token = Cookies.get("token");
  if (!token) {
    return <Navigate to="/login" />;
  }

  // Decode the token and check if it's expired
  try {
    const decodedToken = JWT.decode(token, import.meta.env.VITE_JWT_SECRET);
    const currentTime = Date.now() / 1000; // Current time in seconds

    // If the token is expired, redirect to login page
    if (decodedToken.exp < currentTime) {
      return <Navigate to="/login" />;
    }

    // If the token is valid, allow access to the route
    return children;
  } catch (error) {
    console.log(error);
    return <Navigate to="/login" />;
  }
};

export default PrivateRoute;
