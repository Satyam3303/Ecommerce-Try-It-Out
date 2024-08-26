import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function Post({ id, title, images, price, description, product_id }) {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false); // State to control modal open

  const handleEditClick = () => {
    navigate(`/edit-product/${product_id}`);
  };

  const handleDeleteClick = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Access denied. No token provided.");
      navigate("/login");
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/product/delete/${product_id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      toast.success("Product deleted successfully");
      window.location.reload();
    } catch (error) {
      toast.error("Failed to delete product");
      console.error("Error deleting product:", error);
    }
  };

  const handleClickOpen = () => {
    setOpen(true); // Open the modal
  };

  const handleClose = () => {
    setOpen(false); // Close the modal
  };

  return (
    <>
      <Card
       className="seller-post-card"
      >
        <CardMedia className="seller-post-media" image={images} />
        <CardContent>
          <Typography
            gutterBottom
            variant="h5"
            component="div"
            className="seller-title"
          >
            {title}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ }}
            className="seller-sub-headings"
          >
            {description}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ }}
            className="seller-sub-headings"
          >
            Rs {price}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{ marginTop: 2, marginRight: 1 }}
            onClick={handleEditClick}
            className="seller-login-links"
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="warning"
            sx={{ marginTop: 2 }}
            onClick={handleClickOpen} // Trigger modal on click
          >
            Delete
          </Button>
        </CardContent>
      </Card>

      {/* Confirmation Modal */}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirm Delete"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this product?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={() => {
            handleClose();
            handleDeleteClick();
          }} color="warning" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
