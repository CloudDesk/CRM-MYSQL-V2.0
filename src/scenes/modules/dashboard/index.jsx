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
import { getUserRoleAndDepartment } from "../../../utils/sessionUtils";
import { useCheckPermission } from "../../hooks/useCheckPermission";
import DashboardList from "./DashboardList";
import { appConfig } from "../../../config/appConfig";

const OBJECT_API = appConfig.objects.dashboard.apiName;
const getDashboardURL = appConfig.objects.dashboard.base;
const upsertDashboardURL = appConfig.objects.dashboard.upsert;
const dashboardGroupURL = appConfig.objects.dashboard.dashboardGroup;
const deleteDashboard = appConfig.objects.dashboard.delete;

const DashboardIndex = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [dashboards, setDashboards] = useState([]);
  const [editingDashboard, setEditingDashboard] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [selectedDashboard, setSelectedDashboard] = useState(null);
  const [activeDashboardId, setActiveDashboardId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const userRoleDept = getUserRoleAndDepartment(OBJECT_API);

  const { permissions } = useCheckPermission({
    role: userRoleDept?.role,
    object: userRoleDept?.object,
    departmentname: userRoleDept?.departmentname
  });

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

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setEditingDashboard(null);
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
  console.log(chartData, "chartdata");
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

  console.log(selectedDashboard, "selectedDashboard");
  return (
    <Box sx={{
      minHeight: '100vh',
      bgcolor: theme.palette.background.default,
      p: 3,
      position: 'relative'
    }}>
      {/* New Dashboard Button - Top Right */}
      {permissions.read && permissions.create && (
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
          {permissions.read && (
            <Grid container spacing={3}>

              <Grid item xs={12} md={4} lg={3}>
                <DashboardList
                  dashboards={dashboards}
                  activeDashboardId={activeDashboardId}
                  onDashboardClick={handleDashboardClick}
                  onEdit={handleEdit}
                  onDelete={handleDeleteDashboard}
                  permissionValues={permissions}
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
            permissionValues={permissions}
          />
        </Box>
      )}
    </Box>
  );
};

export default DashboardIndex;