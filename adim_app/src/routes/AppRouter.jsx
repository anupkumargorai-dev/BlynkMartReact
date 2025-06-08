import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "../page/Dashboard";
import Order from "../page/Order";
import Category from "../page/Category";
import AddCategory from "../page/AddCategory";
import AddProduct from "../page/product/AddNewProduct";
import ProductListing from "../page/product/AllProducts";
import ConsumerHomeDataConf from "../page/ConsumerHomeDataConf.jsx"

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/orders" element={<Order />} />
      <Route path="/categories" element={<Category />} />
      <Route path="/categories/all" element={<Category />} />
      <Route path="/categories/addCategory" element={<AddCategory />} />
      <Route path="/product" element={<ProductListing />} />
      <Route path="/product/view" element={<ProductListing />} />
      <Route path="/product/addProduct" element={<AddProduct />} />
      <Route path="*" element={<div>404 - Page Not Found</div>} />
    </Routes>
  );
}
