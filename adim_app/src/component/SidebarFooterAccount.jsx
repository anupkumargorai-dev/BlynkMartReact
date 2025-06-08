import React from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Cookies from "js-cookie";
import { Navigate, useNavigate } from "react-router-dom";


function SidebarFooterAccount() {
  // Replace with your auth/session logic
   const navigate = useNavigate();
  const user = {
    name: "Bharat Kashyap",
    email: "bharatkashyap@outlook.com",
    image: "https://avatars.githubusercontent.com/u/19550456",
  };

  const handleSignOut = () => {
    Cookies.remove("token");
    Cookies.remove("user");
    navigate("/login");
    alert("Signing out...");
  };

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={2}
      sx={{ p: 2, borderTop: "1px solid", borderColor: "divider" }}
    >
      <Avatar src={user.image} alt={user.name} />
      <Stack spacing={0} flexGrow={1}>
        <Typography variant="body2" fontWeight="bold">
          {user.name}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {user.email}
        </Typography>
      </Stack>
      <Button variant="outlined" size="small" onClick={handleSignOut}>
        Sign Out
      </Button>
    </Stack>
  );
}

export default SidebarFooterAccount;
