import React, { useState, useEffect } from "react";
import axios from "axios"; // Importing axios for the API call
import { Card, CardContent, CardHeader, Container } from "@mui/material";
import { TextField, IconButton, Button, Box } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom"; // For redirection after successful login
import { unauthApiService } from "../services/apiServices.js";
import Cookies from "js-cookie";
import JWT from "expo-jwt";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState(""); // State for email input
  const [password, setPassword] = useState(""); // State for password input
  const [loading, setLoading] = useState(false); // State for loading status
  const [error, setError] = useState(""); // State for error message

  const navigate = useNavigate(); // Hook to navigate after successful login

  // Function to check if the token is valid
  const checkToken = () => {
    const token = Cookies.get("token");
    if (token) {
      try {
        const decodedToken = JWT.decode(token, import.meta.env.VITE_JWT_SECRET);
        const currentTime = Date.now() / 1000; // Current time in seconds
        // If the token is valid and not expired, navigate to the dashboard
        if (decodedToken.exp > currentTime) {
          navigate("/dashboard");
        }
      } catch (error) {
        console.error("Token decoding error:", error);
      }
    }
  };

  useEffect(() => {
    checkToken();
  }, []);

  // Login API call function
  const handleLogin = async () => {
    setLoading(true);
    setError(""); // Reset error message on each new attempt

    try {
      const response = await unauthApiService.post("/login", {
        email,
        password,
      });

      // Assuming the response contains a token

      const { token, user } = response.data.data;

      // Save the token in localStorage
      Cookies.set("token", token, {
        expires: 1,
        secure: true,
        sameSite: "Strict",
      });

      Cookies.set("user", JSON.stringify(user), {
        expires: 1, // Optional: Expiration time for the cookie (in days)
        secure: true, // Optional: Set true if you're using HTTPS
        sameSite: "Strict", // Optional: Prevent the cookie from being sent with cross-site requests
      });

      // Redirect to dashboard or another route
      if (response.data.status === "success") {
        setLoading(false);
        setError("");
        navigate("/dashboard");
      }
    } catch (err) {
      // Handle errors (e.g., invalid credentials)
      console.log(err);
      setError("Invalid email or password.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      width="100vw"
      position="relative"
    >
      {/* Background Image */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage:
            "url('https://images.unsplash.com/photo-1555421689-491a97ff2040?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          zIndex: -1,
        }}
      />

      <Container
        maxWidth="xs"
        style={{ display: "flex", justifyContent: "center" }}
      >
        <Card
          style={{
            width: "100%",
            padding: 24,
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            borderRadius: 12,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: "rgba(255, 255, 255, 0.9)", // Adding transparency to make it stand out
          }}
        >
          <CardHeader
            title="Login to BlynkMart"
            style={{ textAlign: "center" }}
          />
          <CardContent style={{ width: "100%" }}>
            {/* Email Input */}
            <TextField
              fullWidth
              label="Email"
              type="email"
              variant="outlined"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* Password Input */}
            <TextField
              fullWidth
              label="Password"
              type={showPassword ? "text" : "password"}
              variant="outlined"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
              }}
            />

            {/* Error Message */}
            {error && <p style={{ color: "red", fontSize: "14px" }}>{error}</p>}

            {/* Login Button */}
            <Button
              fullWidth
              variant="contained"
              color="primary"
              style={{ marginTop: 16 }}
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
