import React, { useState, useEffect } from "react";
import { Box, IconButton, useMediaQuery, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import ExcelDownload from "../Excel";
import { RequestServer } from "../../api/HttpReq";
import { apiCheckPermission } from '../../../scenes/shared/Auth/apiCheckPermission';
import { getLoginUserRoleDept } from "../../../scenes/shared/Auth/userRoleDept";
import ListViewContainer from "../../../components/common/dataGrid/ListViewContainer";
import { TASK_TABLE_CONFIG } from "../../../config/tableConfigs";
import { TASK_CONSTANTS } from "../../../config/constantConfigs";



const Tasks = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const userRoleDept = getLoginUserRoleDept(TASK_CONSTANTS.OBJECT_NAME);

  const [records, setRecords] = useState([]);
  const [fetchError, setFetchError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [permissions, setPermissions] = useState({});

  useEffect(() => {
    initializeComponent();
  }, []);

  const initializeComponent = async () => {
    await Promise.all([fetchRecords(), fetchPermissions()]);
  };

  const fetchRecords = async () => {
    try {
      const response = await RequestServer("get", TASK_CONSTANTS.ROUTES.TASK, {});
      if (response.success) {
        setRecords(response.data);
        setFetchError(null);
      } else {
        setRecords([]);
        setFetchError(response.error.message);
      }
    } catch (error) {
      setFetchError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPermissions = async () => {
    if (!userRoleDept) return;
    try {
      const permissions = await apiCheckPermission(userRoleDept);
      setPermissions(permissions);
    } catch (error) {
      console.error("Error fetching permissions:", error);
      setPermissions({});
    }
  };

  const handleCreateRecord = () => {
    navigate(TASK_CONSTANTS.ROUTES.NEW_TASK, { state: { record: {} } });
  };

  const handleEditRecord = (event) => {
    const item = event.row || event;
    navigate(`${TASK_CONSTANTS.ROUTES.TASK_DETAIL}/${item._id}`, {
      state: { record: { item } },
    });
  };

  const handleDelete = async (event, recordId) => {
    event.stopPropagation();

    if (Array.isArray(recordId)) {
      return await handleBulkDelete(event, recordId);
    }
    return await handleSingleDelete(event, recordId);
  };

  const handleSingleDelete = async (event, recordId) => {
    try {
      const response = await RequestServer(
        "delete",
        `${TASK_CONSTANTS.ROUTES.DELETE_TASK}/${recordId}`,
        {}
      );

      if (response.data) {
        await fetchRecords();
        return {
          success: true,
          message: TASK_CONSTANTS.SUCCESS_MESSAGES.DELETE_SINGLE,
        };
      }

      return {
        success: false,
        message: TASK_CONSTANTS.ERROR_MESSAGES.DELETE_SINGLE,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || TASK_CONSTANTS.ERROR_MESSAGES.DEFAULT,
      };
    }
  };

  const handleBulkDelete = async (event, recordIds) => {
    const deleteResults = await Promise.all(
      recordIds.map((id) => handleSingleDelete(event, id))
    );

    const hasFailures = deleteResults.some((result) => !result.success);

    return {
      success: !hasFailures,
      message: hasFailures
        ? TASK_CONSTANTS.ERROR_MESSAGES.DELETE_MULTIPLE
        : TASK_CONSTANTS.SUCCESS_MESSAGES.DELETE_MULTIPLE,
    };
  };

  const getTableColumns = () => {
    if (!permissions.delete) return TASK_TABLE_CONFIG.columns;

    return [
      ...TASK_TABLE_CONFIG.columns,
      {
        field: "actions",
        headerName: "Actions",
        headerAlign: "center",
        align: "center",
        width: 400,
        flex: 1,
        renderCell: (params) =>
          !isDeleteMode && (
            <IconButton
              onClick={(e) => handleDelete(e, params.row._id)}
              style={{ padding: "20px", color: "#FF3333" }}
            >
              <DeleteIcon />
            </IconButton>
          ),
      },
    ];
  };

  return (
    <Box>
      <ListViewContainer
        isMobile={isMobile}
        title={TASK_CONSTANTS.TITLES.MAIN}
        subtitle={
          isMobile
            ? TASK_CONSTANTS.TITLES.MOBILE_SUBTITLE
            : TASK_CONSTANTS.TITLES.WEB_SUBTITLE
        }
        records={records}
        onCreateRecord={handleCreateRecord}
        onEditRecord={handleEditRecord}
        onDeleteRecord={
          isMobile ? (permissions.delete ? handleDelete : null) : handleDelete
        }
        permissions={permissions}
        columnConfig={isMobile ? TASK_TABLE_CONFIG.mobileFields : getTableColumns()}
        isLoading={isLoading}
        isDeleteMode={isDeleteMode}
        selectedRecordIds={selectedIds}
        onToggleDeleteMode={setIsDeleteMode}
        onSelectRecords={setSelectedIds}
        ExcelDownload={ExcelDownload}
        importConfig={TASK_CONSTANTS.IMPORT_CONFIG}
      />
    </Box>
  );
};

export default Tasks;