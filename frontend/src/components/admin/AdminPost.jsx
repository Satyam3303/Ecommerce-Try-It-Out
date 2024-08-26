import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function AdminPost({ id, title, images, price, description, product_id, createdBy }) {
  const navigate = useNavigate();

  const handleEditClick = () => {
    navigate(`/admin-edit-product/${product_id}`);
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
      setTimeout(()=>{
        window.location.reload();
      },2000)
    } catch (error) {
      toast.error("Failed to delete product");
      console.error("Error deleting product:", error);
    }
  };

  return (
    <Card
      className="admin-post-card"
    >
      <CardMedia className="admin-post-media" image={images} />
      <CardContent>
        <Typography
          gutterBottom
          variant="h5"
          component="div"
          className="admin-title"
        >
          {title}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          className="admin-sub-headings"
          sx={{ }}
        >
          Created By {createdBy}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          className="admin-sub-headings"
          sx={{ }}
        >
          {description}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          className="admin-sub-headings"
          sx={{ }}
        >
          Rs {price}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ marginTop: 2, marginRight: 1 }}
          onClick={handleEditClick}
          className="admin-login-links"
        >
          Edit
        </Button>
        <Button
          variant="contained"
          color="warning"
          sx={{ marginTop: 2 }}
          onClick={handleDeleteClick}
          className="admin-login-links"
        >
          Delete
        </Button>
      </CardContent>
    </Card>
  );
}
