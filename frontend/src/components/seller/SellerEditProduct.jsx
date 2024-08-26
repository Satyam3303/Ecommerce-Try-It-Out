import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import "../../css/style.css";
import "../../css/seller.css";

const EditProduct = () => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const { product_id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:5000/api/product/${product_id}`)
      .then(response => {
        const { product } = response.data;
        setTitle(product.title);
        setPrice(product.price);
        setDescription(product.description);
        setImage(product.image);
      })
      .catch(error => {
        console.error('Error fetching product:', error);
        toast.error("Failed to fetch product details");
      });
  }, [product_id]);


  const AllProducts = async (e) => {
    e.preventDefault();
    navigate("/products");
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
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


      await axios.put(`http://localhost:5000/api/product/update/${product_id}`, productData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      toast.success("Product updated successfully");
      navigate("/products");
    } catch (error) {
      toast.error("Failed to update product");
    }
  };

  return (<>
          <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container">
          <button
            className="btn btn-primary me-2"
            type="button"
            onClick={AllProducts}
          >
            Go Back
          </button>
        </div>
      </nav>

      <div className="container-fluid d-flex justify-content-center align-items-center mt-5">
      <div className="card shadow-lg p-4 seller-login-card" >
      <h2 className="text-center mb-4 seller-title">Edit Product</h2>
      <form onSubmit={handleSubmit}>
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
        <button type="submit" className="btn btn-primary seller-login-links">Update Product</button>
      </form>
    </div>
    </div>
    </>
  );
};

export default EditProduct;
