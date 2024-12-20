import React, { useState } from 'react';
import {
    Box, Button, Card, CardContent,
    IconButton, Pagination, Grid, MenuItem, Menu, Typography,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Header from '../Header';
import ToastNotification from '../../scenes/toast/ToastNotification';
import DeleteConfirmDialog from '../../scenes/toast/DeleteConfirmDialog';



//constants

const CONSTANTS = {
    MESSAGES: {
        DELETE: {
            TITLE: "Are you sure to delete this Record?",
            SUBTITLE: "You can't undo this Operation",
            ERROR: "Error deleting record",
        },
        NO_RECORDS: "No Records Found",
    },
    MENU_OPTIONS: {
        EDIT: "Edit",
        VIEW: "View",
        DELETE: "Delete",
    },
    BUTTON_LABELS: {
        NEW: "New",
    },
    PAGINATION: {
        DEFAULT_PAGE: 1,
        DEFAULT_ITEMS: 5,
    },
}

const STYLES = {
    mainContainer: {
        m: "20px",
    },
    headerContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 3,
    },
    newButton: {
        height: 'fit-content',
    },
    recordCard: {
        bgcolor: "aliceblue",
        m: 2,
        borderRadius: 1,
        position: 'relative',
        "&:hover": {
            bgcolor: "action.hover",
            transition: "background-color 0.3s",
        },
    },
    fieldContainer: {
        mb: 1,
        display: 'flex',
        gap: 1,
        alignItems: 'baseline',
    },
    fieldLabel: {
        component: "span",
        fontWeight: "bold",
        minWidth: "120px",
    },
    actionContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
    },
    actionButton: {
        '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
        },
    },
    paginationContainer: {
        mt: 2,
        display: "flex",
        justifyContent: "center",
    },
    emptyStateCard: {
        bgcolor: "aliceblue",
        m: 2,
        textAlign: 'center',
    },
};

/**
 * MobileListView Component
 * A responsive list view component optimized for mobile devices
 */

const MobileListView = ({
    title,
    subtitle,
    records,
    columnConfig,
    onCreateRecord,
    onEditRecord,
    onDeleteRecord,
    permissions,
    itemsPerPage = CONSTANTS.PAGINATION.DEFAULT_ITEMS,
}) => {
    // State Management
    const [currentPage, setCurrentPage] = useState(CONSTANTS.PAGINATION.DEFAULT_PAGE);
    const [notification, setNotification] = useState({
        isOpen: false,
        message: "",
        type: "",
    });
    const [deleteConfirmation, setDeleteConfirmation] = useState({
        isOpen: false,
        title: "",
        subTitle: "",
    });
    const [menuState, setMenuState] = useState({
        anchorEl: null,
        selectedRecord: null,
    });

    // Computed Values
    const totalPages = Math.ceil(records.length / itemsPerPage);
    const currentPageRecords = records.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );


    // Menu handlers
    const handleMenuActions = {
        open: (event, record) => {
            setMenuState({
                anchorEl: event.currentTarget,
                selectedRecord: record,
            });
        },
        close: () => {
            setMenuState({
                anchorEl: null,
                selectedRecord: null,
            });
        },
    };

    // Delete Handlers
    const handleDeleteActions = {
        initiate: (e) => {
            e.stopPropagation();
            setDeleteConfirmation({
                isOpen: true,
                title: CONSTANTS.MESSAGES.DELETE.TITLE,
                subTitle: CONSTANTS.MESSAGES.DELETE.SUBTITLE,
                onConfirm: () => handleDeleteActions.confirm(e, menuState.selectedRecord),
            });
        },
        confirm: async (e, record) => {
            try {
                const result = await onDeleteRecord(e, record._id);
                showNotification(result.message, result.success ? "success" : "error");
            } catch (error) {
                showNotification(error.message || CONSTANTS.MESSAGES.DELETE.ERROR, "error");
            } finally {
                closeDeleteConfirmation();
                handleMenuActions.close();
            }
        },
    };
    // Utility Functions
    const showNotification = (message, type) => {
        setNotification({
            isOpen: true,
            message,
            type,
        });
    };

    const closeDeleteConfirmation = () => {
        setDeleteConfirmation(prev => ({
            ...prev,
            isOpen: false,
        }));
    };

    const handleEdit = () => {
        onEditRecord(menuState.selectedRecord);
        handleMenuActions.close();
    };

    // Render Methods
    const renderField = (field, record) => {
        const value = record[field.key];
        if (field.render) return field.render(value, record);
        if (field.format) return field.format(value);
        return value || "---";
    };

    const renderRecord = (record) => (
        <CardContent key={record._id} sx={STYLES.recordCard}>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={10}>
                    {columnConfig.map((field) => (
                        <Box key={field.key} sx={STYLES.fieldContainer}>
                            <Typography sx={STYLES.fieldLabel}>
                                {field.label}:
                            </Typography>
                            <Typography component="span">
                                {renderField(field, record)}
                            </Typography>
                        </Box>
                    ))}
                </Grid>
                <Grid item xs={2} sx={STYLES.actionContainer}>
                    <IconButton
                        onClick={(e) => handleMenuActions.open(e, record)}
                        sx={STYLES.actionButton}
                    >
                        <MoreVertIcon />
                    </IconButton>
                </Grid>
            </Grid>
        </CardContent>
    );


    const renderRecordsList = () => (
        <>
            <Card>
                {records.length > 0 ? (
                    currentPageRecords.map(renderRecord)
                ) : (
                    <CardContent sx={STYLES.emptyStateCard}>
                        <Typography>{CONSTANTS.MESSAGES.NO_RECORDS}</Typography>
                    </CardContent>
                )}
            </Card>

            {records.length > 0 && (
                <Box sx={STYLES.paginationContainer}>
                    <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={(_, value) => setCurrentPage(value)}
                        color="primary"
                        size="large"
                        showFirstButton
                        showLastButton
                    />
                </Box>
            )}
        </>
    );


    return (
        <>
            <ToastNotification
                notify={notification}
                setNotify={setNotification}
            />
            <DeleteConfirmDialog
                confirmDialog={deleteConfirmation}
                setConfirmDialog={setDeleteConfirmation}
                moreModalClose={handleMenuActions.close}
            />

            <Box sx={STYLES.mainContainer}>
                <Box sx={STYLES.headerContainer}>
                    <Header title={title} subtitle={subtitle} />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={onCreateRecord}
                        sx={STYLES.newButton}
                    >
                        {CONSTANTS.BUTTON_LABELS.NEW}
                    </Button>
                </Box>

                {renderRecordsList()}

                <Menu
                    anchorEl={menuState.anchorEl}
                    open={Boolean(menuState.anchorEl)}
                    onClose={handleMenuActions.close}
                    anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "right",
                    }}
                    transformOrigin={{
                        vertical: "top",
                        horizontal: "right",
                    }}
                >
                    <MenuItem onClick={handleEdit}>
                        {permissions.edit ? CONSTANTS.MENU_OPTIONS.EDIT : CONSTANTS.MENU_OPTIONS.VIEW}
                    </MenuItem>
                    {permissions.delete && (
                        <MenuItem onClick={handleDeleteActions.initiate}>
                            {CONSTANTS.MENU_OPTIONS.DELETE}
                        </MenuItem>
                    )}
                </Menu>
            </Box>
        </>
    );
};

export default MobileListView;