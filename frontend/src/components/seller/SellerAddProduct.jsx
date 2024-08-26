import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "../../css/style.css";


const AddProduct = () => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const navigate = useNavigate();

  const AllProducts = async (e) => {
    e.preventDefault();
    navigate("/products");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Access denied. No token provided.");
      navigate("/login");
      return;
    }
  
    const productData = {
      title,
      price: parseFloat(price),
      description,
      image
    };
  
    try {
      const response = await axios.post('http://localhost:5000/api/product/add', productData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log(response.data);
      toast.success("Product added successfully");
      navigate("/products");
    }  catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(`Failed to add product: ${error.response.data.message}`);
      } else {
        toast.error("Failed to add product");
      }
      console.error('Error adding product:', error);
    }
  };

  return (<>
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container">
          <button
            className="btn btn-primary me-2 seller-login-links"
            type="button"
            onClick={AllProducts}
          >
            Go Back
          </button>
        </div>
      </nav>

      <div className="container-fluid d-flex justify-content-center align-items-center mt-5">
    <div className="card shadow-lg p-4 seller-login-card" >
      <h2 className="text-center mb-4 seller-title">Add New Product</h2>
      <form onSubmit={handleSubmit} >
        <div className="mb-3">
          <label htmlFor="title" className="form-label">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            className="form-control"
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="price" className="form-label">Price</label>
          <input
            type="number"
            id="price"
            value={price}
            className="form-control"
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea
            id="description"
            value={description}
            className="form-control"
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>
        <div className="mb-3">
          <label htmlFor="image" className="form-label">Image URL</label>
          <input
            type="text"
            id="image"
            value={image}
            className="form-control"
            onChange={(e) => setImage(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary seller-login-links">Add Product</button>
      </form>
    </div>
    </div>
    </>
  );
};

export default AddProduct;
