import { Box, CardContent, Grid, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import { useState } from "react";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ContactsIcon from '@mui/icons-material/Contacts';
import EventIcon from '@mui/icons-material/Event';

// Icon mapping
const ICON_MAP = {
    'task': EventIcon,
    'contact': ContactsIcon,
    // Add more icon mappings as needed
};

// Common ItemCard component for rendering individual items
const ItemCard = ({ item, onEdit, onDelete, permissions, displayFields, sectionIcon }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
        setMenuOpen(true);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setMenuOpen(false);
    };
    console.log(sectionIcon, "sectionIcon")

    // Get the icon component
    const IconComponent = ICON_MAP[sectionIcon] || AssignmentIcon;

    console.log(IconComponent, sectionIcon, "IconComponent")
    return (
        <CardContent
            sx={{
                bgcolor: "#f8f9fa",
                m: 2,
                borderRadius: "10px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                position: "relative",
                '&:hover': {
                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                }
            }}>
            <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
                <Box
                    sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        bgcolor: "primary.light",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mr: 2
                    }}
                >
                    <IconComponent sx={{ color: 'white' }} />
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                    {displayFields.map((field, index) => (
                        <Typography
                            key={index}
                            sx={{
                                mb: 0.5,
                                color: index === 0 ? 'text.primary' : 'text.secondary',
                                fontWeight: index === 0 ? 500 : 400,
                                fontSize: index === 0 ? '1rem' : '0.875rem'
                            }}
                        >
                            {field.format ? field.format(item[field.key]) : item[field.key]}
                        </Typography>
                    ))}
                </Box>
                <Box
                    sx={{
                        position: "absolute",
                        right: 8,
                        bottom: 8,
                        display: "flex",
                        gap: 1
                    }}
                >
                    {permissions.read && (
                        <IconButton
                            size="small"
                            onClick={() => onEdit(item)}
                            sx={{
                                bgcolor: "background.paper",
                                '&:hover': { bgcolor: "action.hover" }
                            }}
                        >
                            <VisibilityOutlinedIcon fontSize="small" />
                        </IconButton>
                    )}
                    {permissions.delete && (
                        <IconButton
                            size="small"
                            onClick={(e) => onDelete(e, item)}
                            sx={{
                                bgcolor: "background.paper",
                                '&:hover': { bgcolor: "action.hover" }
                            }}
                        >
                            <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                    )}
                </Box>
            </Box>
        </CardContent>
    );
};

export default ItemCard;

/*
  <CardContent>
  <Grid container spacing={2}>
                <Grid item xs={10} md={10}>
                    {displayFields.map((field, index) => (
                        <div key={index}>
                            {field.label}: {field.format ? field.format(item[field.key]) : item[field.key]}
                        </div>
                    ))}
                </Grid>
                <Grid item xs={2} md={2}>
                    <IconButton>
                        <MoreVertIcon onClick={handleMenuClick} />
                        <Menu
                            anchorEl={anchorEl}
                            open={menuOpen}
                            onClose={handleMenuClose}
                            anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                        >
                            <MenuItem onClick={() => {
                                onEdit(item);
                                handleMenuClose();
                            }}>
                                {permissions.edit ? 'Edit' : 'View'}
                            </MenuItem>
                            {permissions.delete && (
                                <MenuItem onClick={(e) => {
                                    onDelete(e, item);
                                    handleMenuClose();
                                }}>
                                    Delete
                                </MenuItem>
                            )}
                        </Menu>
                    </IconButton>
                </Grid>
            </Grid>
          </CardContent>    
            */