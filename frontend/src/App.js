import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Toaster } from 'react-hot-toast'; 
import './App.css';


import LoginPage from './components/seller/SellerLoginPage';
import UserProducts from './components/seller/SellerUserProducts';
import RegisterPage from './components/seller/SellerRegisterPage';
import EditUser from './components/seller/SellerEditUserPage';
import AddProduct from './components/seller/SellerAddProduct';
import EditProduct from './components/seller/SellerEditProduct'; 


import AdminLoginPage from './components/admin/AdminLoginPage';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminEditProduct from './components/admin/AdminEditProduct';
import AdminEditUser from './components/admin/AdminEditUser';


import CustomerLoginPage from './components/customers/CustomerLoginPage';
import CustomerAllProducts from './components/customers/CustomerAllProducts';
import CustomerRegisterPage from './components/customers/CustomerRegisterPage';
import CustomerCart from './components/customers/CustomerCart'
import CustomerEditUser from './components/customers/CustomerEditUser';
import CustomerOrder from './components/customers/CustomerOrder'

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>

          {/* Seller */}
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/edit-product/:product_id" element={<EditProduct />} />
          <Route path="/edit-user/:user_name" element={<EditUser />} />
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/products" element={<UserProducts />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Admin */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin-edit-product/:product_id" element={<AdminEditProduct />} /> 
          <Route path="/admin-edit-user/:user_name" element={<AdminEditUser />} />
          <Route path="/admin-login" element={<AdminLoginPage />} />

          {/* Customer */}
          <Route path="/customer-login" element={<CustomerLoginPage />} />
          <Route path="/customer-all-products" element={<CustomerAllProducts />} />
          <Route path="/customer-register-page" element={<CustomerRegisterPage />} />
          <Route path="/customer-cart" element={<CustomerCart />} />
          <Route path="/customer-edit-user/:user_name" element={<CustomerEditUser />} />
          <Route path="/customer-orders" element={<CustomerOrder />} />

          
          
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
