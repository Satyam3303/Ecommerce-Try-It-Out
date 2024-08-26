import React, { useEffect, useState } from "react";
import axios from "axios";
import { TableCell, Button } from "@mui/material";
import "../../css/customer.css"; 

const CustomerCartTable = ({ user_name, product_id, quantity, onPriceUpdate }) => {
  const [price, setPrice] = useState();
  const [title, setTitle] = useState();

  const GetProductDetails = async (product_id) => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const response = await axios.get(`http://localhost:5000/api/product/${product_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data) {
          const productPrice = response.data.product.price;
          setPrice(productPrice);
          setTitle(response.data.product.title);
          console.log(productPrice*quantity)
          onPriceUpdate(productPrice * quantity); // Send the total price of this product to the parent
        }
      } else {
        console.error("Token not found");
      }
    } catch (error) {
      console.error("Failed to fetch product details", error);
    }
  };

  const handleDeleteClick = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Access denied. No token provided.");
        return;
      }

      await axios.delete(`http://localhost:5000/api/cart/deleteProduct/${user_name}/${product_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      onPriceUpdate(-price * quantity); 
      console.log("Product removed from cart successfully");
      setTimeout(() => {

      }, 1500);


    } catch (error) {
      console.error("Failed to remove product from cart:", error);
    }
  };

  useEffect(() => {
    GetProductDetails(product_id);
  }, [product_id]);

  return (
    <>
      <TableCell className="customer-sub-headings" component="th" scope="row" align="right">
        {title}
      </TableCell>
      <TableCell className="customer-sub-headings" align="right">{quantity}</TableCell>
      <TableCell className="customer-sub-headings" align="right">{price}</TableCell>
      <TableCell className="customer-sub-headings" align="right">{quantity * price}</TableCell>
      <TableCell align="right">
        <Button className="customer-login-links" variant="contained" color="warning" onClick={handleDeleteClick}>
          Delete
        </Button>
      </TableCell>
    </>
  );
};

export default CustomerCartTable;
