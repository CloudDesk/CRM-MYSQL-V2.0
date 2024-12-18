import React, { useState } from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    IconButton,
    Pagination,
    Grid,
    MenuItem,
    Menu,
    Typography,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Header from "../Header";
import ToastNotification from "../../scenes/toast/ToastNotification";
import DeleteConfirmDialog from "../../scenes/toast/DeleteConfirmDialog";

const MobileListView = ({
    title,
    subtitle,
    records,
    fields,
    onAdd,
    onEdit,
    onDelete,
    itemsPerPage = 3,
}) => {
    const [page, setPage] = useState(1);
    const [notify, setNotify] = useState({
        isOpen: false,
        message: "",
        type: "",
    });
    const [confirmDialog, setConfirmDialog] = useState({
        isOpen: false,
        title: "",
        subTitle: "",
    });
    const [menuAnchorEl, setMenuAnchorEl] = useState(null);
    const [selectedRecord, setSelectedRecord] = useState(null);

    const noOfPages = Math.ceil(records.length / itemsPerPage);

    // Menu handlers
    const handleMenuOpen = (event, record) => {
        setMenuAnchorEl(event.currentTarget);
        setSelectedRecord(record);
    };

    const handleMenuClose = () => {
        setMenuAnchorEl(null);
        setSelectedRecord(null);
    };

    // Delete handlers
    const handleDeleteClick = (e, record) => {
        e.stopPropagation();
        setConfirmDialog({
            isOpen: true,
            title: "Are you sure to delete this Record?",
            subTitle: "You can't undo this Operation",
            onConfirm: () => handleDeleteConfirm(record),
        });
    };

    const handleDeleteConfirm = async (record) => {
        try {
            const result = await onDelete(record._id);
            setNotify({
                isOpen: true,
                message: result.message,
                type: result.success ? "success" : "error",
            });
        } catch (error) {
            setNotify({
                isOpen: true,
                message: error.message || "Error deleting record",
                type: "error",
            });
        } finally {
            setConfirmDialog({ ...confirmDialog, isOpen: false });
            handleMenuClose();
        }
    };


    return (
        <>
            <ToastNotification notify={notify} setNotify={setNotify} />
            <DeleteConfirmDialog
                confirmDialog={confirmDialog}
                setConfirmDialog={setConfirmDialog}
                moreModalClose={handleMenuClose}
            />

            <Box m="20px">
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 3
                    }}
                >
                    <Header title={title} subtitle={subtitle} />
                    <Button
                        variant="contained"
                        color="info"
                        onClick={onAdd}
                        sx={{ height: 'fit-content' }}
                    >
                        New
                    </Button>
                </Box>

                <Card>
                    {records.length > 0 ? (
                        records
                            .slice((page - 1) * itemsPerPage, page * itemsPerPage)
                            .map((record) => (
                                <CardContent
                                    key={record._id}
                                    sx={{
                                        bgcolor: "aliceblue",
                                        m: 2,
                                        borderRadius: 1,
                                        "&:hover": {
                                            bgcolor: "action.hover",
                                            transition: "background-color 0.3s",
                                        },
                                    }}
                                >
                                    <Grid
                                        container
                                        spacing={2}
                                        alignItems="center"
                                    >
                                        <Grid item xs={10}>
                                            {fields.map((field) => (
                                                <Box
                                                    key={field.key}
                                                    sx={{
                                                        mb: 1,
                                                        display: 'flex',
                                                        gap: 1,
                                                        alignItems: 'baseline'
                                                    }}
                                                >
                                                    <Typography
                                                        component="span"
                                                        fontWeight="bold"
                                                        minWidth="120px"
                                                    >
                                                        {field.label}:
                                                    </Typography>
                                                    <Typography component="span">
                                                        {field.render
                                                            ? field.render(record[field.key], record)
                                                            : field.format
                                                                ? field.format(record[field.key])
                                                                : record[field.key] || "---"}
                                                    </Typography>
                                                </Box>
                                            ))}
                                        </Grid>
                                        <Grid
                                            item
                                            xs={2}
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                height: '100%'
                                            }}
                                        >
                                            <IconButton
                                                onClick={(e) => handleMenuOpen(e, record)}
                                                sx={{
                                                    '&:hover': {
                                                        backgroundColor: 'rgba(0, 0, 0, 0.04)'
                                                    }
                                                }}
                                            >
                                                <MoreVertIcon />
                                            </IconButton>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            ))
                    ) : (
                        <CardContent sx={{ bgcolor: "aliceblue", m: 2 }}>
                            <Typography>No Records Found</Typography>
                        </CardContent>
                    )}
                </Card>

                {records.length > 0 && (
                    <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
                        <Pagination
                            count={noOfPages}
                            page={page}
                            onChange={(_, value) => setPage(value)}
                            color="primary"
                            size="large"
                            showFirstButton
                            showLastButton
                        />
                    </Box>
                )}

                <Menu
                    anchorEl={menuAnchorEl}
                    open={Boolean(menuAnchorEl)}
                    onClose={handleMenuClose}
                    anchorOrigin={{
                        vertical: "top",
                        horizontal: "left",
                    }}
                    transformOrigin={{
                        vertical: "top",
                        horizontal: "left",
                    }}
                >
                    <MenuItem
                        onClick={() => {
                            onEdit(selectedRecord);
                            handleMenuClose();
                        }}
                    >
                        Edit
                    </MenuItem>
                    <MenuItem onClick={(e) => handleDeleteClick(e, selectedRecord)}>
                        Delete
                    </MenuItem>
                </Menu>
            </Box>
        </>
    );
};

export default MobileListView;
