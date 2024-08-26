import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {jwtDecode} from "jwt-decode";
import "../../css/customer.css";

export default function Post({ title, images, price, description, product_id, seller_user_name }) {
  const navigate = useNavigate();
  const [user_name, setUser_name] = useState();
  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Access denied. No token provided.");
      navigate("/customer-login");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/api/cart/register`,
        {
          user_name,
          product_id,
          seller_user_name,
          quantity,
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      if (response.data.status_code === 201) {
        toast.success("Product Added To Cart");
      }
    } catch (error) {
      toast.error("Failed to add product");
      console.error("Error adding product:", error);
    } finally {
      handleClose();
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      setUser_name(decodedToken.user_name);
    }
  }, []);

  return (
    <>
      <Card
      className="customer-post-card"
        sx={{
          
          "&:hover": {

          },
        }}
      >
        <CardMedia className="customer-post-media" image={images} />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div" className="customer-title">
            {title}
          </Typography>
          <Typography className="customer-sub-headings" variant="body2" color="text.secondary">
            {description}
          </Typography>
          <Typography className="customer-sub-headings" variant="body2" color="text.secondary">
            Rs {price}
          </Typography>
          <Button
            variant="contained"
            color="warning"
            sx={{ marginTop: 2 }}
            onClick={handleClickOpen}
            className="customer-login-links"
          >
            Add To Cart
          </Button>
        </CardContent>
      </Card>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle className="customer-sub-headings">Enter Quantity</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="quantity"
            label="Quantity"
            type="number"
            fullWidth
            variant="standard"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="customer-form-fields"
          />
        </DialogContent>
        <DialogActions>
          <Button className="btn customer-login-links" onClick={handleClose}>Cancel</Button>
          <Button className="btn customer-login-links" onClick={handleAddToCart}>Add to Cart</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
