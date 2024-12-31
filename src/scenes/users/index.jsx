import React, { useState, useEffect } from "react";
import { Box, IconButton, useMediaQuery, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import ExcelDownload from "../Excel";
import { RequestServer } from "../api/HttpReq";
import { apiCheckPermission } from "../Auth/apiCheckPermission";
import { getLoginUserRoleDept } from "../Auth/userRoleDept";
import ListViewContainer from "../../components/common/ListView/ListViewContainer";
import { appConfig } from "../config";

// Constants
const CONSTANTS = {
  OBJECT_NAME: appConfig.objects.user.apiName,
  ROUTES: {
    USERS: appConfig.objects.user.base || '/Users',
    DELETE_USER: appConfig.objects.user.delete || '/delete',
    NEW_USER: appConfig.objects.user.new || '/new-users',
    USER_DETAIL: appConfig.objects.user.detail || '/userDetailPage',
  },
  TITLES: {
    MAIN: appConfig.objects.user.apiName,
    WEB_SUBTITLE: `List Of ${appConfig.objects.user.name.plural}`,
    MOBILE_SUBTITLE: `List Of ${appConfig.objects.user.name.plural}`,
  },
  ERROR_MESSAGES: {
    DELETE_MULTIPLE: 'Some users failed to delete',
    DELETE_SINGLE: 'Failed to delete user',
    DEFAULT: 'An error occurred',
  },
  SUCCESS_MESSAGES: {
    DELETE_MULTIPLE: 'All users deleted successfully',
    DELETE_SINGLE: 'User deleted successfully',
  },
  IMPORT_CONFIG: {
    objectName: appConfig.objects.user.apiName,
    isImport: false,
    callBack: null,
  },
};

// Table configuration
const TABLE_CONFIG = {
  mobileFields: [
    { label: "First Name", key: "firstname" },
    { label: "Last Name", key: "lastname" },
    { label: "Email", key: "email" },
    { label: "Role", key: "roledetails" },
  ],
  columns: [
    {
      field: "firstname",
      headerName: "First Name",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "lastname",
      headerName: "Last Name",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "roledetails",
      headerName: "Role",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "departmentname",
      headerName: "Department",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
  ],
};

const Users = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const userRoleDept = getLoginUserRoleDept(CONSTANTS.OBJECT_NAME);

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
    await Promise.all([
      fetchRecords(),
      fetchPermissions(),
    ]);
  };

  const fetchRecords = async () => {
    try {
      const response = await RequestServer("get", CONSTANTS.ROUTES.USERS, {});
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
      console.error('Error fetching permissions:', error);
      setPermissions({});
    }
  };

  const handleCreateRecord = () => {
    navigate(CONSTANTS.ROUTES.NEW_USER, { state: { record: {} } });
  };

  const handleEditRecord = (event) => {
    const item = event.row || event;
    navigate(`${CONSTANTS.ROUTES.USER_DETAIL}/${item._id}`, {
      state: { record: { item } }
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
        `${CONSTANTS.ROUTES.DELETE_USER}/${recordId}`,
        {}
      );

      if (response.data) {
        await fetchRecords();
        return {
          success: true,
          message: CONSTANTS.SUCCESS_MESSAGES.DELETE_SINGLE,
        };
      }

      return {
        success: false,
        message: CONSTANTS.ERROR_MESSAGES.DELETE_SINGLE,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || CONSTANTS.ERROR_MESSAGES.DEFAULT,
      };
    }
  };

  const handleBulkDelete = async (event, recordIds) => {
    const deleteResults = await Promise.all(
      recordIds.map(id => handleSingleDelete(event, id))
    );

    const hasFailures = deleteResults.some(result => !result.success);

    return {
      success: !hasFailures,
      message: hasFailures
        ? CONSTANTS.ERROR_MESSAGES.DELETE_MULTIPLE
        : CONSTANTS.SUCCESS_MESSAGES.DELETE_MULTIPLE,
    };
  };

  const getTableColumns = () => {
    if (!permissions.delete) return TABLE_CONFIG.columns;

    return [
      ...TABLE_CONFIG.columns,
      {
        field: "actions",
        headerName: "Actions",
        headerAlign: "center",
        align: "center",
        width: 400,
        flex: 1,
        renderCell: (params) => (
          !isDeleteMode && (
            <IconButton
              onClick={(e) => handleDelete(e, params.row._id)}
              style={{ padding: "20px", color: "#FF3333" }}
            >
              <DeleteIcon />
            </IconButton>
          )
        ),
      },
    ];
  };

  return (
    <Box>
      <ListViewContainer
        isMobile={isMobile}
        title={CONSTANTS.TITLES.MAIN}
        subtitle={isMobile ? CONSTANTS.TITLES.MOBILE_SUBTITLE : CONSTANTS.TITLES.WEB_SUBTITLE}
        records={records}
        onCreateRecord={handleCreateRecord}
        onEditRecord={handleEditRecord}
        onDeleteRecord={isMobile ? (permissions.delete ? handleDelete : null) : handleDelete}
        permissions={permissions}
        columnConfig={isMobile ? TABLE_CONFIG.mobileFields : getTableColumns()}
        isLoading={isLoading}
        isDeleteMode={isDeleteMode}
        selectedRecordIds={selectedIds}
        onToggleDeleteMode={setIsDeleteMode}
        onSelectRecords={setSelectedIds}
        ExcelDownload={ExcelDownload}
        importConfig={CONSTANTS.IMPORT_CONFIG}
      />
    </Box>
  );
};

export default Users;
