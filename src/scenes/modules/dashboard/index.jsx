import React, { useEffect, useState } from "react";
import {
    Button,
    Box,
    Typography,
    Grid,
    Paper,
    CircularProgress,
    useTheme,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import BarChartIcon from "@mui/icons-material/BarChart";
import DynamicChart from "./DynamicChart";
import { DashboardDetailPage } from "../dashboard/form/DashboardDetailPage";
import { RequestServer } from "../../api/HttpReq";
import { getLoginUserRoleDept } from "../../shared/Auth/userRoleDept";
import { apiCheckPermission } from '../../../scenes/shared/Auth/apiCheckPermission';
import DashboardList from "./DashboardList";
import { appConfig } from "../../../config/appConfig";

const OBJECT_API = appConfig.objects.dashboard.apiName;
const getDashboardURL = appConfig.objects.dashboard.base;
const upsertDashboardURL = appConfig.objects.dashboard.upsert;
const dashboardGroupURL = appConfig.objects.dashboard.dashboardGroup;
const deleteDashboard = appConfig.objects.dashboard.delete;

export const DashboardIndex = () => {
    const theme = useTheme();
    const [open, setOpen] = useState(false);
    const [dashboards, setDashboards] = useState([]);
    const [editingDashboard, setEditingDashboard] = useState(null);
    const [chartData, setChartData] = useState(null);
    const [selectedDashboard, setSelectedDashboard] = useState(null);
    const [activeDashboardId, setActiveDashboardId] = useState(null);
    const [permissionValues, setPermissionValues] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const getUserRoleDept = getLoginUserRoleDept(OBJECT_API);
    console.log(getUserRoleDept, "getUserRoleDept");

    useEffect(() => {
        fetchPermissions();
    }, []);

    const fetchPermissions = () => {
        if (getUserRoleDept) {
            apiCheckPermission(getUserRoleDept)
                .then((res) => {
                    console.log(res, "res from fetchPermissions");
                    setPermissionValues(res);
                })
                .catch((error) => {
                    setPermissionValues({});
                });
        }
    };

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setEditingDashboard(null);
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setIsLoading(true);
        try {
            const response = await RequestServer("get", getDashboardURL);
            setDashboards(response.data);
            if (response.data.length > 0) {
                handleDashboardClick(response.data[0]);
            }
            if (response.success) {
                setIsLoading(false);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleSubmit = async (values, { resetForm }) => {
        console.log(values, "values from dashboard index handlesubmit");

        values.fields = values.selectedFields;
        delete values.selectedFields;
        delete values.selectedFieldsOptions;
        try {
            await RequestServer("post", upsertDashboardURL, values);
            handleClose();
            resetForm();
            fetchDashboardData();
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const handleEdit = (dashboard) => {
        console.log(dashboard);
        setEditingDashboard(dashboard);
        setOpen(true);
    };

    const handleDashboardClick = async (item) => {
        console.log(item, "item from handleDashboardClick");
        setActiveDashboardId(item._id);
        try {
            const response = await RequestServer(
                "get",
                `${dashboardGroupURL}?object=${item.objectname.toLowerCase()}&field=${item.fields
                }`
            );
            setSelectedDashboard({
                ...item,
                fields: Array.isArray(item.fields)
                    ? item.fields
                    : typeof item.fields === "string"
                        ? item.fields.split(",")
                        : [],
            });

            // Handle fields being an array or a string
            const fields = Array.isArray(item.fields)
                ? item.fields
                : typeof item.fields === "string"
                    ? item.fields.split(",")
                    : [];
            const [groupByField1, groupByField2] = fields;

            const uniqueValues1 = [
                ...new Set(
                    response.data.map((item) => item[groupByField1] || "Unknown")
                ),
            ];
            const uniqueValues2 = [
                ...new Set(
                    response.data.map((item) => item[groupByField2] || "Unknown")
                ),
            ];

            const series = uniqueValues1.map((val1) => ({
                name: val1,
                data: uniqueValues2.map((val2) => {
                    const match = response.data.find(
                        (item) =>
                            (item[groupByField1] || "Unknown") === val1 &&
                            (item[groupByField2] || "Unknown") === val2
                    );
                    return match ? parseInt(match.count) : 0;
                }),
            }));

            const chartOptions = {
                xaxis: {
                    categories: uniqueValues2,
                    title: {
                        text:
                            groupByField2.charAt(0).toUpperCase() + groupByField2.slice(1),
                    },
                },
                legend: {
                    title: {
                        text:
                            groupByField1.charAt(0).toUpperCase() + groupByField1.slice(1),
                    },
                },
            };

            let finalChartData;
            if (item.charttype.toLowerCase() === "pie") {
                const pieData = uniqueValues1.map((val1) =>
                    response.data
                        .filter((item) => (item[groupByField1] || "Unknown") === val1)
                        .reduce((sum, item) => sum + parseInt(item.count), 0)
                );

                finalChartData = {
                    options: {
                        ...chartOptions,
                        labels: uniqueValues1,
                    },
                    series: pieData,
                };
            } else {
                finalChartData = {
                    options: chartOptions,
                    series: series,
                };
            }

            setChartData(finalChartData);
        } catch (error) {
            console.log(error);
        }
    };

    const handleDeleteDashboard = async (dashboard) => {
        console.log(dashboard, "dashboard for deletion");
        try {
            const response = await RequestServer(
                "delete",
                `${deleteDashboard}/${dashboard._id}`
            );
            console.log(response, "response data ");
            if (response.success) {
                fetchDashboardData();
            }
        } catch (error) {
            console.log(error);
        }
    };



    console.log(permissionValues, "permissionValues from dashboard index");
    console.log(selectedDashboard, "selectedDashboard");
    return (
        <Box sx={{
            minHeight: '100vh',
            bgcolor: theme.palette.background.default,
            p: 3,
            position: 'relative'
        }}>
            {/* New Dashboard Button - Top Right */}
            {permissionValues.read && permissionValues.create && (
                <Box sx={{
                    padding: "10px",
                    display: "flex",
                    justifyContent: "end"
                }} >
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleOpen}
                        sx={{
                            borderRadius: '8px',
                            textTransform: 'none',
                            boxShadow: theme.shadows[4],
                            '&:hover': {
                                boxShadow: theme.shadows[6]
                            },
                            fontWeight: "bold",
                            fontSize: "15px"
                        }}
                    >
                        New Dashboard
                    </Button>
                </Box>
            )}

            {isLoading ? (
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh'
                }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Box>
                    {permissionValues.read && (
                        <Grid container spacing={3}>
                            {/* Dashboard List Column */}
                            {/* <Grid item xs={12} md={4} lg={3}>
                <Paper
                  elevation={3}
                  sx={{
                    height: '85vh',
                    overflowY: 'auto',
                    p: 2,
                    position: 'sticky',
                    top: 0,
                    '&::-webkit-scrollbar': {
                      width: '0.4em'
                    },
                    '&::-webkit-scrollbar-track': {
                      boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
                      webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)'
                    },
                    '&::-webkit-scrollbar-thumb': {
                      backgroundColor: 'rgba(0,0,0,.1)',
                      borderRadius: '4px'
                    }
                  }}
                >
                  <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 3
                  }}>
                    <Typography variant="h5" fontWeight="bold">
                      Dashboards
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {dashboards.map((dashboard) => (
                      <Card
                        key={dashboard._id}
                        onClick={() => handleDashboardClick(dashboard)}
                        sx={{
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          bgcolor: activeDashboardId === dashboard._id
                            ? alpha(theme.palette.primary.main, 0.12) // Softer highlight using primary color
                            : theme.palette.background.paper,
                          '&:hover': {
                            boxShadow: theme.shadows[4],
                            transform: 'translateY(-2px)',
                            bgcolor: activeDashboardId === dashboard._id
                              ? alpha(theme.palette.primary.main, 0.15) // Slightly darker on hover
                              : alpha(theme.palette.primary.main, 0.08)
                          },
                          borderLeft: activeDashboardId === dashboard._id
                            ? `4px solid ${theme.palette.primary.main}` // Add left border for selected item
                            : '4px solid transparent',
                          borderRadius: '8px'
                        }}
                      >
                        <CardContent>
                          <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start'
                          }}>
                            <Box>
                              <Typography
                                variant="h6"
                                sx={{
                                  fontWeight: 'bold',
                                  mb: 1,
                                  color: theme.palette.text.primary
                                }}
                              >
                                {dashboard.dashboardname}
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Chip
                                  label={dashboard.objectname}
                                  size="small"
                                  color="primary"
                                  variant="outlined"
                                />
                                {dashboard.charttype.toLowerCase() === 'pie' ? (
                                  <PieChartIcon color="action" fontSize="small" />
                                ) : (
                                  <BarChartIcon color="action" fontSize="small" />
                                )}
                              </Box>
                            </Box>

                            <Box sx={{ display: 'flex', gap: 1 }}>
                              {permissionValues.edit && (
                                <IconButton
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEdit(dashboard);
                                  }}
                                  sx={{
                                    '&:hover': {
                                      bgcolor: theme.palette.primary.light
                                    }
                                  }}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              )}
                              {permissionValues.delete && (
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteDashboard(dashboard);
                                  }}
                                  sx={{
                                    '&:hover': {
                                      bgcolor: theme.palette.error.light
                                    }
                                  }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              )}
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                </Paper>
              </Grid> */}
                            <Grid item xs={12} md={4} lg={3}>
                                <DashboardList
                                    dashboards={dashboards}
                                    activeDashboardId={activeDashboardId}
                                    onDashboardClick={handleDashboardClick}
                                    onEdit={handleEdit}
                                    onDelete={handleDeleteDashboard}
                                    permissionValues={permissionValues}
                                />
                            </Grid>
                            {/* Chart Area Column */}
                            <Grid item xs={12} md={8} lg={9}>
                                <Paper
                                    elevation={3}
                                    sx={{
                                        height: '85vh',
                                        p: 3,
                                        borderRadius: '8px'
                                    }}
                                >
                                    {chartData && selectedDashboard ? (
                                        <Box sx={{ height: '100%' }}>
                                            <Box sx={{ mb: 3 }}>
                                                <Typography variant="h5" fontWeight="bold" gutterBottom>
                                                    {selectedDashboard.dashboardname}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Analysis by {Array.isArray(selectedDashboard.fields)
                                                        ? selectedDashboard.fields.join(' and ')
                                                        : selectedDashboard.fields}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ height: 'calc(100% - 80px)' }}>
                                                <DynamicChart
                                                    data={chartData}
                                                    chartType={selectedDashboard.charttype}
                                                    title={selectedDashboard.dashboardname}
                                                    groupByField1={
                                                        Array.isArray(selectedDashboard?.fields)
                                                            ? selectedDashboard.fields[0]
                                                            : selectedDashboard.fields?.split(',')[0]
                                                    }
                                                    groupByField2={
                                                        Array.isArray(selectedDashboard?.fields)
                                                            ? selectedDashboard.fields[1]
                                                            : selectedDashboard.fields?.split(',')[1]
                                                    }
                                                />
                                            </Box>
                                        </Box>
                                    ) : (
                                        <Box sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            height: '100%',
                                            gap: 2
                                        }}>
                                            <BarChartIcon sx={{ fontSize: 60, color: 'text.secondary' }} />
                                            <Typography variant="h6" color="text.secondary">
                                                Select a dashboard to view its chart
                                            </Typography>
                                        </Box>
                                    )}
                                </Paper>
                            </Grid>
                        </Grid>
                    )}

                    <DashboardDetailPage
                        open={open}
                        handleClose={handleClose}
                        initialValues={editingDashboard}
                        onSubmit={handleSubmit}
                        isEditing={!!editingDashboard}
                        permissionValues={permissionValues}
                    />
                </Box>
            )}
        </Box>
    );
};
