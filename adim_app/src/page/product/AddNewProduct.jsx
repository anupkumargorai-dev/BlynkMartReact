import React, { useState, useEffect } from "react";
import { apiService } from "../../services/apiServices.js";
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Card,
  CardContent,
  CardActions,
  Box,
  CircularProgress,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Cookies from "js-cookie";
const AddProduct = () => {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: 0,
    discountPercentage: 0,
    stock: 0,
    images: [], // Store image files
    categories: [],
    tags: [],
    createdBy: "",
    isActive: true,
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({}); // Track form errors

  const [tags] = useState([
    { _id: "1", name: "New Arrival" },
    { _id: "2", name: "Best Seller" },
    { _id: "3", name: "Limited Edition" },
    { _id: "4", name: "Trending Now" },
    { _id: "5", name: "Hot Deal" },
    { _id: "6", name: "Exclusive" },
    { _id: "7", name: "Flash Sale" },
    { _id: "8", name: "Top Rated" },
    { _id: "9", name: "Editor's Pick" },
  ]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        setLoading(true);
        const data = Cookies.get("user");
        const user = JSON.parse(data);
        product.createdBy = user._id;
        const api = await apiService.get("/category");
        const response = api.data;
        setCategories(response.data.categories);
      } catch (err) {
        console.error("Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!product.name.trim()) newErrors.name = "Product name is required.";
    if (!product.description.trim())
      newErrors.description = "Product description is required.";
    if (product.price <= 0) newErrors.price = "Price must be greater than 0.";
    if (product.discountPercentage < 0 || product.discountPercentage > 100)
      newErrors.discountPercentage = "Discount must be between 0 and 100.";
    if (product.stock <= 0) newErrors.stock = "Stock cannot be 0.";
    if (!product.categories.length)
      newErrors.categories = "At least one category must be selected.";
    if (!product.tags.length)
      newErrors.tags = "At least one tag must be selected.";
    if (!product.images.length)
      newErrors.images = "Please upload at least one image.";
    if (product.images.length > 5)
      newErrors.images = "You can upload a maximum of 5 images.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (product.images.length + files.length > 5) {
      setErrors({ images: "You can upload a maximum of 5 images." });
      return;
    }
    setProduct((prevState) => ({
      ...prevState,
      images: [...prevState.images, ...files],
    }));
    setErrors((prevErrors) => ({ ...prevErrors, images: null })); // Clear image errors
  };

  const removeImage = (index) => {
    setProduct((prevState) => ({
      ...prevState,
      images: prevState.images.filter((_, idx) => idx !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setLoading(true);
    try {
      // API call logic goes here
      console.log("Submitting product:", product);
      // Create FormData to send both text and file data
      const formData = new FormData();
      formData.append("name", product.name);
      formData.append("price", product.price);
      formData.append("description", product.description);
      formData.append("stock", product.stock);
      formData.append("createdBy", product.createdBy);
      formData.append("discountPercentage", product.discountPercentage);
      for (let i = 0; i < product.images.length; i++) {
        formData.append("images", product.images[i]);
      }
      formData.append("categories", JSON.stringify(product.categories));
      const selectedTags = product.tags
        .map((tagId) => {
          const tag = tags.find((t) => t._id === tagId);
          return tag ? tag.name : null;
        })
        .filter((tag) => tag !== null);

      formData.append("tags", JSON.stringify(selectedTags));

      const response = await apiService.post("/product/newProduct", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Product submitted successfully:", response.data);
      window.alert(response.data.message);
      // Reset form after submission
      setProduct({
        name: "",
        description: "",
        price: 0,
        discountPercentage: 0,
        stock: 0,
        images: [],
        categories: [],
        tags: [],
        createdBy: "67812027f5af736c12d2a245",
        isActive: true,
      });
    } catch (err) {
      console.error("Error submitting product:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleClearForm = () => {
    setProduct({
      name: "",
      description: "",
      price: 0,
      discountPercentage: 0,
      stock: 0,
      images: [],
      categories: [],
      tags: [],
      createdBy: "67812027f5af736c12d2a245",
      isActive: true,
    });
    setErrors({});
  };

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Product Name"
              name="name"
              value={product.name}
              error={!!errors.name}
              helperText={errors.name}
              onChange={handleInputChange}
              required
            />
            <TextField
              label="Description"
              name="description"
              value={product.description}
              onChange={handleInputChange}
              multiline
              rows={3}
              error={!!errors.description}
              helperText={errors.description}
              required
            />
            <Box display="flex" gap={2}>
              <TextField
                label="Price"
                name="price"
                type="number"
                value={product.price}
                onChange={handleInputChange}
                error={!!errors.price}
                helperText={errors.price}
                required
              />
              <TextField
                label="Discount (%)"
                name="discountPercentage"
                type="number"
                value={product.discountPercentage}
                onChange={handleInputChange}
                error={!!errors.discountPercentage}
                helperText={errors.discountPercentage}
              />
            </Box>
            <TextField
              label="Stock"
              name="stock"
              type="number"
              value={product.stock}
              onChange={handleInputChange}
              error={!!errors.stock}
              helperText={errors.stock}
              required
            />
            <Box mt={2}>
              <Typography variant="subtitle1">Upload Images</Typography>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
              />
              <Box display="flex" flexWrap="wrap" gap={2} mt={2}>
                {product.images.map((file, index) => (
                  <Box key={index} position="relative">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Preview ${index + 1}`}
                      style={{
                        width: 100,
                        height: 100,
                        objectFit: "cover",
                        borderRadius: 8,
                      }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => removeImage(index)}
                      style={{
                        position: "absolute",
                        top: -8,
                        right: -8,
                        background: "white",
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ))}
              </Box>
              {errors.images && (
                <Typography variant="caption" color="error">
                  {errors.images}
                </Typography>
              )}
            </Box>
            <FormControl fullWidth>
              <InputLabel>Categories</InputLabel>
              <Select
                multiple
                value={product.categories}
                onChange={(e) =>
                  setProduct({ ...product, categories: e.target.value })
                }
                error={!!errors.categories}
              >
                {categories.map((category) => (
                  <MenuItem key={category._id} value={category._id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.categories && (
                <Typography variant="caption" color="error">
                  {errors.categories}
                </Typography>
              )}
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Tags</InputLabel>
              <Select
                multiple
                value={product.tags}
                onChange={(e) =>
                  setProduct({ ...product, tags: e.target.value })
                }
                error={!!errors.tags}
              >
                {tags.map((tag) => (
                  <MenuItem key={tag._id} value={tag._id}>
                    {tag.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.tags && (
                <Typography variant="caption" color="error">
                  {errors.tags}
                </Typography>
              )}
            </FormControl>
          </Box>
        </form>
      </CardContent>
      <CardActions>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          fullWidth
        >
          {loading ? <CircularProgress size={24} /> : "Add Product"}
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleClearForm}
          fullWidth
        >
          Clear Form
        </Button>
      </CardActions>
    </Card>
  );
};

export default AddProduct;
