import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import "../../css/style.css";
import CryptoJS from "crypto-js";
import { Link } from "react-router-dom";
import "../../css/seller.css";
import "../../css/fonts.css";
import Footer from "../footer/footer";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpMethod, setOtpMethod] = useState("email");
  const [showOtpField, setShowOtpField] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const submitButton = document.querySelector("#btn-submit");
    const submitButtonText = document.querySelector(
      "#btn-submit .button--text"
    );

    try {
      if (showOtpField) {
        submitButton.classList.add("loading");
        const response = await axios.post(
          "http://localhost:5000/api/user/verifyOtp",
          { email, otp }
        );

        if (response.data.status_code === 200) {
          setTimeout(() => {
            submitButton.classList.remove("loading");
            submitButton.classList.remove("fail");
            submitButton.classList.add("success");
            submitButtonText.innerHTML = "Login Successful";
          }, 3000);

          setTimeout(() => {
            localStorage.setItem("token", response.data.token);
            navigate("/products");
          }, 4000);
        }
      } else {
        const hashedPassword = CryptoJS.SHA256(password).toString();
        const response = await axios.post(
          "http://localhost:5000/api/user/login",
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
        if (error.response.data.message === "Invalid password") {
          submitButton.classList.remove("loading");
          submitButton.classList.add("fail");
          submitButtonText.innerHTML = "Login Failed";
          toast.error(
            "Login failed: " + (error.response.data.message || "Unknown error")
          );
        } else {
          setTimeout(() => {
            submitButton.classList.remove("loading");
            submitButton.classList.add("fail");
            submitButtonText.innerHTML = "Login Failed";
            toast.error(
              "Login failed: " +
                (error.response.data.message || "Unknown error")
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
      <div className="container-fluid d-md-flex justify-content-center align-items-center my-5">
        <div className="card shadow-lg p-4 seller-login-card">
        <h2 className="mb-2 text-center seller-title">
            Welcome Seller
          </h2>
          <h2 className="mb-4 seller-title">
            Sign in with your business credentials
          </h2>
          <form onSubmit={handleSubmit}>
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
              <label
                htmlFor="password"
                className="form-label seller-sub-headings"
              >
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
              <label
                htmlFor="otpMethod"
                className="form-label seller-sub-headings"
              >
                Send OTP via
              </label>
              <select
                id="otpMethod"
                value={otpMethod}
                className="form-control seller-form-fields"
                onChange={(e) => setOtpMethod(e.target.value)}
                required
              >
                <option value="email">Email</option>
                <option value="phone">Phone</option>
              </select>
            </div>
            {showOtpField && (
              <div className="mb-3">
                <label htmlFor="otp" className="form-label seller-sub-headings">
                  OTP
                </label>
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  className="form-control seller-form-fields"
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </div>
            )}
            <button
              type="submit"
              className="button btn btn-primary w-100"
              id="btn-submit"
            >
              <span className="button--text seller-login-links">Log In</span>
              <div className="button--loader">
                <div></div>
                <div></div>
                <div></div>
              </div>
            </button>
          </form>
          <button className="btn btn-primary w-100 mt-2">
            <Link className="seller-login-links"
              to="/register"
            >
              Don't have an Account? Register
            </Link>
          </button>
        </div>
      </div>
          <Footer/>
    </>
  );
};

export default LoginPage;
