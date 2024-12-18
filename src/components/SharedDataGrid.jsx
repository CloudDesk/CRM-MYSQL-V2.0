import { Box, Typography, Button, IconButton, Tooltip } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';

const SharedDataGrid = ({
    title,
    subtitle,
    records,
    columns,
    loading,
    showDelete,
    permissionValues,
    selectedRecordIds,
    handleImportModalOpen,
    handleAddRecord,
    handleDelete,
    setShowDelete,
    setSelectedRecordIds,
    setSelectedRecordDatas,
    handleOnCellClick,
    CustomPagination,
    ExcelDownload,
    additionalToolbarActions,
}) => {
    return (
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
                                        onClick={(e) => handleDelete(e, selectedRecordIds)}
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
                                {handleImportModalOpen !== null ?

                                    <Button
                                        variant="contained"
                                        onClick={handleImportModalOpen}
                                        sx={{
                                            backgroundColor: '#4A90E2', // Aesthetic blue
                                            color: 'white',
                                            '&:hover': {
                                                backgroundColor: '#357ABD', // Slightly darker blue
                                            },
                                            // borderRadius: '8px',
                                            padding: '8px 16px',
                                            fontWeight: 'bold',
                                            textTransform: 'none',
                                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Subtle shadow
                                        }}
                                    >
                                        Import
                                    </Button>



                                    : null}
                                <Button
                                    variant="contained"
                                    onClick={handleAddRecord}
                                    sx={{
                                        backgroundColor: '#000000', // Aesthetic blue
                                        color: 'white',
                                        '&:hover': {
                                            backgroundColor: '#357ABD', // Slightly darker blue on hover
                                        },
                                        // borderRadius: '12px',
                                        // padding: '10px 20px',
                                        fontWeight: 'bold',
                                        textTransform: 'none',
                                        // fontSize: '16px',
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

            <Box
                sx={{
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
                }}
            >
                <DataGrid
                    rows={records}
                    columns={columns}
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
                        const selectedIDs = new Set(ids);
                        const selectedRowRecords = records.filter((row) =>
                            selectedIDs.has(row._id.toString())
                        );
                        setSelectedRecordDatas(selectedRowRecords);
                    }}
                    onRowClick={handleOnCellClick}
                    sx={{ height: '100%' }}
                />
            </Box>
        </Box >
    );
};

export default SharedDataGrid; 