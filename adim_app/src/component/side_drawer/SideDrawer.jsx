import * as React from "react";
import { extendTheme, styled } from "@mui/material/styles";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CategoryIcon from "@mui/icons-material/Category";
import BarChartIcon from "@mui/icons-material/BarChart";
import DescriptionIcon from "@mui/icons-material/Description";
import LayersIcon from "@mui/icons-material/Layers";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { PageContainer } from "@toolpad/core/PageContainer";
import Grid from "@mui/material/Grid2";
import Dashboard from "../../page/Dashboard";
import Order from "../../page/Order";
import Category from "../../page/Category";
import AddCategory from "../../page/AddCategory";
const RouterContext = React.createContext();
import AddIcon from "@mui/icons-material/Add";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import AddProduct from "../../page/product/AddNewProduct";
import ProductListing from "../../page/product/AllProducts";
import { AccountPreview } from "@toolpad/core/Account";
import Box from "@mui/material/Box"; // For layout
import Avatar from "@mui/material/Avatar"; // For user image
import IconButton from "@mui/material/IconButton"; // For the logout button
import LogoutIcon from "@mui/icons-material/Logout"; // For logout icon
import Cookies from "js-cookie";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const NAVIGATION = [
  {
    kind: "header",
    title: "Main items",
  },
  {
    segment: "dashboard",
    title: "Dashboard",
    path: "/dashboard",
    icon: <DashboardIcon />,
  },
  {
    segment: "product",
    title: "Product",
    icon: <CategoryIcon />,
    children: [
      {
        segment: "view",
        title: "Products",
        path: "/product/view",
        icon: <ArrowCircleUpIcon />,
      },
      {
        segment: "addProduct",
        title: "Add Product",
        path: "/product/addProduct",
        icon: <AddIcon />,
      },
    ],
  },
  {
    segment: "orders",
    title: "Orders",
    path: "/orders",
    icon: <ShoppingCartIcon />,
  },
  {
    segment: "categories",
    title: "Categories",
    icon: <CategoryIcon />,
    children: [
      {
        segment: "all",
        title: "All",
        path: "/all",
        icon: <ArrowCircleUpIcon />,
      },
      {
        segment: "addCategory",
        title: "Add Category",
        path: "/addCategory",
        icon: <AddIcon />,
      },
    ],
  },
  {
    kind: "divider",
  },
  {
    kind: "header",
    title: "Analytics",
  },
  {
    segment: "reports",
    title: "Reports",
    icon: <BarChartIcon />,
    children: [
      {
        segment: "sales",
        title: "Sales",
        icon: <DescriptionIcon />,
      },
      {
        segment: "traffic",
        title: "Traffic",
        icon: <DescriptionIcon />,
      },
    ],
  },
  {
    segment: "integrations",
    title: "Integrations",
    icon: <LayersIcon />,
  },
];

export function useDemoRouter(initialPath) {
  const [pathname, setPathname] = React.useState(
    window.location.pathname || initialPath
  );
  const [state, setState] = React.useState(null);

  // Handle back/forward navigation and state retrieval
  React.useEffect(() => {
    const handlePopState = (event) => {
      setPathname(window.location.pathname);
      setState(event.state || null); // Retrieve state stored in the history
    };

    window.addEventListener("popstate", handlePopState);

    // Initial state retrieval on mount
    if (window.history.state) {
      setState(window.history.state);
    }

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const router = React.useMemo(() => {
    return {
      pathname,
      searchParams: new URLSearchParams(window.location.search),
      state, // Expose the state
      navigate: (path, stateData = null) => {
        setPathname(path);
        setState(stateData);
        window.history.pushState(stateData, "", path); // Store state in history
      },
    };
  }, [pathname, state]);

  return router;
}

export function RouterProvider({ initialPath, children }) {
  const router = useDemoRouter(initialPath);
  return (
    <RouterContext.Provider value={router}>{children}</RouterContext.Provider>
  );
}

export function useRouter() {
  return React.useContext(RouterContext);
}

export function SideDrawer(props) {
  const router = useRouter();
  const navigate = useNavigate();
  const data = Cookies.get("user");
  const user = JSON.parse(data);
  const account = {
    name: user.name,
    email: user.email,
    profileImage: "https://i.pravatar.cc/150?img=3", // Replace with real image URL or dynamic data
  };

  const handleLogout = () => {
    // Clear session, token, etc.
    console.log("Logging out...");
    Cookies.remove("token");
    Cookies.remove("user");
    // Redirect to login page
    navigate("/login");
  };

  return (
    <AppProvider
      navigation={NAVIGATION}
      router={router}
      branding={{
        logo: <img src="https://mui.com/static/logo.png" alt="MUI logo" />,
        title: "BlynkMart",
        homeUrl: "/dashboard",
      }}
    >
      <DashboardLayout key={router.pathname}>
        <PageContainer key={router.pathname}>
          {(() => {
            switch (router.pathname) {
              case "/dashboard":
                return <Dashboard />;
              case "/orders":
                return <Order />;
              case "/categories":
                return <Category />;
              case "/categories/all":
                return <Category />;
              case "/product":
                return <ProductListing />;
              case "/product/view":
                return <ProductListing />;
              case "/product/addProduct":
                return <AddProduct />;
              case "/categories/addCategory":
                return <AddCategory />;
              default:
                return <div>404 - Page Not Found</div>;
            }
          })()}
        </PageContainer>
        {/* Account section */}
        {/* <Box
          sx={{ padding: 2, position: "absolute", bottom: 0, width: "100%" }}
        >
          <AccountPreview account={account} />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 1,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Avatar alt={account.name} src={account.profileImage} />
              <Box sx={{ ml: 1 }}>
                <div>{account.name}</div>
                <div>{account.email}</div>
              </Box>
              <IconButton
                sx={{ ml: 10 }}
                color="primary"
                onClick={() => {
                  handleLogout();
                }}
              >
                <LogoutIcon />
              </IconButton>
            </Box>
          </Box>
        </Box> */}
      </DashboardLayout>
    </AppProvider>
  );
}
