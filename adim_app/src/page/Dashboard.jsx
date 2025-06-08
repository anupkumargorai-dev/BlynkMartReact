import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Stack,
  Avatar,
  LinearProgress,
  Divider,
  IconButton,
  useTheme
} from '@mui/material';
import {
  ShoppingCart as OrdersIcon,
  AttachMoney as RevenueIcon,
  Person as CustomersIcon,
  Inventory as ProductsIcon,
  TrendingUp as GrowthIcon,
  Notifications as AlertsIcon,
  MoreVert as MoreIcon,
  Star as StarIcon,
  LocalShipping as ShippingIcon,
  CreditCard as PaymentsIcon
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';

// Sample data
const metrics = [
  { title: 'Total Revenue', value: '₹24,532', change: '+12%', icon: <RevenueIcon />, color: 'success.main' },
  { title: 'Total Orders', value: '1,245', change: '+8%', icon: <OrdersIcon />, color: 'primary.main' },
  { title: 'New Customers', value: '324', change: '+5%', icon: <CustomersIcon />, color: 'info.main' },
  { title: 'Products Sold', value: '2,543', change: '+15%', icon: <ProductsIcon />, color: 'warning.main' }
];

const salesData = [
  { name: 'Jan', revenue: 4000 },
  { name: 'Feb', revenue: 3000 },
  { name: 'Mar', revenue: 6000 },
  { name: 'Apr', revenue: 8000 },
  { name: 'May', revenue: 5000 },
  { name: 'Jun', revenue: 9000 },
];

const revenueData = [
  { name: 'Electronics', value: 35 },
  { name: 'Fashion', value: 25 },
  { name: 'Home', value: 20 },
  { name: 'Beauty', value: 15 },
  { name: 'Other', value: 5 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const recentOrders = [
  { id: '#ORD-001', customer: 'John Smith', date: '2023-06-15', amount: 149.99, status: 'Shipped' },
  { id: '#ORD-002', customer: 'Sarah Johnson', date: '2023-06-16', amount: 229.50, status: 'Processing' },
  { id: '#ORD-003', customer: 'Michael Brown', date: '2023-06-17', amount: 89.99, status: 'Delivered' },
  { id: '#ORD-004', customer: 'Emily Davis', date: '2023-06-18', amount: 45.00, status: 'Cancelled' },
  { id: '#ORD-005', customer: 'Robert Wilson', date: '2023-06-19', amount: 179.95, status: 'Shipped' }
];

const topProducts = [
  { name: 'Wireless Headphones', sales: 342, revenue: '$5,130' },
  { name: 'Smart Watch', sales: 278, revenue: '$4,170' },
  { name: 'Bluetooth Speaker', sales: 195, revenue: '$2,925' },
  { name: 'Phone Case', sales: 183, revenue: '$915' },
  { name: 'USB-C Cable', sales: 156, revenue: '$468' }
];

export default function Dashboard() {
  const theme = useTheme();

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Dashboard Overview
        </Typography>
        <Stack direction="row" spacing={1}>
          <IconButton>
            <AlertsIcon />
          </IconButton>
          <IconButton>
            <MoreIcon />
          </IconButton>
        </Stack>
      </Box>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {metrics.map((metric, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper sx={{ p: 3, borderRadius: 2, height: '100%' }} elevation={2}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Avatar sx={{ bgcolor: metric.color, color: 'white' }}>
                  {metric.icon}
                </Avatar>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    {metric.title}
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">{metric.value}</Typography>
                  <Typography variant="body2" sx={{ color: metric.color, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                    {metric.change} <GrowthIcon sx={{ fontSize: 14, ml: 0.5 }} />
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Charts Row */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Sales Trend Chart */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, height: '100%', borderRadius: 2 }} elevation={2}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Sales Trend (Last 6 Months)
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                <XAxis dataKey="name" stroke={theme.palette.text.secondary} />
                <YAxis stroke={theme.palette.text.secondary} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke={theme.palette.primary.main}
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Revenue Breakdown */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '100%', borderRadius: 2 }} elevation={2}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Revenue Breakdown
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={revenueData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {revenueData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Second Row */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Recent Orders */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, borderRadius: 2 }} elevation={2}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight="bold">Recent Orders</Typography>
              <Typography variant="body2" color="primary" sx={{ cursor: 'pointer' }}>
                View All
              </Typography>
            </Box>
            <Stack spacing={2}>
              {recentOrders.map((order) => (
                <Paper key={order.id} sx={{ p: 2, borderRadius: 1 }} variant="outlined">
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography fontWeight="bold">{order.id}</Typography>
                      <Typography variant="body2" color="text.secondary">{order.customer}</Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography fontWeight="bold">{order.amount}</Typography>
                      <Typography
                        variant="body2"
                        color={
                          order.status === 'Shipped' ? 'success.main' :
                            order.status === 'Processing' ? 'warning.main' :
                              order.status === 'Delivered' ? 'info.main' : 'error.main'
                        }
                      >
                        {order.status}
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              ))}
            </Stack>
          </Paper>
        </Grid>

        {/* Top Products */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, borderRadius: 2 }} elevation={2}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Top Selling Products
            </Typography>
            <Stack spacing={3}>
              {topProducts.map((product, index) => (
                <Box key={index}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="subtitle1" fontWeight="medium">{product.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {product.revenue}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <LinearProgress
                      variant="determinate"
                      value={(product.sales / topProducts[0].sales) * 100}
                      sx={{ height: 8, flexGrow: 1, mr: 2, borderRadius: 4 }}
                    />
                    <Typography variant="body2">{product.sales} sold</Typography>
                  </Box>
                </Box>
              ))}
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      {/* Quick Stats */}
      <Paper sx={{ p: 3, borderRadius: 2, mb: 4 }} elevation={2}>
        <Typography variant="h6" gutterBottom fontWeight="bold">
          Quick Stats
        </Typography>
        <Grid container spacing={2}>
          {[
            { icon: <StarIcon color="warning" />, value: '4.8', label: 'Average Rating' },
            { icon: <ShippingIcon color="info" />, value: '92%', label: 'On-Time Delivery' },
            { icon: <PaymentsIcon color="success" />, value: '98%', label: 'Successful Payments' },
            { icon: <CustomersIcon color="primary" />, value: '72%', label: 'Repeat Customers' }
          ].map((stat, index) => (
            <Grid item xs={6} sm={3} key={index}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Avatar sx={{
                  bgcolor: theme.palette.background.paper,
                  width: 56,
                  height: 56,
                  margin: '0 auto 16px',
                  boxShadow: theme.shadows[1]
                }}>
                  {React.cloneElement(stat.icon, { sx: { fontSize: 32 } })}
                </Avatar>
                <Typography variant="h5" fontWeight="bold">{stat.value}</Typography>
                <Typography variant="body2" color="text.secondary">{stat.label}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
}