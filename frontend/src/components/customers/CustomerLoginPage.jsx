import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import "../../css/style.css";
import CryptoJS from "crypto-js";
import { Link } from "react-router-dom";
import "../../css/customer.css";
import Footer from "../footer/footer";

const CustomerLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpMethod, setOtpMethod] = useState("email");
  const [showOtpField, setShowOtpField] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const submitButton = document.querySelector('#btn-submit');
    const submitButtonText = document.querySelector('#btn-submit .button--text');
  
    try {
      if (showOtpField) {
        submitButton.classList.add('loading');
        const response = await axios.post(
          "http://localhost:5000/api/customer/verifyOtp",
          { email, otp }
        );
  
        if (response.data.status_code === 200) {
          setTimeout(() => {
            submitButton.classList.remove('loading');
            submitButton.classList.remove('fail');
            submitButton.classList.add('success');
            submitButtonText.innerHTML = "Login Successful";
          }, 3000);
  
          setTimeout(() => {
            localStorage.setItem("token", response.data.token);
            navigate("/customer-all-products");
          }, 4000);
        } 
      } else {
        const hashedPassword = CryptoJS.SHA256(password).toString();
        const response = await axios.post(
          "http://localhost:5000/api/customer/login",
          { email, password: hashedPassword, otpMethod }
        );
  
        if (response.data.status_code === 200) {
          toast.success(`OTP sent to ${otpMethod}`);
          setShowOtpField(true);
        }
      }
    } catch (error) {
      console.error("Error:", error);
  
      if (error.response) {
        if(error.response.data.message === "Invalid password"){
          submitButton.classList.remove('loading');
          submitButton.classList.add('fail');
          submitButtonText.innerHTML = "Login Failed";
          toast.error(
            "Login failed: " + (error.response.data.message || "Unknown error")
          );
        }
        else{
          setTimeout(() => {
            submitButton.classList.remove('loading');
            submitButton.classList.add('fail');
            submitButtonText.innerHTML = "Login Failed";
            toast.error(
              "Login failed: " + (error.response.data.message || "Unknown error")
            );
          }, 3000);
        }
      } else {
        toast.error("Login failed: Unknown error");
      }
    }
  };

  return (
    <>
    <div className="container-fluid d-flex justify-content-center align-items-center  my-5">

      <div className="card shadow-lg p-4 customer-login-card">
        <h2 className="text-center mb-2 customer-title">Welcome Customer</h2>
        <h2 className="mb-4 customer-title">Please Login with your Credentials</h2>
        <form onSubmit={handleSubmit}>
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
            <label htmlFor="otpMethod" className="form-label customer-sub-headings">
              Send OTP via
            </label>
            <select
              id="otpMethod"
              value={otpMethod}
              className="form-control"
              onChange={(e) => setOtpMethod(e.target.value)}
              required
            >
              <option value="email">Email</option>
              <option value="phone">Phone</option>
            </select>
          </div>
          {showOtpField && (
            <div className="mb-3">
              <label htmlFor="otp" className="form-label">
                OTP
              </label>
              <input
                type="text"
                id="otp"
                value={otp}
                className="form-control"
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>
          )}
          <button type="submit" className="button btn btn-primary w-100" id="btn-submit">
            <span className="button--text customer-login-links">Log In</span>
            <div className="button--loader">
              <div></div>
              <div></div>
              <div></div>
            </div>
          </button>
        </form>
        <button className="btn btn-primary w-100 mt-2">
          <Link className="customer-login-links" to="/customer-register-page">
            Don't have an Account? Register
          </Link>
        </button>
      </div>
    </div>
        <Footer/>
    </>
  );
};

export default CustomerLoginPage;