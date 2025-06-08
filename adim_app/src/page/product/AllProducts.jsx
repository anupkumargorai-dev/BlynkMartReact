import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  IconButton,
  CircularProgress,
  Chip,
  Rating,
  Tooltip,
  Skeleton,
  Alert,
  Snackbar,
  Pagination,
  useMediaQuery,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  List,
  ListItem,
  ListItemText
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
import { apiService } from "../../services/apiServices.js";
import { motion } from "framer-motion";
import { styled } from "@mui/material/styles";

const StyledCard = styled(Card)(({ theme }) => ({
  transition: "transform 0.3s, box-shadow 0.3s",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: theme.shadows[6],
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  transition: "all 0.3s",
  "&:hover": {
    transform: "scale(1.05)",
  },
}));

const ProductListing = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openDetails, setOpenDetails] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  // Fetch products
  const fetchProducts = async (pageNumber, reset = false) => {
    try {
      setLoading(true);
      setError(null);
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
      setError("Failed to load products. Please try again.");
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
        setSuccess("Product deleted successfully!");
        fetchProducts(currentPage, true);
      } else {
        setError("Failed to delete product. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      setError("Something went wrong!");
    }
  };

  const toggleWishlist = (id) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleEdit = (id) => {
    console.log(`Edit product with ID: ${id}`);
    // Navigation to edit page would go here
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      deleteProduct(id);
    }
  };

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setOpenDetails(true);
  };

  const handleCloseDetails = () => {
    setOpenDetails(false);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleLoadMore = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handleCloseSnackbar = () => {
    setError(null);
    setSuccess(null);
  };

  return (
    <Box sx={{ p: isMobile ? 1 : 3 }}>
      {/* Error/Success Alerts */}
      <Snackbar
        open={!!error || !!success}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={error ? "error" : "success"}
          sx={{ width: "100%" }}
        >
          {error || success}
        </Alert>
      </Snackbar>

      {/* Product Details Dialog */}
      <Dialog
        open={openDetails}
        onClose={handleCloseDetails}
        maxWidth="md"
        fullWidth
      >
        {selectedProduct && (
          <>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {selectedProduct.name}
              <IconButton onClick={handleCloseDetails}>
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <CardMedia
                    component="img"
                    height="400"
                    image={selectedProduct.images[0]?.url || "/placeholder.png"}
                    alt={selectedProduct.name}
                    sx={{ objectFit: 'contain', borderRadius: 1 }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Rating
                        value={selectedProduct.rating || 0}
                        precision={0.5}
                        readOnly
                      />
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                        ({selectedProduct.reviewCount || 0} reviews)
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h5" color="primary" sx={{ fontWeight: 700, mr: 2 }}>
                        ₹{selectedProduct.price}
                      </Typography>
                      {selectedProduct.originalPrice && (
                        <Typography variant="body1" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                          ₹{selectedProduct.originalPrice}
                        </Typography>
                      )}
                      {selectedProduct.discount && (
                        <Chip
                          label={`${selectedProduct.discount}% OFF`}
                          color="error"
                          size="small"
                          sx={{ ml: 2, fontWeight: 'bold' }}
                        />
                      )}
                    </Box>

                    {selectedProduct.stock <= 10 && selectedProduct.stock > 0 && (
                      <Typography variant="body2" color="error" sx={{ mb: 2 }}>
                        Only {selectedProduct.stock} left in stock!
                      </Typography>
                    )}
                    {selectedProduct.stock === 0 && (
                      <Chip
                        label="Out of Stock"
                        color="error"
                        size="medium"
                        sx={{ mb: 2 }}
                      />
                    )}
                  </Box>

                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                    Product Details
                  </Typography>

                  <Typography variant="body1" paragraph>
                    {selectedProduct.description}
                  </Typography>

                  <Divider sx={{ my: 2 }} />


                  <List dense>
                    {selectedProduct.category && (
                      <ListItem>
                        <ListItemText
                          primary="Category"
                          secondary={selectedProduct.category}
                        />
                      </ListItem>
                    )}
                    {selectedProduct.brand && (
                      <ListItem>
                        <ListItemText
                          primary="Brand"
                          secondary={selectedProduct.brand}
                        />
                      </ListItem>
                    )}
                    {selectedProduct.sku && (
                      <ListItem>
                        <ListItemText
                          primary="SKU"
                          secondary={selectedProduct.sku}
                        />
                      </ListItem>
                    )}
                    {/* Add more product details as needed */}
                  </List>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDetails}>Close</Button>
              <Button
                variant="contained"
                color="primary"
                startIcon={<EditIcon />}
                disabled={selectedProduct.stock === 0}
              >
                Edit
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Product Grid */}
      {loading && currentPage === 1 ? (
        <Grid container spacing={3}>
          {[...Array(6)].map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Skeleton variant="rectangular" height={200} />
              <Box sx={{ pt: 0.5 }}>
                <Skeleton />
                <Skeleton width="60%" />
              </Box>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Grid container spacing={3}>
          {products.map((product, index) => (
            <Grid item xs={12} sm={6} md={4} key={product._id}>
              <motion.div
                initial="hidden"
                animate="visible"
                variants={cardVariants}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <StyledCard>
                  {/* Image with Action Buttons */}
                  <Box sx={{ position: "relative" }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={product.images[0]?.url || "/placeholder.png"}
                      alt={product.name}
                      sx={{
                        objectFit: "cover",
                        aspectRatio: "1 / 1",
                      }}
                    />
                    {product.discount && (
                      <Chip
                        label={`${product.discount}% OFF`}
                        color="error"
                        size="small"
                        sx={{
                          position: "absolute",
                          top: 10,
                          left: 10,
                          fontWeight: "bold",
                        }}
                      />
                    )}
                    <Box
                      sx={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        display: "flex",
                        gap: 1,
                      }}
                    >
                      <Tooltip title="Add to wishlist">
                        <IconButton
                          onClick={() => toggleWishlist(product._id)}
                          sx={{
                            backgroundColor: "rgba(255, 255, 255, 0.8)",
                            color: wishlist.includes(product._id)
                              ? "red"
                              : "inherit",
                            "&:hover": {
                              backgroundColor: "rgba(255, 255, 255, 1)",
                            },
                          }}
                        >
                          {wishlist.includes(product._id) ? (
                            <FavoriteIcon />
                          ) : (
                            <FavoriteBorderIcon />
                          )}
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton
                          onClick={() => handleEdit(product._id)}
                          sx={{
                            backgroundColor: "rgba(255, 255, 255, 0.8)",
                            color: "inherit",
                            "&:hover": {
                              backgroundColor: "rgba(255, 255, 255, 1)",
                            },
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          onClick={() => handleDelete(product._id)}
                          sx={{
                            backgroundColor: "rgba(255, 255, 255, 0.8)",
                            color: "inherit",
                            "&:hover": {
                              backgroundColor: "rgba(255, 255, 255, 1)",
                            },
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>

                  {/* Product Details */}
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {product.name}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <Rating
                        value={product.rating || 0}
                        precision={0.5}
                        readOnly
                        size="small"
                      />
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ ml: 1 }}
                      >
                        ({product.reviewCount || 0})
                      </Typography>
                    </Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        mb: 2,
                      }}
                    >
                      {product.description}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Typography
                        variant="h6"
                        color="primary"
                        sx={{ fontWeight: 700, mr: 1 }}
                      >
                        ₹{product.price}
                      </Typography>
                      {product.originalPrice && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ textDecoration: "line-through" }}
                        >
                          ₹{product.originalPrice}
                        </Typography>
                      )}
                    </Box>
                    {product.stock <= 10 && product.stock > 0 && (
                      <Typography
                        variant="caption"
                        color="error"
                        sx={{ display: "block", mt: 1 }}
                      >
                        Only {product.stock} left in stock!
                      </Typography>
                    )}
                    {product.stock === 0 && (
                      <Chip
                        label="Out of Stock"
                        color="error"
                        size="small"
                        sx={{ mt: 1 }}
                      />
                    )}
                  </CardContent>

                  {/* Action Buttons */}
                  <CardActions sx={{ justifyContent: "space-between", p: 2 }}>
                    <StyledButton
                      size="small"
                      variant="outlined"
                      color="secondary"
                      startIcon={<VisibilityIcon />}
                      onClick={() => handleViewDetails(product)}
                    >
                      Details
                    </StyledButton>
                  </CardActions>
                </StyledCard>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Pagination/Load More */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4, mb: 2 }}>
        {isMobile ? (
          <Button
            variant="contained"
            color="primary"
            onClick={handleLoadMore}
            disabled={currentPage >= totalPages || loading}
            sx={{ minWidth: 120 }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Load More"
            )}
          </Button>
        ) : (
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            shape="rounded"
            size="large"
            siblingCount={1}
            boundaryCount={1}
          />
        )}
      </Box>

      {loading && currentPage > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
};

export default ProductListing;