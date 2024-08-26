import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import "../../css/style.css";
import CryptoJS from "crypto-js";
import customer_login from '../../assets/customer-login.png'
import Footer from "../footer/footer";
import "../../css/customer.css";

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
        "http://localhost:5000/api/customer/register",
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
        navigate("/customer-login");
      }
    } catch (error) {
      toast.error(
        "Registration failed: " + (error.response?.data?.message || "Unknown error")
      );
    }
  };

  return (
    <>
    <div className="container-fluid d-flex justify-content-center align-items-center my-5">
          <div className="image-container my-2 px-4 d-none d-md-block">
    <img src={customer_login} alt="" className="rounded-3" />
  </div>

      <div
        className="card shadow-lg p-4 customer-login-card"
      >
        <h2 className="mb-4 customer-title">Register With Us</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="userName" className="form-label customer-sub-headings">
              Username
            </label>
            <input
              type="text"
              id="userName"
              value={userName}
              className="form-control "
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="name" className="form-label customer-sub-headings">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              className="form-control"
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label customer-sub-headings">
              Email address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              className="form-control"
              aria-describedby="emailHelp"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label customer-sub-headings">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              className="form-control"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="phone" className="form-label customer-sub-headings">
              Phone Number
            </label>
            <input
              type="text"
              id="phone"
              value={phone}
              className="form-control"
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100 customer-login-links">
            Register
          </button>
          <button className="btn btn-primary w-100 mt-2">
          <Link className="customer-login-links" to="/customer-login">
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
