import React, { useState, useEffect } from "react";
import { apiService } from "../services/apiServices.js";
import {
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  Box,
  Avatar,
} from "@mui/material";
import PlaceholderImage from "../assets/react.svg"; // Add the path to your placeholder image here
import {
  useDemoRouter,
  useRouter,
} from "../component/side_drawer/SideDrawer.jsx";
import Cookies from "js-cookie";
function AddCategory({ onSubmit }) {
  const [categoryName, setCategoryName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [btnName, setBtnName] = useState("Add Category");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [categoryImage, setCategoryImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false); // To track loading state
  const [error, setError] = useState(null); // To track error state

  const router = useDemoRouter();

  useEffect(() => {
    // Log only when router.state changes
    console.log("Current State: ", router.state);
    const category = router.state?.category;
    if (category) {
      setCategoryName(category.name);
      setCategoryDescription(category.description);
      setCategoryId(category._id);
      setImagePreview(category.image.url);
      setBtnName("Update");
    }
  }, [router.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoryName || !categoryDescription) {
      alert("Please fill all required fields");
      return;
    }

    setLoading(true);
    setError(null);

    // Preparing the form data for submission
    const formData = new FormData();
    const data = Cookies.get("user");
    const user = JSON.parse(data);

    formData.append("name", categoryName);
    formData.append("description", categoryDescription);
    formData.append("createdBy", user._id);
    if (categoryId) {
      formData.append("id", categoryId);
    }
    if (categoryImage) {
      console.log("Image file: ", categoryImage);
      formData.append("image", categoryImage);
    }

    try {
      // Sending the POST request with the form data
      let endPoint =
        btnName === "Update" ? "/category/update" : "/category/add";
      const postResponse = await apiService.post(endPoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Correct header for file upload
        },
      });

      if (postResponse.status === 200) {
        // Handle successful form submission
        alert("Category added successfully!");
        // Clear the form
        setCategoryName("");
        setCategoryDescription("");
        setCategoryImage(null);
        setImagePreview(null);
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Failed to add category. Please try again.");
      setCategoryName("");
      setCategoryDescription("");
      setCategoryImage(null);
      setImagePreview(null);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setCategoryImage(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file)); // Create a URL for image preview
    }
  };

  return (
    <Box padding={3} bgcolor="#f5f5f5">
      <Card
        elevation={3}
        style={{ maxWidth: 600, margin: "0 auto", padding: "20px" }}
      >
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Box display="flex" flexDirection="column" gap={2}>
              <TextField
                fullWidth
                label="Category Name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                required
              />
              <TextField
                fullWidth
                label="Category Description"
                value={categoryDescription}
                onChange={(e) => setCategoryDescription(e.target.value)}
                multiline
                rows={3}
                required
              />
              <Box display="flex" alignItems="center" gap={2}>
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  style={{
                    width: 200,
                    height: 200,
                    borderRadius: "8px",
                    border: "1px solid #ddd",
                    backgroundColor: "#f5f5f5",
                    overflow: "hidden",
                  }}
                >
                  <Avatar
                    alt="Category Image"
                    src={imagePreview || PlaceholderImage}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      padding: 20,
                    }}
                  />
                </Box>
                <Button variant="contained" component="label">
                  Choose Image
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </Button>
              </Box>
              {categoryImage && (
                <Typography variant="body2" style={{ marginTop: 8 }}>
                  {categoryImage.name}
                </Typography>
              )}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
              >
                {btnName}
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}

export default AddCategory;
