import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Box,
} from "@mui/material";
import { styled } from "@mui/system";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const StyledCard = styled(Card)(({ theme }) => ({
  position: "relative",
  overflow: "hidden",
  width: 260,
  height: 300,
  transition: "transform 0.3s ease-in-out",
  cursor: "pointer",
  "&:hover": {
    transform: "scale(1.1)",
  },
}));

const TruncatedTypography = styled(Typography)({
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
  textOverflow: "ellipsis",
  WebkitLineClamp: 4,
  justifyContent: true,
  maxHeight: "8.5em",
  textAlign: "jus",
});

function PrimaryCard({ title, description, image, onClick, onEdit, onDelete }) {
  return (
    <StyledCard onClick={onClick} sx={{ position: "relative" }}>
      {image && (
        <Box sx={{ position: "relative" }}>
          <CardMedia component="img" alt={title} height="140" image={image} />
          <Box
            sx={{
              position: "absolute",
              top: 8,
              left: 8,
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              size="small"
              sx={{
                backgroundColor: "gray",
                color: "white",
                height: 30,
                width: 30,
                "&:hover": {
                  backgroundColor: "darkgray",
                },
              }}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              size="small"
              sx={{
                backgroundColor: "gray",
                color: "white",
                height: 30,
                width: 30,
                "&:hover": {
                  backgroundColor: "darkgray",
                },
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>
      )}
      <CardContent>
        <Typography variant="h6" component="div">
          {title}
        </Typography>
        <TruncatedTypography variant="body2" color="textSecondary">
          {description}
        </TruncatedTypography>
      </CardContent>
    </StyledCard>
  );
}

export default PrimaryCard;
