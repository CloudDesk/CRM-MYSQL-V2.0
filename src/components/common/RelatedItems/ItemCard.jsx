import { CardContent, Grid, IconButton, Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import MoreVertIcon from '@mui/icons-material/MoreVert';

// Common ItemCard component for rendering individual items
const ItemCard = ({ item, onEdit, onDelete, permissions, displayFields }) => {
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

    return (
        <CardContent className="bg-blue-50 m-4">
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
    );
};

export default ItemCard;