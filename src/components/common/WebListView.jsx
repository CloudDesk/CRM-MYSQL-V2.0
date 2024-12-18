import { Box, Typography, Button, IconButton, Tooltip, Modal } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import CustomPagination from './CustomPagination';
import ToastNotification from '../../scenes/toast/ToastNotification';
import DeleteConfirmDialog from '../../scenes/toast/DeleteConfirmDialog';
import ModalFileUpload from '../../scenes/dataLoader/ModalFileUpload';
import { useState } from 'react';

const WebListView = ({
    title,
    subtitle,
    records,
    columns,
    loading,
    showDelete,
    permissionValues,
    selectedRecordIds,
    handleAddRecord,
    handleDelete,
    setShowDelete,
    setSelectedRecordIds,
    handleOnCellClick,
    ExcelDownload,
    additionalToolbarActions,
    importConfig
}) => {
    // Add state for toast and confirm dialog
    const [notify, setNotify] = useState({
        isOpen: false,
        message: '',
        type: '',
    });

    const [confirmDialog, setConfirmDialog] = useState({
        isOpen: false,
        title: '',
        subTitle: '',
    });

    // Add import modal state
    const [importModalOpen, setImportModalOpen] = useState(false);

    // Handle import modal
    const handleImportModalOpen = () => {
        setImportModalOpen(true);
    };

    const handleImportModalClose = () => {
        setImportModalOpen(false);
    };

    // Handle multiple delete with confirmation
    const onHandleDelete = (e, selectedIds) => {
        e.stopPropagation();
        setConfirmDialog({
            isOpen: true,
            title: Array.isArray(selectedIds)
                ? `Are you sure to delete ${selectedIds.length} records?`
                : 'Are you sure to delete this record?',
            subTitle: "You can't undo this Operation",
            onConfirm: () => confirmDeleteRecord(e, selectedIds),
        });
    };

    // Modified delete confirmation to handle both single and multiple deletes
    const confirmDeleteRecord = async (e, ids) => {
        try {
            // Handle both single record and multiple records
            const result = Array.isArray(ids)
                ? await handleDelete(e, ids)
                : await handleDelete(e, ids._id);
            console.log(result, "result confirmDeleteRecord")
            if (result && result.success) {
                setNotify({
                    isOpen: true,
                    message: result.message || 'Record(s) deleted successfully',
                    type: 'success',
                });
                // Reset selection after successful delete
                setShowDelete(false);
                setSelectedRecordIds([]);
            } else {
                setNotify({
                    isOpen: true,
                    message: result?.message || 'Error deleting record(s)',
                    type: 'error',
                });
            }
        } catch (error) {
            setNotify({
                isOpen: true,
                message: error.message || 'Error deleting record(s)',
                type: 'error',
            });
        } finally {
            setConfirmDialog({
                ...confirmDialog,
                isOpen: false,
            });
        }
    };

    // Update columns to use local delete handler
    const updatedColumns = columns.map(column => {
        if (column.field === 'actions') {
            return {
                ...column,
                renderCell: (params) => (
                    <>
                        {!showDelete && (
                            <IconButton
                                onClick={(e) => onHandleDelete(e, params.row)}
                                style={{ padding: '20px', color: '#FF3333' }}
                            >
                                <DeleteIcon />
                            </IconButton>
                        )}
                    </>
                ),
            };
        }
        return column;
    });

    return (
        <>
            <ToastNotification notify={notify} setNotify={setNotify} />
            <DeleteConfirmDialog
                confirmDialog={confirmDialog}
                setConfirmDialog={setConfirmDialog}
            />

            <Box sx={{
                p: { xs: 1, sm: 2, md: 3 },
                height: '100%',
                backgroundColor: '#f5f5f5',
            }}>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 3,
                    }}
                >
                    <Box>
                        <Typography
                            variant="h2"
                            sx={{
                                fontSize: '24px',
                                fontWeight: 'bold',
                                color: 'primary.main',
                                mb: 1,
                            }}
                        >
                            {title}
                        </Typography>
                        <Typography
                            variant="subtitle1"
                            sx={{
                                color: 'text.secondary',
                                fontSize: '14px',
                            }}
                        >
                            {subtitle}
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1 }}>
                        {showDelete ? (
                            <>
                                {permissionValues.delete && (
                                    <Tooltip title="Delete Selected">
                                        <IconButton
                                            onClick={(e) => onHandleDelete(e, selectedRecordIds)}
                                            sx={{
                                                backgroundColor: '#fff',
                                                '&:hover': { backgroundColor: '#ffebee' },
                                            }}
                                        >
                                            <DeleteIcon sx={{ color: "#FF3333" }} />
                                        </IconButton>
                                    </Tooltip>
                                )}
                                {additionalToolbarActions}
                            </>
                        ) : (
                            permissionValues.create && (
                                <>
                                    {
                                        importConfig.isImport &&
                                        <Button
                                            variant="contained"
                                            onClick={handleImportModalOpen}
                                            sx={{
                                                backgroundColor: '#4A90E2',
                                                color: 'white',
                                                '&:hover': {
                                                    backgroundColor: '#357ABD',
                                                },
                                                padding: '8px 16px',
                                                fontWeight: 'bold',
                                                textTransform: 'none',
                                                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                            }}
                                        >
                                            Import
                                        </Button>
                                    }
                                    <Button
                                        variant="contained"
                                        onClick={handleAddRecord}
                                        sx={{
                                            backgroundColor: '#000000',
                                            color: 'white',
                                            '&:hover': {
                                                backgroundColor: '#357ABD',
                                            },
                                            fontWeight: 'bold',
                                            textTransform: 'none',
                                            boxShadow: '0 6px 10px rgba(0, 0, 0, 0.15)',
                                            transition: 'all 0.3s ease',
                                        }}
                                    >
                                        New
                                    </Button>

                                    <ExcelDownload
                                        data={records}
                                        filename={`${title}Records`}
                                    />
                                </>
                            )
                        )}
                    </Box>
                </Box>

                <Box sx={{
                    height: 'calc(100vh - 170px)',
                    width: '100%',
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    overflow: 'hidden',
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
                        backgroundColor: '#f8f9fa',
                        borderBottom: '2px solid #e9ecef',
                        '& .MuiDataGrid-columnHeader': {
                            '&:focus': {
                                outline: 'none',
                            },
                        },
                    },
                    '& .MuiDataGrid-virtualScroller': {
                        backgroundColor: 'white',
                    },
                    '& .MuiDataGrid-footerContainer': {
                        borderTop: '2px solid #e9ecef',
                        backgroundColor: '#f8f9fa',
                    },
                    '& .MuiDataGrid-row': {
                        '&:hover': {
                            backgroundColor: '#f5f5f5',
                        },
                        '&.Mui-selected': {
                            backgroundColor: '#e3f2fd',
                            '&:hover': {
                                backgroundColor: '#e3f2fd',
                            },
                        },
                    },
                    '& .odd-row': {
                        backgroundColor: '#f8f9fa',
                    },
                    '& .even-row': {
                        backgroundColor: '#ffffff',
                    },
                }}>
                    <DataGrid
                        rows={records}
                        columns={updatedColumns}
                        getRowId={(row) => row._id}
                        pageSize={10}
                        rowsPerPageOptions={[10, 25, 50]}
                        components={{
                            Pagination: CustomPagination,
                        }}
                        loading={loading}
                        checkboxSelection
                        disableSelectionOnClick
                        getRowClassName={(params) =>
                            params.indexRelativeToCurrentPage % 2 === 0
                                ? 'even-row'
                                : 'odd-row'
                        }
                        onSelectionModelChange={(ids) => {
                            setShowDelete(Object.keys(ids).length > 0);
                            setSelectedRecordIds(ids);

                        }}
                        onRowClick={handleOnCellClick}
                        sx={{ height: '100%' }}
                    />
                </Box>
            </Box>

            {/* Import Modal */}
            <Modal
                open={importModalOpen}
                onClose={handleImportModalClose}
                sx={{
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
                }}
            >
                <div className="modal">
                    <ModalFileUpload
                        object={importConfig.objectName}
                        handleModal={handleImportModalClose}
                        callBack={importConfig.callBack}
                    />
                </div>
            </Modal>
        </>
    );
};

export default WebListView; 