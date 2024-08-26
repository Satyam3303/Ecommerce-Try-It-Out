import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/style.css";
import CustomerCartTable from "./CustomerCartTable";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Typography,
  Modal,
  Box,
  TextField
} from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import "../../css/customer.css"; 

const CustomerCart = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [products, setProducts] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [address, setAddress] = useState(""); 
  const [modalOpen, setModalOpen] = useState(false); 
  const [username, setUsername] = useState(""); 

  const GetUserProducts = async (userName) => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const response = await axios.get(
          `http://localhost:5000/api/cart/${userName}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response.data) {
          const result = response.data.cart;
          setProducts(result);
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

  const updateTotalAmount = (amount) => {
    setTotalAmount((prevTotal) => prevTotal + amount);
  };

  const handleOrderNow = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Access denied. No token provided.");
        return;
      }

      const order_id = uuidv4();
      const items = products.map((product) => ({
        product_id: product.product_id,
        quantity: product.quantity,
      }));

      const orderData = {
        order_id,
        items: JSON.stringify(items),
        address,
        amount: totalAmount,
        username, 
      };

      const response = await axios.post(`http://localhost:5000/api/order/create`, orderData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        console.log("Order placed successfully!", response.data.order);
        toast.success("Order Placed Successfully");

        await axios.delete(`http://localhost:5000/api/cart/clear/${username}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts([]);
        setTotalAmount(0);

        setTimeout(() => {
          navigate("/customer-all-products");
        }, 2000);
      }
    } catch (error) {
      console.error("Failed to place order", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const user_name = decodedToken.user_name;
        setIsLoggedIn(true);
        setUsername(user_name);
        GetUserProducts(user_name);
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

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const handleConfirmOrder = () => {
    handleOrderNow();
    handleCloseModal();
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
                <button
                  className="btn btn-primary me-2 customer-title"
                  type="button"
                  onClick={() => {
                    navigate(`/customer-all-products`);
                  }}
                >
                  Go Back
                </button>
              </>
            ) : (
              <span className="navbar-brand text-light customer-title">Not Logged In</span>
            )}
          </div>
        </nav>

        <div className="container">
          <div className="row">
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell className="customer-title" align="right">Product</TableCell>
                    <TableCell className="customer-title" align="right">Quantity</TableCell>
                    <TableCell className="customer-title" align="right">Price</TableCell>
                    <TableCell className="customer-title" align="right">Amount</TableCell>
                    <TableCell className="customer-title" align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products && products.length > 0 ? (
                    products.map((product) => (
                      <TableRow key={product.id}>
                        <CustomerCartTable
                          user_name={product.user_name}
                          product_id={product.product_id}
                          quantity={product.quantity}
                          onPriceUpdate={updateTotalAmount} // Pass the update function to the child component
                        />
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} style={{ textAlign: "center" }}>
                        No products available
                      </TableCell>
                    </TableRow>
                  )}
                  <TableRow>
                    <TableCell colSpan={3}></TableCell>
                    <TableCell align="right">
                      <Typography variant="h6">Total Amount:</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="h6">Rs {totalAmount}</Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
            {products && products.length > 0 && (
              <div className="d-flex justify-content-end mt-3">
                <Button
                  className="customer-login-links"
                  variant="contained"
                  color="primary"
                  onClick={handleOpenModal}
                >
                  Order Now
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Address Modal */}
      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="modal-title" variant="h6" component="h2" className="customer-title">
            Enter Address
          </Typography>
          <TextField
            fullWidth
            margin="normal"
            label="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <Button
           className="customer-title"
            variant="contained"
            color="primary"
            onClick={handleConfirmOrder}
            sx={{ mt: 2 }}
          >
            Confirm Order
          </Button>
          <Button
           className="customer-title"
            variant="outlined"
            color="secondary"
            onClick={handleCloseModal}
            sx={{ mt: 2, ml: 2 }}
          >
            Cancel
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default CustomerCart;
