import { Box, CardContent, IconButton, Typography } from "@mui/material";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ContactsIcon from '@mui/icons-material/Contacts';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import EventIcon from '@mui/icons-material/Event';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { useState } from "react";

// Icon mapping
const ICON_MAP = {
    'event': EventIcon,
    'contact': ContactsIcon,
    'account': AccountBoxIcon,
    'deal': LocalOfferIcon,
};

// Common ItemCard component for rendering individual items
const ItemCard = ({ item, onEdit, onDelete, permissions, displayFields, sectionIcon }) => {
    const [isViewHovered, setIsViewHovered] = useState(false);
    const [isDeleteHovered, setIsDeleteHovered] = useState(false);

    // Get the icon component
    const IconComponent = ICON_MAP[sectionIcon] || AssignmentIcon;

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
                        bgcolor: "#f0f0f0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mr: 2
                    }}
                >
                    <IconComponent sx={{ color: '#666' }} />
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
                            onMouseEnter={() => setIsViewHovered(true)}
                            onMouseLeave={() => setIsViewHovered(false)}
                            sx={{
                                bgcolor: "background.paper",
                                border: 'none',
                                '&:hover': {
                                    bgcolor: "rgba(25, 118, 210, 0.04)",
                                }
                            }}
                        >
                            {isViewHovered ? (
                                <VisibilityIcon
                                    fontSize="small"
                                    sx={{ color: '#1976d2' }}
                                />
                            ) : (
                                <VisibilityOutlinedIcon
                                    fontSize="small"
                                    sx={{ color: '#1976d2' }}
                                />
                            )}
                        </IconButton>
                    )}
                    {permissions.delete && (
                        <IconButton
                            size="small"
                            onClick={(e) => onDelete(e, item)}
                            onMouseEnter={() => setIsDeleteHovered(true)}
                            onMouseLeave={() => setIsDeleteHovered(false)}
                            sx={{
                                bgcolor: "background.paper",
                                border: 'none',
                                '&:hover': {
                                    bgcolor: "rgba(211, 47, 47, 0.04)",
                                }
                            }}
                        >
                            {isDeleteHovered ? (
                                <DeleteIcon
                                    fontSize="small"
                                    sx={{ color: '#d32f2f' }}
                                />
                            ) : (
                                <DeleteOutlineIcon
                                    fontSize="small"
                                    sx={{ color: '#d32f2f' }}
                                />
                            )}
                        </IconButton>
                    )}
                </Box>
            </Box>
        </CardContent>
    );
};

export default ItemCard;

/*
 // const [anchorEl, setAnchorEl] = useState(null);
    // const [menuOpen, setMenuOpen] = useState(false);

    // const handleMenuClick = (event) => {
    //     setAnchorEl(event.currentTarget);
    //     setMenuOpen(true);
    // };

    // const handleMenuClose = () => {
    //     setAnchorEl(null);
    //     setMenuOpen(false);
    // };
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