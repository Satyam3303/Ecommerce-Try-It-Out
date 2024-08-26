import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import "../../css/style.css";
import { jwtDecode } from "jwt-decode";
import CryptoJS from "crypto-js";

const EditUserPage = () => {
  const { user_name } = useParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Access denied. No token provided.");
        navigate("/login");
        return;
      }

      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/user/${user_name}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (data.status_code === 200) {
          const decoded = jwtDecode(data.token);
          setName(decoded.name);
          setEmail(decoded.email);
          setPhone(decoded.phone);
        }
      } catch (error) {
        toast.error("Failed to fetch user details");
        console.log(error);
      }
    };

    fetchUserDetails();
  }, [user_name, navigate]);

  const AllProducts = async (e) => {
    e.preventDefault();
    navigate("/products");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Access denied. No token provided.");
      navigate("/login");
      return;
    }

    try {
      const hashedPassword = CryptoJS.SHA256(password).toString();

      const response = await axios.put(
        `http://localhost:5000/api/user/update/${user_name}`,
        {
          name,
          email,
          password: hashedPassword,
          phone,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.status_code === 200) {
        toast.success("User updated successfully");
        navigate("/products");
      }
    } catch (error) {
      toast.error(
        "Update failed: " + (error.response?.data?.message || "Unknown error")
      );
    }
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container">
          <button
            className="btn btn-danger me-2 seller-login-links"
            type="button"
            onClick={AllProducts}
          >
            Go Back
          </button>
        </div>
      </nav>

      <div className="container-fluid d-flex justify-content-center align-items-center mt-5">
        <div className="card shadow-lg p-4 seller-login-card">
          <h2 className="text-center mb-4 seller-title">Edit User</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
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
              <label htmlFor="email" className="form-label">
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
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                className="form-control"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="phone" className="form-label">
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
            <button type="submit" className="btn btn-primary w-100 seller-login-links">
              Update
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditUserPage;
