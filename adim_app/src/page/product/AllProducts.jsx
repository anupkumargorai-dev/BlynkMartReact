import React, { useState, useEffect } from "react";
import {
  Grid2,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  IconButton,
  CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { apiService } from "../../services/apiServices.js";

const ProductListing = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // Fetch products
  const fetchProducts = async (pageNumber, reset = false) => {
    try {
      setLoading(true);
      const response = await apiService.get(`/product?page=${pageNumber}`);
      const { products: newProducts, pagination } = response.data.data;

      setProducts((prevProducts) => {
        if (reset) return newProducts;
        const allProducts = [...prevProducts, ...newProducts];
        const uniqueProducts = allProducts.filter(
          (product, index, self) =>
            index === self.findIndex((p) => p._id === product._id)
        );
        return uniqueProducts;
      });
      setTotalPages(pagination.totalPages);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  const deleteProduct = async (id) => {
    try {
      const response = await apiService.post("product/delete", { id });

      if (response.status === 200) {
        window.alert("Product deleted successfully!");
        fetchProducts(currentPage, true);
      } else {
        window.alert("Failed to delete product. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      window.alert("Something went wrong!");
    }
  };

  // Handlers for Edit and Delete
  const handleEdit = (id) => {
    console.log(`Edit product with ID: ${id}`);
  };

  const handleDelete = (id) => {
    console.log(`Delete product with ID: ${id}`);
    deleteProduct(id);
  };

  // Handle Load More
  const handleLoadMore = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid2 container spacing={3}>
        {products.map((product) => (
          <Grid2 item xs={12} sm={6} md={4} key={product._id}>
            <Card sx={{ position: "relative" }}>
              {/* Image with Edit & Delete Buttons */}
              <Box sx={{ position: "relative" }}>
                <CardMedia
                  component="img"
                  height="200"
                  width="200"
                  image={product.images[0]?.url || "/placeholder.png"} // Fallback image
                  alt={product.name}
                />
                <Box
                  sx={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    display: "flex",
                    gap: 1,
                  }}
                >
                  <IconButton
                    onClick={() => handleEdit(product._id)}
                    sx={{
                      backgroundColor: "rgba(128, 128, 128, 0.7)",
                      color: "#fff",
                      "&:hover": { backgroundColor: "rgba(128, 128, 128, 1)" },
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(product._id)}
                    sx={{
                      backgroundColor: "rgba(128, 128, 128, 0.7)",
                      color: "#fff",
                      "&:hover": { backgroundColor: "rgba(128, 128, 128, 1)" },
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>

              {/* Product Details */}
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {product.description}
                </Typography>
                <Typography variant="h6" color="primary" mt={2}>
                  ₹{product.price}
                </Typography>
              </CardContent>

              {/* Add to Cart and Details Buttons */}
              <CardActions>
                <Button size="small" variant="outlined" color="secondary">
                  View Details
                </Button>
              </CardActions>
            </Card>
          </Grid2>
        ))}
      </Grid2>

      {/* Load More Button */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        currentPage < totalPages && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleLoadMore}
            >
              Load More
            </Button>
          </Box>
        )
      )}
    </Box>
  );
};

export default ProductListing;
