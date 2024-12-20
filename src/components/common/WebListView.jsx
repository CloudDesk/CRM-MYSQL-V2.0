import { Box, Typography, Button, IconButton, Tooltip, Modal } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import CustomPagination from './CustomPagination';
import ToastNotification from '../../scenes/toast/ToastNotification';
import DeleteConfirmDialog from '../../scenes/toast/DeleteConfirmDialog';
import ModalFileUpload from '../../scenes/dataLoader/ModalFileUpload';
import { useState } from 'react';


// Constants
const STYLE_CONSTANTS = {
    COLORS: {
        PRIMARY: '#4A90E2',
        PRIMARY_HOVER: '#357ABD',
        DELETE: '#FF3333',
        BACKGROUND: '#f5f5f5',
        WHITE: '#fff',
        DELETE_HOVER: '#ffebee',
        HEADER_BG: '#f8f9fa',
        BORDER: '#e9ecef',
        ROW_HOVER: '#f5f5f5',
        SELECTED: '#e3f2fd',
    },
    SPACING: {
        BUTTON_PADDING: '8px 16px',
        ICON_PADDING: '20px',
    },
    DIMENSIONS: {
        GRID_HEIGHT: 'calc(100vh - 170px)',
    },
};

const UI_MESSAGES = {
    DELETE: {
        MULTIPLE: (count) => `Are you sure to delete ${count} records?`,
        SINGLE: 'Are you sure to delete this record?',
        SUBTITLE: "You can't undo this Operation",
        SUCCESS: 'Record(s) deleted successfully',
        ERROR: 'Error deleting record(s)',
    },
};

// Styles
const styles = {
    container: {
        p: { xs: 1, sm: 2, md: 3 },
        height: '100%',
        backgroundColor: STYLE_CONSTANTS.COLORS.BACKGROUND,
    },
    headerContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 3,
    },
    title: {
        fontSize: '24px',
        fontWeight: 'bold',
        color: 'primary.main',
        mb: 1,
    },
    subtitle: {
        color: 'text.secondary',
        fontSize: '14px',
    },
    actionsContainer: {
        display: 'flex',
        gap: 1,
    },
    deleteButton: {
        backgroundColor: STYLE_CONSTANTS.COLORS.WHITE,
        '&:hover': { backgroundColor: STYLE_CONSTANTS.COLORS.DELETE_HOVER },
    },
    importButton: {
        backgroundColor: STYLE_CONSTANTS.COLORS.PRIMARY,
        color: STYLE_CONSTANTS.COLORS.WHITE,
        '&:hover': {
            backgroundColor: STYLE_CONSTANTS.COLORS.PRIMARY_HOVER,
        },
        padding: STYLE_CONSTANTS.SPACING.BUTTON_PADDING,
        fontWeight: 'bold',
        textTransform: 'none',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
    newButton: {
        backgroundColor: '#000000',
        color: STYLE_CONSTANTS.COLORS.WHITE,
        '&:hover': {
            backgroundColor: STYLE_CONSTANTS.COLORS.PRIMARY_HOVER,
        },
        fontWeight: 'bold',
        textTransform: 'none',
        boxShadow: '0 6px 10px rgba(0, 0, 0, 0.15)',
        transition: 'all 0.3s ease',
    },
    gridContainer: {
        height: STYLE_CONSTANTS.DIMENSIONS.GRID_HEIGHT,
        width: '100%',
        backgroundColor: STYLE_CONSTANTS.COLORS.WHITE,
        borderRadius: '12px',
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        overflow: 'hidden',
    },
    dataGrid: {
        height: '100%',
        '& .MuiDataGrid-root': {
            border: 'none',
        },
        '& .MuiDataGrid-cell': {
            borderBottom: '1px solid #f0f0f0',
            '&:focus': {
                outline: 'none',
            },
        },
        '& .MuiDataGrid-columnHeaders': {
            backgroundColor: STYLE_CONSTANTS.COLORS.HEADER_BG,
            borderBottom: `2px solid ${STYLE_CONSTANTS.COLORS.BORDER}`,
            '& .MuiDataGrid-columnHeader': {
                '&:focus': {
                    outline: 'none',
                },
            },
        },
        '& .MuiDataGrid-virtualScroller': {
            backgroundColor: STYLE_CONSTANTS.COLORS.WHITE,
        },
        '& .MuiDataGrid-footerContainer': {
            borderTop: `2px solid ${STYLE_CONSTANTS.COLORS.BORDER}`,
            backgroundColor: STYLE_CONSTANTS.COLORS.HEADER_BG,
        },
        '& .MuiDataGrid-row': {
            '&:hover': {
                backgroundColor: STYLE_CONSTANTS.COLORS.ROW_HOVER,
            },
            '&.Mui-selected': {
                backgroundColor: STYLE_CONSTANTS.COLORS.SELECTED,
                '&:hover': {
                    backgroundColor: STYLE_CONSTANTS.COLORS.SELECTED,
                },
            },
        },
    },
    modal: {
        backdropFilter: "blur(1px)",
        "& .modal": {
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: 24,
            p: 4,
        },
    },
};


/**
 * WebListView Component
 * A reusable component for displaying data in a grid format with various controls
 */

const WebListView = ({
    title,
    subtitle,
    records,
    columnConfig,
    isLoading,
    isDeleteMode,
    permissions,
    selectedRecordIds,
    onCreateRecord,
    onDeleteRecord,
    onToggleDeleteMode,
    onSelectRecords,
    onEditRecord,
    ExcelDownload,
    additionalToolbarActions,
    importConfig
}) => {
    console.log(records, "records **")
    // state Mnagement
    const [notificationState, setNotificationState] = useState({
        isOpen: false,
        message: '',
        type: '',
    });

    const [deleteConfirmState, setDeleteConfirmState] = useState({
        isOpen: false,
        title: '',
        subTitle: '',
    });

    const [isImportModalOpen, setIsImportModalOpen] = useState(false);

    // Modal Handlers
    const handleImportModalToggle = (shouldOpen = false) => {
        setIsImportModalOpen(shouldOpen);
    };

    // Delete Handlers
    const handleDeleteRequest = (event, selectedIds) => {
        event.stopPropagation();

        setDeleteConfirmState({
            isOpen: true,
            title: Array.isArray(selectedIds)
                ? UI_MESSAGES.DELETE.MULTIPLE(selectedIds.length)
                : UI_MESSAGES.DELETE.SINGLE,
            subTitle: UI_MESSAGES.DELETE.SUBTITLE,
            onConfirm: () => executeDelete(event, selectedIds),
        });
    };

    const executeDelete = async (event, ids) => {
        try {
            const result = Array.isArray(ids)
                ? await onDeleteRecord(event, ids)
                : await onDeleteRecord(event, ids._id);

            handleDeleteResult(result);
        } catch (error) {
            showNotification(error.message || UI_MESSAGES.DELETE.ERROR, 'error');
        } finally {
            closeDeleteConfirmDialog();
        }
    };

    const handleDeleteResult = (result) => {
        if (result?.success) {
            showNotification(result.message || UI_MESSAGES.DELETE.SUCCESS, 'success');
            resetSelection();
        } else {
            showNotification(result?.message || UI_MESSAGES.DELETE.ERROR, 'error');
        }
    };

    // Utility Functions
    const showNotification = (message, type) => {
        setNotificationState({
            isOpen: true,
            message,
            type,
        });
    };

    const closeDeleteConfirmDialog = () => {
        setDeleteConfirmState(prev => ({
            ...prev,
            isOpen: false,
        }));
    };

    const resetSelection = () => {
        onToggleDeleteMode(false);
        onSelectRecords([]);
    };

    // Column Configuration
    const enhanceColumnsWithDelete = (originalColumns) => {
        return originalColumns.map(column => {
            if (column.field !== 'actions') return column;

            return {
                ...column,
                renderCell: (params) => (
                    !isDeleteMode && (
                        <IconButton
                            onClick={(e) => handleDeleteRequest(e, params.row)}
                            sx={{
                                padding: STYLE_CONSTANTS.SPACING.ICON_PADDING,
                                color: STYLE_CONSTANTS.COLORS.DELETE,
                            }}
                        >
                            <DeleteIcon />
                        </IconButton>
                    )
                ),
            };
        });
    };

    // Render Methods
    const renderHeader = () => (
        <Box sx={styles.headerContainer}>
            <Box>
                <Typography variant="h2" sx={styles.title}>
                    {title}
                </Typography>
                <Typography variant="subtitle1" sx={styles.subtitle}>
                    {subtitle}
                </Typography>
            </Box>
            {renderHeaderActions()}
        </Box>
    );

    const renderHeaderActions = () => (
        <Box sx={styles.actionsContainer}>
            {isDeleteMode ? renderDeleteActions() : renderDefaultActions()}
        </Box>
    );

    const renderDeleteActions = () => (
        <>
            {permissions.delete && (
                <Tooltip title="Delete Selected">
                    <IconButton
                        onClick={(e) => handleDeleteRequest(e, selectedRecordIds)}
                        sx={styles.deleteButton}
                    >
                        <DeleteIcon sx={{ color: STYLE_CONSTANTS.COLORS.DELETE }} />
                    </IconButton>
                </Tooltip>
            )}
            {additionalToolbarActions}
        </>
    );

    const renderDefaultActions = () => (
        permissions.create && (
            <>
                {importConfig.isImport && (
                    <Button
                        variant="contained"
                        onClick={() => handleImportModalToggle(true)}
                        sx={styles.importButton}
                    >
                        Import
                    </Button>
                )}
                <Button
                    variant="contained"
                    onClick={onCreateRecord}
                    sx={styles.newButton}
                >
                    New
                </Button>
                <ExcelDownload
                    data={records}
                    filename={`${title}Records`}
                />
            </>
        )
    );

    return (
        <>
            <ToastNotification
                notify={notificationState}
                setNotify={setNotificationState}
            />
            <DeleteConfirmDialog
                confirmDialog={deleteConfirmState}
                setConfirmDialog={setDeleteConfirmState}
            />

            <Box sx={styles.container}>
                {renderHeader()}
                <Box sx={styles.gridContainer}>
                    <DataGrid
                        rows={records}
                        columns={enhanceColumnsWithDelete(columnConfig)}
                        getRowId={(row) => row._id}
                        pageSize={10}
                        rowsPerPageOptions={[10, 25, 50]}
                        components={{
                            Pagination: CustomPagination,
                        }}
                        loading={isLoading}
                        checkboxSelection
                        disableSelectionOnClick
                        getRowClassName={(params) =>
                            params.indexRelativeToCurrentPage % 2 === 0
                                ? 'even-row'
                                : 'odd-row'
                        }
                        onSelectionModelChange={(ids) => {
                            onToggleDeleteMode(ids.length > 0);
                            onSelectRecords(ids);
                        }}
                        onRowClick={onEditRecord}
                        sx={styles.dataGrid}
                    />
                </Box>
            </Box>

            <Modal
                open={isImportModalOpen}
                onClose={() => handleImportModalToggle(false)}
                sx={styles.modal}
            >
                <div className="modal">
                    <ModalFileUpload
                        object={importConfig.objectName}
                        handleModal={() => handleImportModalToggle(false)}
                        callBack={importConfig.callBack}
                    />
                </div>
            </Modal>
        </>
    );
};



export default WebListView;