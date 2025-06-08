import React, { useEffect, useState } from "react";
import { apiService } from "../services/apiServices.js";
import PrimaryCard from "../component/PrimaryCard.jsx";
import { Button, Grid2 } from "@mui/material";
import "./css/Category.css";
import AddIcon from "@mui/icons-material/Add";
import {
  useDemoRouter,
  useRouter,
} from "../component/side_drawer/SideDrawer.jsx";
import { useNavigate } from "react-router-dom";

function Category() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [onBtnClick, setOnBtnClick] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCategories() {
      try {
        const api = await apiService.get("/category");
        const response = api.data;
        setCategories(response.data.categories);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const handleCardClick = (category) => {
    console.log("Navigating with category: ", category);
    navigate("/categories/addCategory", { category });
  };

  const deleteCategory = async (category) => {
    try {
      const response = await apiService.post("/category/delete", {
        id: category._id,
      });

      if (response.status === 200) {
        // Show a success alert
        window.alert("Category deleted successfully!");
        console.log("Category deleted:", response.data);

        window.location.reload();
      } else {
        // Show an error alert for non-200 status
        window.alert(`Failed to delete category: ${response.statusText}`);
        console.error("Failed to delete category:", response.statusText);
      }
    } catch (err) {
      window.alert(
        "An error occurred while deleting the category. Please try again."
      );
      console.error("Error while deleting category:", err.message);
    }
  };

  const editCategory = (category) => {};

  return (
    <div className="category-container">
      <div className="add-category-btn">
        <Button
          onClick={() => {
            navigate("/categories/addCategory");
            setOnBtnClick(true);
          }}
          variant="contained"
          color="success"
          size="medium"
          startIcon={<AddIcon />}
          sx={{
            "&:focus": {
              outline: "none",
              boxShadow: "0 0 0 2px #4caf50",
            },
          }}
        >
          Click to add new Category
        </Button>
      </div>
      {onBtnClick ? (
        <div>
          <p>Add new Category</p>
        </div>
      ) : (
        <Grid2 container spacing={3}>
          {categories.length > 0 ? (
            categories.map((category) => (
              <Grid2 item xs={12} sm={6} md={4} lg={3} key={category._id}>
                <PrimaryCard
                  title={category.name}
                  description={category.description}
                  image={category.image.url}
                  onClick={() => handleCardClick(category)}
                  onDelete={() => {
                    deleteCategory(category);
                  }}
                  onEdit={() => {
                    editCategory(category);
                  }}
                />
              </Grid2>
            ))
          ) : (
            <div className="no-data-container">
              <p>No Data to Show</p>
            </div>
          )}
        </Grid2>
      )}
    </div>
  );
}

export default Category;
