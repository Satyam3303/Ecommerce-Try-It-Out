import * as React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {
  TableCell,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useEffect } from "react";
import { useState } from "react";
import "../../css/admin.css";

const AdminUserTable = ({ user_name, phone, name, email, createdAt }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [formatDate,setFormatDate] = useState()

  const handleEditClick = () => {
    navigate(`/admin-edit-product/${user_name}`);
  };

  const handleDeleteClick = async (deleteAll) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Access denied. No token provided.");
      navigate("/login");
      return;
    }

    try {
      if (deleteAll) {
        await axios.delete(
          `http://localhost:5000/api/product/delete-all-product/${user_name}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        await axios.delete(
          `http://localhost:5000/api/user/${user_name}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success("User and its all products deleted successfully");
      } else {
        await axios.delete(
          `http://localhost:5000/api/user/users/${user_name}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success("User deleted successfully");
      }

      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      toast.error("Failed to delete User");
      console.error("Error deleting User:", error);
    }
  };

  const handleOpenDialog = () => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handleConfirmDelete = (deleteAll) => {
    handleDeleteClick(deleteAll);
    handleCloseDialog();
  };

  useEffect(()=>{
    const dateString = createdAt;
    const dateObject = new Date(dateString);
    const year = dateObject.getFullYear();
    const month = dateObject.getMonth() + 1;
    const day = dateObject.getDate();
    const formattedDate = `${year}-${month}-${day}`;
    setFormatDate(formattedDate)
  },[createdAt])

  return (
    <>
      <TableCell className="admin-sub-headings" component="th" scope="row">
        {name}
      </TableCell>
      <TableCell className="admin-sub-headings" align="right">{user_name}</TableCell>
      <TableCell className="admin-sub-headings" align="right">{phone}</TableCell>
      <TableCell className="admin-sub-headings" align="right">{email}</TableCell>
      <TableCell className="admin-sub-headings" align="right">{formatDate}</TableCell>
      <TableCell align="right">
        <Button className="admin-login-links" variant="contained" color="warning" onClick={handleOpenDialog}>
          Delete
        </Button>
      </TableCell>

      {/* Confirmation Modal */}
      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Do you want to delete all products of this user as well?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleConfirmDelete(false)} color="primary">
            No, just this User
          </Button>
          <Button
            onClick={() => handleConfirmDelete(true)}
            color="warning"
            autoFocus
          >
            Yes, delete all products
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AdminUserTable;
