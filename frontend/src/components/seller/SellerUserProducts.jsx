import React, { useEffect, useState } from "react";
import axios from "axios";
import Post from "./Sellerpost";
import { Link, useNavigate } from "react-router-dom";
import "../../css/style.css";
import toast from "react-hot-toast";
import {jwtDecode} from "jwt-decode";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from "@mui/material";
import { Offcanvas } from "react-bootstrap"; // Import Offcanvas component from react-bootstrap

const UserProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false); 
  const [showDrawer, setShowDrawer] = useState(false); 

  const getUserProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      
      if (token) {
        const decodedToken = jwtDecode(token);
        const userName = decodedToken.user_name;

        const response = await axios.get(`http://localhost:5000/api/product/user-products/${userName}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data && response.data.products) {
          setProducts(response.data.products);
          setFilteredProducts(response.data.products);
        }
      } else {
        console.error("Token not found");
      }
    } catch (error) {
      console.error("Failed to fetch user products", error);
    } finally {
      setIsLoading(false);
    }
  };

  const logOut = async (e) => {
    e.preventDefault();
    localStorage.clear();
    toast.success("Logout successful");
    navigate("/");
  };

  const deleteUser = async () => {
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
      } finally {
        setOpen(false); // Hide modal after deletion
      }
    }
  };

  // Handle opening and closing of the confirmation modal
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirmDelete = () => {
    deleteUser();
    handleClose();
  };

  const toggleDrawer = () => setShowDrawer(!showDrawer);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setName(decodedToken.name);
        setUserName(decodedToken.user_name);
        setIsLoggedIn(true);
        getUserProducts();
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
            <button
              className="btn btn-primary me-2 seller-login-links"
              type="button"
              onClick={toggleDrawer} // Toggle drawer visibility
            >
              Options
            </button>
            {isLoggedIn ? (
              <>
                <span className="navbar-brand seller-title" to="#" style={{ color: "white" }}>
                  Welcome {name}
                </span>
              </>
            ) : (
              <span className="navbar-brand text-light">Not Logged In</span>
            )}
          </div>
        </nav>

        {isLoggedIn ? (
          <div className="container">
            <div>
              <h1 className="seller-title">Products</h1>
            </div>
            <div>
              <h5 className="seller-sub-headings" style={{ color: "grey" }}>
                All the available products are listed below
              </h5>
            </div>
            <div className="row">
              <div className="input col-sm-12 col-md-3 mb-3">
                <input
                  type="number"
                  id="minPrice"
                  placeholder="Min Price"
                  className="form-control seller-form-fields"
                  aria-label="Default"
                  aria-describedby="inputGroup-sizing-default"
                />
              </div>
              <div className="input col-sm-12 col-md-3 mb-3">
                <input
                  type="number"
                  id="maxPrice"
                  placeholder="Max Price"
                  className="form-control seller-form-fields"
                  aria-label="Default"
                  aria-describedby="inputGroup-sizing-default"
                />
              </div>
              <button
                className="btn btn-primary col-4 col-md-1 mb-3 mx-2 seller-login-links"
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
                    <Post
                      title={product.title}
                      images={product.image}
                      price={product.price}
                      description={product.description}
                      product_id={product.product_id}
                    />
                  </div>
                ))
              ) : (
                <div style={{ color: "#000" }}>No products available</div>
              )}
            </div>
          </div>
        ) : (
          <div className="container text-center mt-5">
            <h2>You are not logged in</h2>
            <button
              className="btn btn-primary mt-3"
              onClick={() => navigate("/login")}
            >
              Go to Login Page
            </button>
          </div>
        )}
      </section>

      {/* Side Drawer */}
      <Offcanvas show={showDrawer} onHide={toggleDrawer}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title className=" seller-title">Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {isLoggedIn && (
            <>
              <button
                className="btn btn-primary me-2 w-100 mb-2 seller-login-links"
                type="button"
                onClick={() => navigate(`/edit-user/${userName}`)}
              >
                Edit User
              </button>
              <button
                className="btn btn-primary me-2 w-100 mb-2 seller-login-links"
                type="button"
                onClick={() => navigate("/add-product")}
              >
                Add Product
              </button>
              <button
                className="btn btn-danger me-2 w-100 mb-2 seller-login-links"
                type="button"
                onClick={logOut}
              >
                Log Out
              </button>
              <button
                className="btn btn-danger me-2 w-100 mb-2 seller-login-links"
                type="button"
                onClick={handleClickOpen} // Open the modal on click
              >
                Delete User
              </button>
            </>
          )}
        </Offcanvas.Body>
      </Offcanvas>

      {/* Confirmation Modal */}
      <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this user and all associated products?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="warning">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserProducts;
