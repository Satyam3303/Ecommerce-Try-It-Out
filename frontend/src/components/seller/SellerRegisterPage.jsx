import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import "../../css/style.css";
import CryptoJS from "crypto-js";
import seller_login from '../../assets/seller-login.png'
import '../../css/seller.css'
import Footer from "../footer/footer";

const RegisterPage = () => {
  const [userName, setUserName] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Hash the password using SHA-256
      const hashedPassword = CryptoJS.SHA256(password).toString();

      const response = await axios.post(
        "http://localhost:5000/api/user/register",
        {
          user_name: userName,
          name,
          email,
          password: hashedPassword,
          phone,
        }
      );
      if (response.data.status_code === 201) {
        toast.success("Registration successful");
        navigate("/login");
      }
    } catch (error) {
      toast.error(
        "Registration failed: " + (error.response?.data?.message || "Unknown error")
      );
    }
  };

  return (
    <>
    <div className="container-fluid d-flex justify-content-center align-items-center min-vh-100">
          <div className="image-container my-2 px-4 d-none d-md-block">
    <img src={seller_login} alt="" className="rounded-3" />
  </div>
      <div
        className="card shadow-lg p-4 seller-login-card"
      >
        <h2 className="mb-4 seller-title">Sell With Us</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="userName" className="form-label seller-sub-headings">
              Username
            </label>
            <input
              type="text"
              id="userName"
              value={userName}
              className="form-control seller-form-fields"
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="name" className="form-label seller-sub-headings">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              className="form-control seller-form-fields"
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label seller-sub-headings">
              Email address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              className="form-control seller-form-fields"
              aria-describedby="emailHelp"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label seller-sub-headings">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              className="form-control seller-form-fields"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="phone" className="form-label seller-sub-headings">
              Phone Number
            </label>
            <input
              type="text"
              id="phone"
              value={phone}
              className="form-control seller-form-fields"
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100 seller-login-links">
            Register
          </button>
          <button className="btn btn-primary w-100 mt-2">
          <Link className="seller-login-links" to="/login">
          Have an Account? Login
          </Link>
          </button>
        </form>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default RegisterPage;
