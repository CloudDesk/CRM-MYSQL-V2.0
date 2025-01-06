import React, { useState } from 'react';
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
    Divider,
    tooltipClasses,
    Zoom
} from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import BarChartIcon from '@mui/icons-material/BarChart';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import PieChartIcon from '@mui/icons-material/PieChart';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DataUsageIcon from '@mui/icons-material/DataUsage';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const DashboardList = ({
    dashboards,
    activeDashboardId,
    onDashboardClick,
    onEdit,
    onDelete,
    permissionValues
}) => {
    const theme = useTheme();
    const [searchTerm, setSearchTerm] = useState('');

    console.log(dashboards, "dashboards");

    const filteredDashboards = dashboards.filter(dashboard =>
        dashboard.dashboardname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dashboard.objectname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dashboard.charttype.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dashboard.fields.some(field => field.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const getChartIcon = (type) => {
        switch (type.toLowerCase()) {
            case 'pie':
                return <PieChartIcon sx={{ fontSize: 20, color: theme.palette.text.secondary }} />;
            case 'line':
                return <ShowChartIcon sx={{ fontSize: 20, color: theme.palette.text.secondary }} />;
            default:
                return <BarChartIcon sx={{ fontSize: 20, color: theme.palette.text.secondary }} />;
        }
    };

    const getTooltipContent = (dashboard) => (
        <Box sx={{ p: 1 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Dashboard Details
            </Typography>
            <Stack spacing={0.5}>
                <Typography variant="subtitle2">
                    <strong>Object:</strong> {dashboard.objectname}
                </Typography>
                <Typography variant="subtitle2">
                    <strong>Chart Type:</strong> {dashboard.charttype}
                </Typography>
                <Typography variant="subtitle2">
                    <strong>Fields:</strong> {Array.isArray(dashboard.fields)
                        ? dashboard.fields.join(', ')
                        : dashboard.fields}
                </Typography>
            </Stack>
        </Box>
    );

    const BootstrapTooltip = styled(({ className, ...props }) => (
        <Tooltip slots={{
            transition: Zoom,
        }} {...props} arrow classes={{ popper: className }} />
    ))(({ theme }) => ({
        [`& .${tooltipClasses.arrow}`]: {
            color: theme.palette.common.black,
        },
        [`& .${tooltipClasses.tooltip}`]: {
            backgroundColor: theme.palette.common.black,
        },
    }));



    return (
        <Paper
            elevation={2}
            sx={{
                height: '85vh',
                overflowY: 'auto',
                p: 3,
                backgroundColor: theme.palette.background.paper,
                borderRadius: 2,
                border: `1px solid ${theme.palette.divider}`,
                '&::-webkit-scrollbar': {
                    width: '4px'
                },
                '&::-webkit-scrollbar-track': {
                    backgroundColor: 'transparent'
                },
                '&::-webkit-scrollbar-thumb': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.2),
                    borderRadius: '2px'
                }
            }}
        >
            <Box sx={{ position: 'sticky', top: 0, backgroundColor: theme.palette.background.paper, pb: 2, zIndex: 1 }}>
                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: 700,
                        color: theme.palette.text.primary,
                        mb: 2
                    }}
                >
                    Dashboards
                </Typography>

                <TextField
                    fullWidth
                    size="small"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search dashboards..."
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon sx={{ color: theme.palette.text.secondary }} />
                            </InputAdornment>
                        ),
                        sx: {
                            backgroundColor: alpha(theme.palette.primary.main, 0.02),
                            '&:hover': {
                                backgroundColor: alpha(theme.palette.primary.main, 0.04),
                            },
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'transparent',
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: theme.palette.primary.main,
                            },
                            borderRadius: 1.5
                        }
                    }}
                    sx={{ mb: 2 }}
                />
            </Box>

            <Stack spacing={0.5}>
                {filteredDashboards.map((dashboard) => (
                    <Card
                        key={dashboard._id}
                        onClick={() => onDashboardClick(dashboard)}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            p: 1.5,
                            borderRadius: 1.5,
                            cursor: 'pointer',
                            transition: 'all 0.2s ease-in-out',
                            border: '1px solid',
                            borderColor: activeDashboardId === dashboard._id
                                ? theme.palette.primary.main
                                : 'transparent',
                            backgroundColor: activeDashboardId === dashboard._id
                                ? alpha(theme.palette.primary.main, 0.04)
                                : 'transparent',
                            '&:hover': {
                                backgroundColor: theme.palette.action.hover,
                                borderColor: theme.palette.primary.main,
                            }
                        }}
                    >
                        <Box sx={{
                            width: 32,
                            height: 32,
                            backgroundColor: activeDashboardId === dashboard._id
                                ? alpha(theme.palette.primary.main, 0.12)
                                : alpha(theme.palette.primary.main, 0.04),
                            borderRadius: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mr: 1.5
                        }}>
                            {getChartIcon(dashboard.charttype)}
                        </Box>

                        <Typography
                            sx={{
                                flex: 1,
                                fontWeight: 500,
                                color: theme.palette.text.primary
                            }}
                        >
                            {dashboard.dashboardname}
                        </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <BootstrapTooltip
                                title={getTooltipContent(dashboard)}
                                arrow
                                placement="left"
                            >
                                <IconButton
                                    size="small"
                                    onClick={(e) => e.stopPropagation()}
                                    sx={{
                                        color: theme.palette.text.secondary,
                                        '&:hover': {
                                            backgroundColor: alpha(theme.palette.primary.main, 0.08),
                                            color: theme.palette.primary.main
                                        }
                                    }}
                                >
                                    <InfoOutlinedIcon sx={{ fontSize: 18 }} />
                                </IconButton>
                            </BootstrapTooltip>

                            {permissionValues.edit && (
                                <Tooltip title="Edit Dashboard" arrow>
                                    <IconButton
                                        size="small"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onEdit(dashboard);
                                        }}
                                        sx={{
                                            color: theme.palette.primary.main,
                                            '&:hover': {
                                                backgroundColor: alpha(theme.palette.primary.main, 0.08)
                                            }
                                        }}
                                    >
                                        <EditIcon sx={{ fontSize: 18 }} />
                                    </IconButton>
                                </Tooltip>
                            )}
                            {permissionValues.delete && (
                                <Tooltip title="Delete Dashboard" arrow>
                                    <IconButton
                                        size="small"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDelete(dashboard);
                                        }}
                                        sx={{
                                            color: theme.palette.error.main,
                                            '&:hover': {
                                                backgroundColor: alpha(theme.palette.error.main, 0.08)
                                            }
                                        }}
                                    >
                                        <DeleteIcon sx={{ fontSize: 18 }} />
                                    </IconButton>
                                </Tooltip>
                            )}
                        </Box>
                    </Card>
                ))}

                {filteredDashboards.length === 0 && searchTerm && (
                    <Box
                        sx={{
                            textAlign: 'center',
                            py: 6,
                            color: theme.palette.text.secondary
                        }}
                    >
                        <SearchIcon
                            sx={{
                                fontSize: 40,
                                opacity: 0.3,
                                mb: 1,
                                color: theme.palette.primary.main
                            }}
                        />
                        <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                            No results found
                        </Typography>
                    </Box>
                )}
            </Stack>
        </Paper>
    );
};

export default DashboardList;