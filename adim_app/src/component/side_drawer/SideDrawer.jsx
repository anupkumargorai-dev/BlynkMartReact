import * as React from "react";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { PageContainer } from "@toolpad/core/PageContainer";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CategoryIcon from "@mui/icons-material/Category";
import BarChartIcon from "@mui/icons-material/BarChart";
import DescriptionIcon from "@mui/icons-material/Description";
import LayersIcon from "@mui/icons-material/Layers";
import AddIcon from "@mui/icons-material/Add";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import LogoutIcon from "@mui/icons-material/Logout";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Cookies from "js-cookie";
import { Navigate, useNavigate } from "react-router-dom";
import { red } from "@mui/material/colors";

import Dashboard from "../../page/Dashboard";
import Order from "../../page/Order";
import Category from "../../page/Category";
import AddCategory from "../../page/AddCategory";
import AddProduct from "../../page/product/AddNewProduct";
import ProductListing from "../../page/product/AllProducts";

// ────────────────────────────────────────────────────────────
// 🔧 Custom Router Context
const RouterContext = React.createContext();

export function useDemoRouter(initialPath = "/dashboard") {
  const [pathname, setPathname] = React.useState(window.location.pathname || initialPath);
  const [state, setState] = React.useState(null);

  React.useEffect(() => {
    const handlePopState = (event) => {
      setPathname(window.location.pathname);
      setState(event.state || null);
    };
    window.addEventListener("popstate", handlePopState);

    if (window.history.state) {
      setState(window.history.state);
    }

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const router = React.useMemo(() => ({
    pathname,
    searchParams: new URLSearchParams(window.location.search),
    state,
    navigate: (path, stateData = null) => {
      setPathname(path);
      setState(stateData);
      window.history.pushState(stateData, "", path);
    },
  }), [pathname, state]);

  return router;
}

export function RouterProvider({ initialPath, children }) {
  const router = useDemoRouter(initialPath);
  return <RouterContext.Provider value={router}>{children}</RouterContext.Provider>;
}

export function useRouter() {
  return React.useContext(RouterContext);
}

// ────────────────────────────────────────────────────────────
// 📁 Navigation Items
const NAVIGATION = [
  { kind: "header", title: "Main items" },
  { segment: "dashboard", title: "Dashboard", path: "/dashboard", icon: <DashboardIcon /> },
  {
    segment: "product",
    title: "Product",
    icon: <CategoryIcon />,
    children: [
      { segment: "view", title: "Products", path: "/product/view", icon: <ArrowCircleUpIcon /> },
      { segment: "addProduct", title: "Add Product", path: "/product/addProduct", icon: <AddIcon /> },
    ],
  },
  { segment: "orders", title: "Orders", path: "/orders", icon: <ShoppingCartIcon /> },
  {
    segment: "categories",
    title: "Categories",
    icon: <CategoryIcon />,
    children: [
      { segment: "all", title: "All", path: "/categories/all", icon: <ArrowCircleUpIcon /> },
      { segment: "addCategory", title: "Add Category", path: "/categories/addCategory", icon: <AddIcon /> },
    ],
  },
  { kind: "divider" },
  { kind: "header", title: "Analytics" },
  {
    segment: "reports",
    title: "Reports",
    icon: <BarChartIcon />,
    children: [
      { segment: "sales", title: "Sales", icon: <DescriptionIcon /> },
      { segment: "traffic", title: "Traffic", icon: <DescriptionIcon /> },
    ],
  },
  { segment: "integrations", title: "Integrations", icon: <LayersIcon /> },
];

// ────────────────────────────────────────────────────────────
// 🚪 SideDrawer Component with Routing Logic
export function SideDrawer() {
  const router = useRouter();
  const navigate = useNavigate();
  const data = Cookies.get("user");
  const user = JSON.parse(data || "{}");

  const account = {
    name: user?.name || "Guest",
    email: user?.email || "guest@example.com",
    profileImage: "https://i.pravatar.cc/150?img=3",
  };

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("user");
    navigate("/login");
  };

  const renderPage = () => {
    switch (router.pathname) {
      case "/":
      case "/dashboard":
        return <Dashboard />;
      case "/orders":
        return <Order />;
      case "/categories":
      case "/categories/all":
        return <Category />;
      case "/categories/addCategory":
        return <AddCategory />;
      case "/product":
      case "/product/view":
        return <ProductListing />;
      case "/product/addProduct":
        return <AddProduct />;
      default:
        return <div>404 - Page Not Found</div>;
    }
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
        <PageContainer key={router.pathname}>{renderPage()}</PageContainer>
        <AccountSidebarSection account={account} onLogout={handleLogout} />
      </DashboardLayout>
    </AppProvider>
  );
}

// ────────────────────────────────────────────────────────────
// 👤 Sidebar Account Info Component
function AccountSidebarSection({ account, onLogout }) {
  return (
    <Box sx={{ mt: "auto", p: 2, borderTop: "1px solid #e0e0e0", backgroundColor: "#fafafa" }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Avatar alt={account.name} src={account.profileImage} sx={{ width: 40, height: 40 }} />
          <Box sx={{ ml: 2 }}>
            <Box sx={{ fontWeight: 600 }}>{account.name}</Box>
            <Box sx={{ fontSize: "0.85rem", color: "text.secondary" }}>{account.email}</Box>
          </Box>
        </Box>
        <IconButton sx={{ ml: 1, color: red[500] }} onClick={onLogout} title="Logout">
          <LogoutIcon />
        </IconButton>
      </Box>
    </Box>
  );
}
