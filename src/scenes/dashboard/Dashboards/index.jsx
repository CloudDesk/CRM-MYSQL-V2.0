import React, { useEffect, useState } from "react";
import {
  Button,
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DashboardForm from "./DashboardForm";
import DynamicChart from "./DynamicChart";
import { DashboardDetailPage } from "../../recordDetailPage/DashboardDetailPage";
import { RequestServer } from "../../api/HttpReq";
import { getLoginUserRoleDept } from "../../Auth/userRoleDept";
import { apiCheckPermission } from "../../Auth/apiCheckPermission";
import Loader from "../../../components/Loader";

const OBJECT_API = "Dashboard";
const getDashboardURL = "/dashboard";
const upsertDashboardURL = `/upsertDashboard`;
const dashboardGroupURL = `/dashboardGroup`;
const deleteDashboard = `/deleteDashboard`;
export const DashboardIndex = () => {
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
    setEditingDashboard(dashboard);
    setOpen(true);
  };

  const handleDashboardClick = async (item) => {
    console.log(item, "item from handleDashboardClick");
    setActiveDashboardId(item._id);
    try {
      const response = await RequestServer(
        "get",
        `${dashboardGroupURL}?object=${item.objectname.toLowerCase()}&field=${
          item.fields
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
      if (response.status === 200) {
        fetchDashboardData();
      }
    } catch (error) {
      console.log(error);
    }
  };

  console.log(permissionValues, "permissionValues");
  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : (
        <Box>
          {permissionValues.read ? (
            <Box sx={{ p: 3 }}>
              {permissionValues.create ? (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 3,
                  }}
                >
                  <Typography variant="h4">Dashboards</Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleOpen}
                  >
                    New Dashboard
                  </Button>
                </Box>
              ) : null}

              <Box
                sx={{
                  display: "grid",
                  gap: 2,
                  gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                }}
              >
                {dashboards.map((dashboard) => (
                  <Card
                    key={dashboard._id}
                    onClick={() => handleDashboardClick(dashboard)}
                    sx={{
                      cursor: "pointer",
                      backgroundColor:
                        activeDashboardId === dashboard._id
                          ? "#f0f8ff"
                          : "white",
                      boxShadow:
                        activeDashboardId === dashboard._id
                          ? "0 4px 10px rgba(0, 0, 0, 0.2)"
                          : "0 2px 4px rgba(0, 0, 0, 0.1)",
                      borderRadius: "8px",
                      transition: "background-color 0.3s, box-shadow 0.3s",
                      "&:hover": {
                        boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)",
                      },
                    }}
                  >
                    <CardContent>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mb: 1,
                        }}
                      >
                        <Typography variant="h6">
                          {dashboard.dashboardname}
                        </Typography>
                        {permissionValues.edit ? (
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(dashboard);
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        ) : null}
                      </Box>
                      <Typography color="textSecondary" variant="body2">
                        Chart Type: {dashboard.charttype}
                      </Typography>
                      <Typography color="textSecondary" variant="body2">
                        Object: {dashboard.objectname}
                      </Typography>
                    </CardContent>
                    <Box
                      sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}
                    >
                      {permissionValues.delete ? (
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteDashboard(dashboard);
                            fetchDashboardData();
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      ) : null}
                    </Box>
                  </Card>
                ))}
              </Box>

              {chartData && selectedDashboard && (
                <DynamicChart
                  data={chartData}
                  chartType={selectedDashboard.charttype}
                  title={selectedDashboard.dashboardname}
                  groupByField1={
                    Array.isArray(selectedDashboard?.fields)
                      ? selectedDashboard.fields[0]
                      : typeof selectedDashboard?.fields === "string"
                      ? selectedDashboard.fields.split(",")[0]
                      : null
                  }
                  groupByField2={
                    Array.isArray(selectedDashboard?.fields)
                      ? selectedDashboard.fields[1]
                      : typeof selectedDashboard?.fields === "string"
                      ? selectedDashboard.fields.split(",")[1]
                      : null
                  }
                />
              )}

              <DashboardDetailPage
                open={open}
                handleClose={handleClose}
                initialValues={editingDashboard}
                onSubmit={handleSubmit}
                isEditing={!!editingDashboard}
                // onObjectChange={handleObjectChange}
                permissionValues={permissionValues}
              />
            </Box>
          ) : null}
        </Box>
      )}
    </div>
  );
};
