import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { PageContainer } from "@toolpad/core/PageContainer";
import AppRouter from "./routes/AppRouter.jsx"; // path to the router file

// src/config/navigation.js (or any appropriate place)
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CategoryIcon from "@mui/icons-material/Category";
import BarChartIcon from "@mui/icons-material/BarChart";
import DescriptionIcon from "@mui/icons-material/Description";
import LayersIcon from "@mui/icons-material/Layers";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import AddIcon from "@mui/icons-material/Add";
import SidebarFooterAccount from "./component/SidebarFooterAccount.jsx"; // adjust the path
import Login from "./page/Login.jsx"
import Cookies from "js-cookie";
import * as React from "react";

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
        path: "/categories/all",
        icon: <ArrowCircleUpIcon />,
      },
      {
        segment: "addCategory",
        title: "Add Category",
        path: "/categories/addCategory",
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

function useRouter() {
  const RouterContext = React.createContext();
  return React.useContext(RouterContext);
}

export default function App() {
  const token = Cookies.get("token");
  const router = useRouter();

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes wrapped with layout only if token exists */}
        <Route
          path="/*"
          element={
            token ? (
              <AppProvider
                navigation={NAVIGATION}
                router={router}
                branding={{
                  logo: null,
                  title: "BlynkMart",
                  homeUrl: "/dashboard",
                }}
              >
                <DashboardLayout
                  slots={{ toolbarAccount: () => null, sidebarFooter: SidebarFooterAccount }}
                >
                  <PageContainer>
                    <AppRouter />
                  </PageContainer>
                </DashboardLayout>
              </AppProvider>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
