import * as React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  TablePagination,
  Chip,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
  Badge,
  Avatar,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Print as PrintIcon,
  FileDownload as ExportIcon,
  MoreVert as MoreIcon,
  CheckCircle as CompletedIcon,
  LocalShipping as ShippedIcon,
  Payment as PaidIcon,
  Cancel as CancelledIcon,
  Pending as PendingIcon,
  Dashboard as DashboardIcon
} from '@mui/icons-material';

// Sample order data including detailed items for each order
const initialOrders = [
  {
    id: '#ORD-2023-001',
    customer: 'John Smith',
    date: '2023-06-15',
    status: 'Accepted',
    items: [
      { productId: 1222, category: 'Electronics', title: 'Earphone', quantity: 2, price: 100 },
      { productId: 1223, category: 'Electronics', title: 'Charger', quantity: 1, price: 49.99 },
    ],
    amount: 249.99,
    payment: 'paid'
  },
  {
    id: '#ORD-2023-002',
    customer: 'Sarah Johnson',
    date: '2023-06-16',
    status: 'Preparing',
    items: [
      { productId: 1345, category: 'Home', title: 'Blender', quantity: 1, price: 120 },
      { productId: 1346, category: 'Home', title: 'Toaster', quantity: 2, price: 55.75 },
    ],
    amount: 231.50,
    payment: 'paid'
  },
  {
    id: '#ORD-2023-003',
    customer: 'Michael Brown',
    date: '2023-06-17',
    status: 'Shipped',
    items: [
      { productId: 1450, category: 'Books', title: 'React Guide', quantity: 1, price: 89.99 },
      { productId: 1451, category: 'Books', title: 'JavaScript Basics', quantity: 1, price: 60 },
    ],
    amount: 149.99,
    payment: 'pending'
  },
  {
    id: '#ORD-2023-004',
    customer: 'Emily Davis',
    date: '2023-06-18',
    status: 'Cancelled',
    items: [
      { productId: 1550, category: 'Clothing', title: 'T-Shirt', quantity: 1, price: 45.00 },
    ],
    amount: 45.00,
    payment: 'refunded'
  },
  {
    id: '#ORD-2023-005',
    customer: 'Robert Wilson',
    date: '2023-06-19',
    status: 'Out for Delivery',
    items: [
      { productId: 1600, category: 'Sports', title: 'Football', quantity: 2, price: 89.95 },
      { productId: 1601, category: 'Sports', title: 'Jersey', quantity: 1, price: 50 },
    ],
    amount: 229.90,
    payment: 'paid'
  },
];

const statusIcons = {
  completed: <CompletedIcon color="success" />,
  shipped: <ShippedIcon color="info" />,
  pending: <PendingIcon color="warning" />,
  cancelled: <CancelledIcon color="error" />,
  processing: <PaidIcon color="primary" />,
  all: <DashboardIcon color="secondary" /> // icon for 'all'
};

const statusColors = {
  Accepted: 'primary',
  Preparing: 'info',
  Shipped: 'warning',
  'Out for Delivery': 'secondary',
  Delivered: 'success',
  completed: 'success',
  shipped: 'info',
  pending: 'warning',
  cancelled: 'error',
  processing: 'primary',
  all: 'secondary' // color for 'all'
};

export default function Order() {
  const [orders, setOrders] = React.useState(initialOrders);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [openDialog, setOpenDialog] = React.useState(false);
  const [selectedOrder, setSelectedOrder] = React.useState(null);
  const [status, setStatus] = React.useState('');

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredOrders = orders.filter(order => 
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Open dialog & set selected order + status
  const handleViewClick = (order) => {
    setSelectedOrder(order);
    setStatus(order.status);
    setOpenDialog(true);
  };

  // Close dialog & clear selected order
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedOrder(null);
  };

  // Update status value on select change
  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  // Save new status and update orders state
  const handleSaveStatus = () => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === selectedOrder.id ? { ...order, status } : order
      )
    );
    setOpenDialog(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">Order Management</Typography>
        <Stack direction="row" spacing={2}>
          <Button variant="contained" color="primary" startIcon={<PrintIcon />}>Print</Button>
          <Button variant="outlined" startIcon={<ExportIcon />}>Export</Button>
        </Stack>
      </Box>

      {/* Filters/Search */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search orders..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ width: 300 }}
          />
          <Stack direction="row" spacing={1}>
            <Tooltip title="Filters">
              <IconButton>
                <Badge badgeContent={3} color="primary">
                  <FilterIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            <IconButton><MoreIcon /></IconButton>
          </Stack>
        </Box>
      </Paper>

      {/* Status Summary */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        {['all', 'completed', 'shipped', 'pending', 'cancelled'].map((statusKey) => (
          <Paper key={statusKey} sx={{ p: 2, flex: 1, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{
                bgcolor: theme => theme.palette[statusColors[statusKey] || 'grey'].light,
                color: theme => theme.palette[statusColors[statusKey] || 'grey'].dark,
                mr: 2
              }}>
                {statusIcons[statusKey] || <PaidIcon />}
              </Avatar>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  {statusKey === 'all' ? 'Total Orders' : statusKey.charAt(0).toUpperCase() + statusKey.slice(1)}
                </Typography>
                <Typography variant="h6">
                  {statusKey === 'all' ? orders.length : orders.filter(o => o.status.toLowerCase() === statusKey).length}
                </Typography>
              </Box>
            </Box>
          </Paper>
        ))}
      </Box>

      {/* Orders Table */}
      <Paper sx={{ mb: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Items</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Payment</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((order) => (
                <TableRow key={order.id}>
                  <TableCell><Typography variant="body2" color="primary">{order.id}</Typography></TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>{order.items.reduce((sum, item) => sum + item.quantity, 0)}</TableCell>
                  <TableCell>${order.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Chip
                      label={order.status}
                      color={statusColors[order.status] || 'default'}
                      variant="outlined"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={order.payment.charAt(0).toUpperCase() + order.payment.slice(1)}
                      color={order.payment === 'paid' ? 'success' : 'warning'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {/* View button triggers dialog */}
                    <Button size="small" variant="outlined" onClick={() => handleViewClick(order)}>View</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredOrders.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Recent Activity */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>Recent Activity</Typography>
        <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', py: 1 }}>
          {[...orders].reverse().slice(0, 4).map(order => (
            <Paper key={order.id} sx={{ p: 2, minWidth: 200 }}>
              <Typography variant="subtitle2">{order.id}</Typography>
              <Typography variant="body2" color="text.secondary">{order.customer}</Typography>
              <Chip
                label={order.status}
                color={statusColors[order.status] || 'default'}
                size="small"
                sx={{ mt: 1 }}
              />
            </Paper>
          ))}
        </Box>
      </Paper>

      {/* Order Details Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>Order Details - {selectedOrder?.id}</DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <>
              <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Product ID</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>Title</TableCell>
                      <TableCell>Total Items</TableCell>
                      <TableCell>Price per item ($)</TableCell>
                      <TableCell>Total price ($)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedOrder.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.productId}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>{item.title}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{item.price.toFixed(2)}</TableCell>
                        <TableCell>{(item.price * item.quantity).toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Status selector */}
              <FormControl fullWidth sx={{ mt: 3 }}>
                <InputLabel id="order-status-label">Change Order Status</InputLabel>
                <Select
                  labelId="order-status-label"
                  value={status}
                  label="Change Order Status"
                  onChange={handleStatusChange}
                >
                  <MenuItem value="Accepted">Accepted</MenuItem>
                  <MenuItem value="Preparing">Preparing</MenuItem>
                  <MenuItem value="Shipped">Shipped</MenuItem>
                  <MenuItem value="Out for Delivery">Out for Delivery</MenuItem>
                  <MenuItem value="Delivered">Delivered</MenuItem>
                </Select>
              </FormControl>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveStatus} disabled={!status}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
