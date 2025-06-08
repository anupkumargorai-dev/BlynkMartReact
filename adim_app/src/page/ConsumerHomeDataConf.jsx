import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  TextField,
  Divider,
  IconButton,
  Switch,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Badge
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  ArrowUpward as MoveUpIcon,
  ArrowDownward as MoveDownIcon,
  Image as ImageIcon,
  Visibility as PreviewIcon,
  Save as SaveIcon
} from '@mui/icons-material';

// Sample initial data
const initialHomeConfig = {
  banners: [
    { id: 1, imageUrl: '', link: '', isActive: true, order: 1 },
    { id: 2, imageUrl: '', link: '', isActive: true, order: 2 }
  ],
  categories: [
    { id: 1, name: 'Electronics', imageUrl: '', isFeatured: true, order: 1 },
    { id: 2, name: 'Fashion', imageUrl: '', isFeatured: true, order: 2 }
  ],
  trendingProducts: [],
  recentProducts: [],
  middleBanners: [
    { id: 1, imageUrl: '', link: '', position: 'middle-1', isActive: true }
  ]
};

export default function ConsumerHomeDataConf() {
  const [config, setConfig] = useState(initialHomeConfig);
  const [activeTab, setActiveTab] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleAddItem = (section) => {
    setCurrentItem({ id: Date.now(), isActive: true });
    setEditMode(false);
    setOpenDialog(true);
  };

  const handleEditItem = (item, section) => {
    setCurrentItem({ ...item, section });
    setEditMode(true);
    setOpenDialog(true);
  };

  const handleSaveItem = () => {
    if (editMode) {
      // Update existing item
      setConfig(prev => ({
        ...prev,
        [currentItem.section]: prev[currentItem.section].map(item => 
          item.id === currentItem.id ? currentItem : item
        )
      }));
    } else {
      // Add new item
      setConfig(prev => ({
        ...prev,
        [currentItem.section]: [...prev[currentItem.section], currentItem]
      }));
    }
    setOpenDialog(false);
  };

  const handleDeleteItem = (id, section) => {
    setConfig(prev => ({
      ...prev,
      [section]: prev[section].filter(item => item.id !== id)
    }));
  };

  const handleMoveItem = (id, section, direction) => {
    const items = [...config[section]];
    const index = items.findIndex(item => item.id === id);
    
    if ((direction === 'up' && index > 0) || 
        (direction === 'down' && index < items.length - 1)) {
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      [items[index], items[newIndex]] = [items[newIndex], items[index]];
      
      // Update order values
      items.forEach((item, idx) => {
        item.order = idx + 1;
      });
      
      setConfig(prev => ({ ...prev, [section]: items }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentItem(prev => ({ ...prev, [name]: value }));
  };

  const handleToggle = (id, section, field) => {
    setConfig(prev => ({
      ...prev,
      [section]: prev[section].map(item => 
        item.id === id ? { ...item, [field]: !item[field] } : item
      )
    }));
  };

  const saveConfiguration = () => {
    // API call to save the configuration
    console.log('Saving configuration:', config);
    // axios.post('/api/home-config', config).then(...)
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Home Page Configuration</Typography>
        <Box>
          <Button 
            variant="outlined" 
            startIcon={<PreviewIcon />}
            onClick={() => setPreviewMode(!previewMode)}
            sx={{ mr: 2 }}
          >
            {previewMode ? 'Exit Preview' : 'Preview'}
          </Button>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<SaveIcon />}
            onClick={saveConfiguration}
          >
            Save Configuration
          </Button>
        </Box>
      </Box>

      <Paper sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Banners" />
          <Tab label="Categories" />
          <Tab label="Trending Products" />
          <Tab label="Recent Products" />
          <Tab label="Middle Banners" />
        </Tabs>
        <Divider />
      </Paper>

      {/* Banners Tab */}
      {activeTab === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Button 
              variant="outlined" 
              startIcon={<AddIcon />}
              onClick={() => handleAddItem('banners')}
            >
              Add Banner
            </Button>
          </Grid>
          {config.banners.map((banner) => (
            <Grid item xs={12} md={6} lg={4} key={banner.id}>
              <Paper sx={{ p: 2, position: 'relative' }}>
                <Box sx={{ 
                  height: 150, 
                  bgcolor: 'grey.100', 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2
                }}>
                  {banner.imageUrl ? (
                    <img 
                      src={banner.imageUrl} 
                      alt="Banner" 
                      style={{ maxWidth: '100%', maxHeight: '100%' }}
                    />
                  ) : (
                    <ImageIcon color="disabled" sx={{ fontSize: 40 }} />
                  )}
                </Box>
                <Typography variant="subtitle1">Banner #{banner.order}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {banner.link}
                </Typography>
                <Box sx={{ 
                  position: 'absolute', 
                  top: 8, 
                  right: 8,
                  display: 'flex',
                  gap: 1
                }}>
                  <IconButton size="small" onClick={() => handleEditItem(banner, 'banners')}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleDeleteItem(banner.id, 'banners')}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={banner.isActive}
                        onChange={() => handleToggle(banner.id, 'banners', 'isActive')}
                        size="small"
                      />
                    }
                    label="Active"
                    labelPlacement="start"
                    sx={{ m: 0 }}
                  />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                  <IconButton 
                    size="small" 
                    onClick={() => handleMoveItem(banner.id, 'banners', 'up')}
                    disabled={banner.order === 1}
                  >
                    <MoveUpIcon fontSize="small" />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    onClick={() => handleMoveItem(banner.id, 'banners', 'down')}
                    disabled={banner.order === config.banners.length}
                  >
                    <MoveDownIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Categories Tab */}
      {activeTab === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Button 
              variant="outlined" 
              startIcon={<AddIcon />}
              onClick={() => handleAddItem('categories')}
            >
              Add Category
            </Button>
          </Grid>
          {config.categories.map((category) => (
            <Grid item xs={12} sm={6} md={4} key={category.id}>
              <Paper sx={{ p: 2, position: 'relative' }}>
                <Box sx={{ 
                  height: 120, 
                  bgcolor: 'grey.100', 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2
                }}>
                  {category.imageUrl ? (
                    <img 
                      src={category.imageUrl} 
                      alt={category.name} 
                      style={{ maxWidth: '100%', maxHeight: '100%' }}
                    />
                  ) : (
                    <ImageIcon color="disabled" sx={{ fontSize: 40 }} />
                  )}
                </Box>
                <Typography variant="subtitle1">{category.name}</Typography>
                <Box sx={{ 
                  position: 'absolute', 
                  top: 8, 
                  right: 8,
                  display: 'flex',
                  gap: 1
                }}>
                  <IconButton size="small" onClick={() => handleEditItem(category, 'categories')}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleDeleteItem(category.id, 'categories')}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={category.isFeatured}
                        onChange={() => handleToggle(category.id, 'categories', 'isFeatured')}
                        size="small"
                      />
                    }
                    label="Featured"
                    labelPlacement="start"
                    sx={{ m: 0 }}
                  />
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Other tabs would follow similar patterns */}

      {/* Configuration Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editMode ? 'Edit Item' : 'Add New Item'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="normal"
            fullWidth
            label="Image URL"
            name="imageUrl"
            value={currentItem?.imageUrl || ''}
            onChange={handleInputChange}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Link URL"
            name="link"
            value={currentItem?.link || ''}
            onChange={handleInputChange}
          />
          {activeTab === 1 && (
            <TextField
              margin="normal"
              fullWidth
              label="Category Name"
              name="name"
              value={currentItem?.name || ''}
              onChange={handleInputChange}
            />
          )}
          <FormControlLabel
            control={
              <Switch
                checked={currentItem?.isActive ?? true}
                onChange={(e) => setCurrentItem(prev => ({ 
                  ...prev, 
                  isActive: e.target.checked 
                }))}
              />
            }
            label="Active"
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveItem} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Preview Mode */}
      {previewMode && (
        <Dialog 
          open={previewMode} 
          onClose={() => setPreviewMode(false)} 
          maxWidth="lg"
          fullWidth
        >
          <DialogTitle>Home Page Preview</DialogTitle>
          <DialogContent>
            <Box sx={{ 
              border: '1px dashed grey', 
              p: 2, 
              minHeight: '80vh',
              bgcolor: 'background.paper'
            }}>
              {/* Render preview based on config */}
              <Typography variant="h6" gutterBottom>Banners</Typography>
              <Box sx={{ display: 'flex', overflowX: 'auto', gap: 2, py: 2 }}>
                {config.banners.filter(b => b.isActive).map(banner => (
                  <Paper key={banner.id} sx={{ minWidth: 300, height: 150 }}>
                    {banner.imageUrl ? (
                      <img 
                        src={banner.imageUrl} 
                        alt="Banner" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <Box sx={{ 
                        width: '100%', 
                        height: '100%', 
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: 'grey.100'
                      }}>
                        <Typography>Banner Image</Typography>
                      </Box>
                    )}
                  </Paper>
                ))}
              </Box>

              <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>Featured Categories</Typography>
              <Grid container spacing={2}>
                {config.categories.filter(c => c.isFeatured).map(category => (
                  <Grid item xs={6} sm={4} md={3} key={category.id}>
                    <Paper sx={{ p: 1, textAlign: 'center' }}>
                      <Box sx={{ 
                        height: 100, 
                        bgcolor: 'grey.100', 
                        mb: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {category.imageUrl ? (
                          <img 
                            src={category.imageUrl} 
                            alt={category.name}
                            style={{ maxWidth: '100%', maxHeight: '100%' }}
                          />
                        ) : (
                          <ImageIcon color="disabled" sx={{ fontSize: 40 }} />
                        )}
                      </Box>
                      <Typography>{category.name}</Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>

              {/* Add other preview sections similarly */}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setPreviewMode(false)}>Close Preview</Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
}