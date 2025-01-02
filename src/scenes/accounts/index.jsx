import React, { useState, useEffect } from "react";
import { useTheme, Box, useMediaQuery, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import ExcelDownload from "../Excel";
import { RequestServer } from "../api/HttpReq";
import { apiCheckPermission } from "../Auth/apiCheckPermission";
import { getLoginUserRoleDept } from "../Auth/userRoleDept";
import ListViewContainer from "../../components/common/ListView/ListViewContainer";
import { ACCOUNT_TABLE_CONFIG } from "../config/tableConfigs";
import { ACCOUNT_CONSTANTS } from "../config/constantConfigs";


/**
 * Accounts Component
 * Manages the display and interactions for accounts in both mobile and desktop views
 */
const Accounts = () => {
  // Hooks
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const userRoleDept = getLoginUserRoleDept(ACCOUNT_CONSTANTS.OBJECT_NAME);

  // State management
  const [accountRecords, setAccountRecords] = useState([]);
  const [fetchError, setFetchError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [permissions, setPermissions] = useState({});

  // Effects
  useEffect(() => {
    initializeComponent();
  }, []);

  // Initialization
  const initializeComponent = async () => {
    await Promise.all([
      fetchAccountRecords(),
      fetchPermissions(),
    ]);
  };

  // Fetches the list of accounts
  const fetchAccountRecords = async () => {
    try {
      const response = await RequestServer("get", ACCOUNT_CONSTANTS.ROUTES.ACCOUNTS, {});
      if (response.success) {
        setAccountRecords(response.data);
        setFetchError(null);
      } else {
        setAccountRecords([]);
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

  // Navigation handlers
  const handleCreateAccount = () => {
    navigate(ACCOUNT_CONSTANTS.ROUTES.NEW_ACCOUNT, { state: { record: {} } });
  };

  const handleAccountDetail = (event) => {
    const account = event.row || event;
    navigate(`${ACCOUNT_CONSTANTS.ROUTES.ACCOUNT_DETAIL}/${account._id}`, {
      state: { record: { item: account } }
    });
  };

  // Delete operations
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
        `${ACCOUNT_CONSTANTS.ROUTES.DELETE_ACCOUNT}/${recordId}`,
        {}
      );

      if (response.data) {
        await fetchAccountRecords();
        return {
          success: true,
          message: ACCOUNT_CONSTANTS.SUCCESS_MESSAGES.DELETE_SINGLE,
        };
      }

      return {
        success: false,
        message: ACCOUNT_CONSTANTS.ERROR_MESSAGES.DELETE_SINGLE,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || ACCOUNT_CONSTANTS.ERROR_MESSAGES.DEFAULT,
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
        ? ACCOUNT_CONSTANTS.ERROR_MESSAGES.DELETE_MULTIPLE
        : ACCOUNT_CONSTANTS.SUCCESS_MESSAGES.DELETE_MULTIPLE,
    };
  };

  // Column configuration with conditional delete action
  const getTableColumns = () => {
    if (!permissions.delete) return ACCOUNT_TABLE_CONFIG.columns;

    return [
      ...ACCOUNT_TABLE_CONFIG.columns,
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
        title={ACCOUNT_CONSTANTS.TITLES.MAIN}
        subtitle={isMobile ? ACCOUNT_CONSTANTS.TITLES.MOBILE_SUBTITLE : ACCOUNT_CONSTANTS.TITLES.WEB_SUBTITLE}
        records={accountRecords}
        onCreateRecord={handleCreateAccount}
        onEditRecord={handleAccountDetail}
        onDeleteRecord={isMobile ? (permissions.delete ? handleDelete : null) : handleDelete}
        permissions={permissions}
        columnConfig={isMobile ? ACCOUNT_TABLE_CONFIG.mobileFields : getTableColumns()}
        isLoading={isLoading}
        isDeleteMode={isDeleteMode}
        selectedRecordIds={selectedIds}
        onToggleDeleteMode={setIsDeleteMode}
        onSelectRecords={setSelectedIds}
        ExcelDownload={ExcelDownload}
        importConfig={{
          objectName: ACCOUNT_CONSTANTS.OBJECT_NAME,
          isImport: true,
          callBack: fetchAccountRecords,
        }}
      />
    </Box>
  );
};

export default Accounts;
