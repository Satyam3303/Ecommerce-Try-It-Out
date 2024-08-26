import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  TableCell,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Typography,
} from "@mui/material";
import "../../css/customer.css"; 

const CustomerOrderTable = ({ order_id, items, amount,time, address }) => {
  const [itemDetails, setItemDetails] = useState([]);
  const [formatDate,setFormatDate] = useState();
  const [open, setOpen] = useState(false); 

  const GetItemDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const itemArray = JSON.parse(items);
        const itemDetailsPromises = itemArray.map((item) =>
          axios.get(`http://localhost:5000/api/product/${item.product_id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        );

        const responses = await Promise.all(itemDetailsPromises);
        const itemDetails = responses.map((res) => res.data.product);
        setItemDetails(itemDetails);
      } else {
        console.error("Token not found");
      }
    } catch (error) {
      console.error("Failed to fetch item details", error);
    }
  };

  useEffect(() => {
    GetItemDetails();
    const dateString = time;
    const dateObject = new Date(dateString);
    const year = dateObject.getFullYear();
    const month = dateObject.getMonth() + 1;
    const day = dateObject.getDate();
    const formattedDate = `${year}-${month}-${day}`;
    setFormatDate(formattedDate)
  }, [items]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <TableCell component="th" scope="row" align="right" className="customer-title">
        {order_id}
      </TableCell>
      <TableCell align="right">
        {itemDetails.map((item, index) => (
          <div key={index}>
            {item.title} (Quantity: {JSON.parse(items)[index].quantity})
          </div>
        ))}
      </TableCell>
      <TableCell className="customer-title" align="right">{amount}</TableCell>
      <TableCell className="customer-title" align="right">{address}</TableCell>
      <TableCell className="customer-title" align="right">{formatDate}</TableCell>
      <TableCell align="right">
        <Button className="customer-login-links" variant="contained" color="primary" onClick={handleClickOpen}>
          View Details
        </Button>
      </TableCell>

      {/* Modal */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle className="customer-title">Order Details</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Typography className="customer-sub-headings" variant="h6">Order ID: {order_id}</Typography>
            <Typography className="customer-sub-headings" variant="body1">Address: {address}</Typography>
            <Typography className="customer-sub-headings" variant="body1">Amount: ${amount}</Typography>
            <Typography className="customer-sub-headings" variant="h6">Items:</Typography>
            {itemDetails.map((item, index) => (
              <Typography key={index} variant="body2" className="customer-sub-headings">
                {item.title} (Quantity: {JSON.parse(items)[index].quantity})
              </Typography>
            ))}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" className="customer-login-links">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CustomerOrderTable;
