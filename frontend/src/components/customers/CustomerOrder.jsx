import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/style.css";
import CustomerOrderTable from './CustomerOrderTable';
import {jwtDecode} from "jwt-decode";
import axios from "axios";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import "../../css/customer.css"; 

const CustomerOrder = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState("");

  const GetUserOrders = async (userName) => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const response = await axios.get(
          `http://localhost:5000/api/order/by-username/${userName}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response.data) {
          const result = response.data.orders;
          setOrders(result);
        }
      } else {
        console.error("Token not found");
      }
    } catch (error) {
      console.error("Failed to fetch user orders", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const user_name = decodedToken.user_name;
        console.log(user_name);
        setIsLoggedIn(true);
        setUsername(user_name);
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
    if (username) {
      GetUserOrders(username);
    }
  }, [username]); // Trigger GetUserOrders when username is set

  useEffect(() => {
    if (!isLoading) {
      const loaderContainer = document.querySelector(".loader-container");
      const pageContent = document.querySelector("#page-content");
      loaderContainer.classList.add("hidden");
      pageContent.classList.add("visible");
    }
  }, [isLoading]);

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
              <span className="navbar-brand text-light">Not Logged In</span>
            )}
          </div>
        </nav>

        <div className="container">
          <div className="row">
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell className="customer-sub-headings" align="right">Order ID</TableCell>
                    <TableCell className="customer-sub-headings" align="right">Items</TableCell>
                    <TableCell className="customer-sub-headings" align="right">Amount</TableCell>
                    <TableCell className="customer-sub-headings" align="right">Address</TableCell>
                    <TableCell className="customer-sub-headings" align="right">Date</TableCell>
                    <TableCell className="customer-sub-headings" align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders && orders.length > 0 ? (
                    orders.map((order) => (
                      <TableRow key={order.id}>
                        <CustomerOrderTable
                          order_id={order.order_id}
                          items={order.items}
                          amount={order.amount}
                          time={order.createdAt}
                          address={order.address}
                        />
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell className="customer-title" colSpan={5} style={{ textAlign: "center" }}>
                        No orders available
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      </section>
    </>
  );
};

export default CustomerOrder;
