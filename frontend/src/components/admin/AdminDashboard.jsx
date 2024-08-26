import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../../css/style.css";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import AdminPost from "./AdminPost";
import AdminUserTable from "./AdminUserTable";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import "../../css/admin.css";

const AllProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("products");
  const [users, setUsers] = useState([]);

  const getAllProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const response = await axios.get(
          `http://localhost:5000/api/product/all-products`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response.data && response.data.products) {
          setProducts(response.data.products);
          setFilteredProducts(response.data.products);
          console.log(filteredProducts);
        }
      } else {
        console.error("Token not found");
      }
    } catch (error) {
      console.error("Failed to fetch user products", error);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }
  };

  const getAllUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const response = await axios.get(
          `http://localhost:5000/api/user/users/all-users`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response.data && response.data.users) {
          setUsers(response.data.users);
          console.log(response.data.users);
        }
      } else {
        console.error("Token not found");
      }
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setIsLoading(false);
    }
  };

  const logOut = async (e) => {
    e.preventDefault();
    localStorage.clear();
    toast.success("Logout successful");
    navigate("/admin-login");
  };

  const AdminEdit = async (e) => {
    navigate(`/admin-edit-user/${userName}`);
  };

  const deleteAdminUser = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const userName = decodedToken.user_name;
        await axios.delete(`http://localhost:5000/api/user/users/${userName}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        localStorage.clear();
        toast.success("User deleted successfully");
        navigate("/");
      } catch (error) {
        console.error("Failed to delete user", error);
        toast.error("Failed to delete user");
      }
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setName(decodedToken.name);
        setUserName(decodedToken.user_name);
        setIsLoggedIn(true);
        getAllProducts();
        getAllUsers();
      } catch (error) {
        console.error("Invalid token");
        setIsLoggedIn(false);
        setIsLoading(false);
      }
    } else {
      setIsLoggedIn(false);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const loaderContainer = document.querySelector(".loader-container");
      const pageContent = document.querySelector("#page-content");
      loaderContainer.classList.add("hidden");
      pageContent.classList.add("visible");
    }
  }, [isLoading]);

  const handleFilter = () => {
    const minPrice = parseFloat(document.getElementById("minPrice").value) || 0;
    const maxPrice =
      parseFloat(document.getElementById("maxPrice").value) || Number.MAX_VALUE;
    const filtered = products.filter(
      (e) => e.price >= minPrice && e.price <= maxPrice
    );
    setFilteredProducts(filtered);
  };

  return (
    <>
      <div className={`loader-container ${isLoading ? "" : "hidden"}`}>
        <div className="loader"></div>
      </div>

      <section id="page-content" className={`${isLoading ? "" : "visible"}`}>
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
          <div className="container">
            {isLoggedIn ? (
              <>
                <span
                  className="navbar-brand admin-title"
                  to="#"
                  style={{ color: "white" }}
                >
                  Welcome {name}
                </span>
                <button
                  className="btn btn-primary me-2 admin-sub-headings"
                  type="button"
                  onClick={AdminEdit}
                >
                  Edit User
                </button>

                <button
                  className="btn btn-danger me-2 admin-sub-headings"
                  type="button"
                  onClick={logOut}
                >
                  Log Out
                </button>
              </>
            ) : (
              <span className="navbar-brand text-light admin-sub-headings">Not Logged In</span>
            )}
          </div>
        </nav>

        <div className="container">
          <ul className="nav nav-tabs">
            <li className="nav-item">
              <button
                className={`admin-sub-headings nav-link ${
                  activeTab === "products" ? "active" : ""
                }`}
                onClick={() => setActiveTab("products")}
              >
                Products
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`admin-sub-headings nav-link ${activeTab === "users" ? "active" : ""}`}
                onClick={() => {
                  setActiveTab("users");
                }}
              >
                Users
              </button>
            </li>
          </ul>

          {activeTab === "products" ? (
            <div>
              <div>
                <h1 className="admin-title">Products</h1>
              </div>
              <div>
                <h5 className="admin-title" style={{ color: "grey" }}>
                  All the available products are listed below
                </h5>
              </div>
              <div className="row">
                <div className="input col-sm-12 col-md-3 mb-3">
                  <input
                    type="number"
                    id="minPrice"
                    placeholder="Min Price"
                    className="form-control admin-form-fields"
                    aria-label="Default"
                    aria-describedby="inputGroup-sizing-default"
                  />
                </div>
                <div className="input col-sm-12 col-md-3 mb-3">
                  <input
                    type="number"
                    id="maxPrice"
                    placeholder="Max Price"
                    className="form-control admin-form-fields"
                    aria-label="Default"
                    aria-describedby="inputGroup-sizing-default"
                  />
                </div>
                <button
                  className="btn btn-primary col-4 col-md-1 mb-3 mx-2 admin-form-fields"
                  id="filterBtn"
                  onClick={handleFilter}
                >
                  Filter
                </button>
              </div>
              <div className="row">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <div className="col-sm-12 col-md-4" key={product.id}>
                      <AdminPost
                        title={product.title}
                        images={product.image}
                        price={product.price}
                        description={product.description}
                        product_id={product.product_id}
                        createdBy={product.createdBy}
                      />
                    </div>
                  ))
                ) : (
                  <div style={{ color: "#000" }}>No products available</div>
                )}
              </div>
            </div>
          ) : (
            <div>
              <h1>Users</h1>
              <div>
                <h5 style={{ color: "grey" }}>
                  All the available Users are listed below
                </h5>
              </div>
              <div className="row">
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell className="admin-title">Name</TableCell>
                        <TableCell className="admin-title" align="right">User Name</TableCell>
                        <TableCell className="admin-title" align="right">Phone</TableCell>
                        <TableCell className="admin-title" align="right">Email</TableCell>
                        <TableCell className="admin-title" align="right">Created At</TableCell>
                        <TableCell className="admin-title" align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {users.length > 0 ? (
                        users.map((user) => (
                          <TableRow className="col-12" key={user.id}>
                            <AdminUserTable
                              user_name={user.user_name}
                              phone={user.phone}
                              name={user.name}
                              email={user.email}
                              createdAt={user.createdAt}
                            />
                          </TableRow>
                        ))
                      ) : (
                        <div style={{ color: "#000" }}>No users available</div>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default AllProducts;
