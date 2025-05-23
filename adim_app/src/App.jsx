import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SideDrawer, RouterProvider } from "./component/side_drawer/SideDrawer";
import Login from "../src/page/Login";
import PrivateRoute from "./routes/PrivateRoute.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        {/* Protected route */}
        <Route
          path="/dashboard/*"
          element={
            <PrivateRoute>
              <RouterProvider initialPath="/dashboard">
                <SideDrawer />
              </RouterProvider>
            </PrivateRoute>
          }
        />
         {/* Default route can redirect based on token presence */}
        <Route
          path="/"
          element={
            Cookies.get("token") ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
