import React from 'react';
import {
    Box,
    Card,
    Typography,
    IconButton,
    Chip,
    Paper,
    Tooltip,
    useTheme,
    Stack,
    Divider
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import BarChartIcon from '@mui/icons-material/BarChart';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import PieChartIcon from '@mui/icons-material/PieChart';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DataUsageIcon from '@mui/icons-material/DataUsage';

const DashboardList = ({
    dashboards,
    activeDashboardId,
    onDashboardClick,
    onEdit,
    onDelete,
    permissionValues
}) => {
    const theme = useTheme();

    const getChartIcon = (type) => {
        switch (type.toLowerCase()) {
            case 'pie':
                return <PieChartIcon sx={{ fontSize: 24, color: '#637381' }} />;
            case 'line':
                return <ShowChartIcon sx={{ fontSize: 24, color: '#637381' }} />;
            default:
                return <BarChartIcon sx={{ fontSize: 24, color: '#637381' }} />;
        }
    };

    return (
        <Paper
            elevation={0}
            sx={{
                height: '100%',
                overflowY: 'auto',
                p: { xs: 2, sm: 3 },
                backgroundColor: '#fff',
                borderRadius: 2,
                '&::-webkit-scrollbar': {
                    width: '6px'
                },
                '&::-webkit-scrollbar-track': {
                    backgroundColor: 'transparent'
                },
                '&::-webkit-scrollbar-thumb': {
                    backgroundColor: '#DFE3E8',
                    borderRadius: '3px',
                    '&:hover': {
                        backgroundColor: '#C4CDD5'
                    }
                }
            }}
        >
            <Box sx={{ mb: 3 }}>
                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: 600,
                        mb: 0.5,
                        color: '#212B36'
                    }}
                >
                    Dashboards
                </Typography>
                <Typography
                    variant="body2"
                    sx={{ color: '#637381' }}
                >
                    {dashboards.length} dashboards available
                </Typography>
            </Box>

            <Stack spacing={2}>
                {dashboards.map((dashboard) => (
                    <Card
                        key={dashboard._id}
                        onClick={() => onDashboardClick(dashboard)}
                        sx={{
                            p: 2,
                            borderRadius: 2,
                            cursor: 'pointer',
                            border: '1px solid',
                            borderColor: activeDashboardId === dashboard._id
                                ? theme.palette.primary.main
                                : '#F4F6F8',
                            backgroundColor: activeDashboardId === dashboard._id
                                ? alpha(theme.palette.primary.main, 0.04)
                                : '#fff',
                            '&:hover': {
                                borderColor: theme.palette.primary.main,
                                backgroundColor: '#F4F6F8'
                            }
                        }}
                    >
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Box sx={{
                                width: 48,
                                height: 48,
                                backgroundColor: '#F4F6F8',
                                borderRadius: 1.5,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                {getChartIcon(dashboard.charttype)}
                            </Box>

                            <Box sx={{ flex: 1 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <Typography
                                        variant="subtitle1"
                                        sx={{
                                            fontWeight: 600,
                                            color: '#212B36',
                                            mb: 1
                                        }}
                                    >
                                        {dashboard.dashboardname}
                                    </Typography>

                                    {(permissionValues.edit || permissionValues.delete) && (
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            {permissionValues.edit && (
                                                <Tooltip title="Edit Dashboard">
                                                    <IconButton
                                                        size="small"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onEdit(dashboard);
                                                        }}
                                                        sx={{
                                                            p: 0.5,
                                                            color: '#637381',
                                                            '&:hover': {
                                                                backgroundColor: '#F4F6F8'
                                                            }
                                                        }}
                                                    >
                                                        <EditIcon sx={{ fontSize: 18 }} />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                            {permissionValues.delete && (
                                                <Tooltip title="Delete Dashboard">
                                                    <IconButton
                                                        size="small"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onDelete(dashboard);
                                                        }}
                                                        sx={{
                                                            p: 0.5,
                                                            color: '#FF4842',
                                                            '&:hover': {
                                                                backgroundColor: alpha('#FF4842', 0.08)
                                                            }
                                                        }}
                                                    >
                                                        <DeleteIcon sx={{ fontSize: 18 }} />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                        </Box>
                                    )}
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                                    <Chip
                                        label={dashboard.objectname}
                                        size="small"
                                        sx={{
                                            height: 24,
                                            fontSize: '0.75rem',
                                            fontWeight: 600,
                                            backgroundColor: '#F4F6F8',
                                            color: '#637381',
                                            borderRadius: 0.75,
                                            '& .MuiChip-label': {
                                                px: 1
                                            }
                                        }}
                                    />
                                    <Box sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 0.5,
                                        color: '#637381',
                                        fontSize: '0.75rem'
                                    }}>
                                        <DataUsageIcon sx={{ fontSize: 14 }} />
                                        <Typography variant="caption">
                                            {Array.isArray(dashboard.fields)
                                                ? dashboard.fields.join(', ')
                                                : dashboard.fields}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    </Card>
                ))}
            </Stack>
        </Paper>
    );
};

export default DashboardList;