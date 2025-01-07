import React, { useState, useEffect } from "react";
import { Box, IconButton, useMediaQuery, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import { RequestServer } from "../../api/HttpReq";
import { getUserRoleAndDepartment } from "../../../utils/sessionUtils";
import { useCheckPermission } from "../../hooks/useCheckPermission";
import ListViewContainer from "../../../components/common/dataGrid/ListViewContainer";
import { USER_TABLE_CONFIG } from "../../../config/tableConfigs";
import { USER_CONSTANTS } from "../../../config/constantConfigs";

const Users = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const userRoleDept = getUserRoleAndDepartment(USER_CONSTANTS.OBJECT_NAME);

  // State management
  const [records, setRecords] = useState([]);
  const [fetchError, setFetchError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  // Use the custom permission hook
  const { permissions } = useCheckPermission({
    role: userRoleDept?.role,
    object: userRoleDept?.object,
    departmentname: userRoleDept?.departmentname
  });

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const response = await RequestServer("get", USER_CONSTANTS.ROUTES.USERS);
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
  const handleCreateRecord = () => {
    navigate(USER_CONSTANTS.ROUTES.NEW_USER, { state: { record: {} } });
  };

  const handleEditRecord = (event) => {
    const item = event.row || event;
    navigate(`${USER_CONSTANTS.ROUTES.USER_DETAIL}/${item._id}`, {
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
        `${USER_CONSTANTS.ROUTES.DELETE_USER}/${recordId}`,
        {}
      );

      if (response.data) {
        await fetchRecords();
        return {
          success: true,
          message: USER_CONSTANTS.SUCCESS_MESSAGES.DELETE_SINGLE,
        };
      }

      return {
        success: false,
        message: USER_CONSTANTS.ERROR_MESSAGES.DELETE_SINGLE,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || USER_CONSTANTS.ERROR_MESSAGES.DEFAULT,
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
        ? USER_CONSTANTS.ERROR_MESSAGES.DELETE_MULTIPLE
        : USER_CONSTANTS.SUCCESS_MESSAGES.DELETE_MULTIPLE,
    };
  };

  const getTableColumns = () => {
    if (!permissions.delete) return USER_TABLE_CONFIG.columns;

    return [
      ...USER_TABLE_CONFIG.columns,
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
        title={USER_CONSTANTS.TITLES.MAIN}
        subtitle={isMobile ? USER_CONSTANTS.TITLES.MOBILE_SUBTITLE : USER_CONSTANTS.TITLES.WEB_SUBTITLE}
        records={records}
        onCreateRecord={handleCreateRecord}
        onEditRecord={handleEditRecord}
        onDeleteRecord={isMobile ? (permissions.delete ? handleDelete : null) : handleDelete}
        permissions={permissions}
        columnConfig={isMobile ? USER_TABLE_CONFIG.mobileFields : getTableColumns()}
        isLoading={isLoading}
        isDeleteMode={isDeleteMode}
        selectedRecordIds={selectedIds}
        onToggleDeleteMode={setIsDeleteMode}
        onSelectRecords={setSelectedIds}
        importConfig={USER_CONSTANTS.IMPORT_CONFIG}
      />
    </Box>
  );
};

export default Users;
