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
import { CancelOutlined } from '@mui/icons-material';

const StyledTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        maxWidth: 300,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: theme.shape.borderRadius,
        boxShadow: theme.shadows[3],
        padding: theme.spacing(2),
    },
    [`& .${tooltipClasses.arrow}`]: {
        color: theme.palette.background.paper,
        '&:before': {
            border: `1px solid ${theme.palette.divider}`,
        }
    },
}));

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
        <Box>
            <Typography
                variant="subtitle1"
                sx={{
                    mb: 2,
                    fontWeight: 600,
                    borderBottom: 1,
                    borderColor: 'divider',
                    pb: 1
                }}
            >
                Dashboard Details
            </Typography>
            <Stack spacing={1.5}>
                <Box>
                    <Typography variant="caption" color="text.secondary">
                        Object
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                        {dashboard.objectname}
                    </Typography>
                </Box>
                <Box>
                    <Typography variant="caption" color="text.secondary">
                        Chart Type
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getChartIcon(dashboard.charttype)}
                        <Typography variant="body2" fontWeight={500}>
                            {dashboard.charttype}
                        </Typography>
                    </Box>
                </Box>
                <Box>
                    <Typography variant="caption" color="text.secondary">
                        Fields
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                        {Array.isArray(dashboard.fields) && dashboard.fields.map((field, index) => (
                            <Chip
                                key={index}
                                label={field}
                                size="small"
                                variant="outlined"
                                sx={{
                                    backgroundColor: alpha(theme.palette.primary.main, 0.04),
                                    borderColor: alpha(theme.palette.primary.main, 0.2),
                                }}
                            />
                        ))}
                    </Box>
                </Box>
            </Stack>
        </Box>
    );

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
                        endAdornment: searchTerm.length > 0 ? (
                            <InputAdornment position='end'>
                                <CancelOutlined onClick={() => setSearchTerm("")} sx={{
                                    cursor: "pointer",
                                }} />
                            </InputAdornment>
                        ) : null,
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
                            <StyledTooltip
                                title={getTooltipContent(dashboard)}
                                arrow
                                placement="left"
                                TransitionComponent={Zoom}
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
                            </StyledTooltip>

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