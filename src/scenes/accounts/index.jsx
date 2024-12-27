import React, { useState, useEffect } from "react";
import { useTheme, Box, useMediaQuery, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import ExcelDownload from "../Excel";
import { RequestServer } from "../api/HttpReq";
import { apiCheckPermission } from "../Auth/apiCheckPermission";
import { getLoginUserRoleDept } from "../Auth/userRoleDept";
import ListViewContainer from "../../components/common/ListView/ListViewContainer";

// Constants
const CONSTANTS = {
  OBJECT_NAME: 'Account',
  ROUTES: {
    ACCOUNTS: '/accounts',
    DELETE_ACCOUNT: '/deleteAccount',
    NEW_ACCOUNT: '/new-accounts',
    ACCOUNT_DETAIL: '/accountDetailPage',
  },
  TITLES: {
    MAIN: 'Accounts',
    WEB_SUBTITLE: 'List Of Accounts',
    MOBILE_SUBTITLE: 'List of Accounts',
  },
  ERROR_MESSAGES: {
    DELETE_MULTIPLE: 'Some accounts failed to delete',
    DELETE_SINGLE: 'Failed to delete account',
    DEFAULT: 'An error occurred',
  },
  SUCCESS_MESSAGES: {
    DELETE_MULTIPLE: 'All accounts deleted successfully',
    DELETE_SINGLE: 'Account deleted successfully',
  },
};

// Table configuration
const TABLE_CONFIG = {
  mobileFields: [
    {
      key: "accountname",
      label: "Name"
    },
    {
      key: "phone",
      label: "Phone"
    },
    {
      key: "billingcity",
      label: "City"
    },
    {
      key: "industry",
      label: "Industry"
    }
  ],
  columns: [
    {
      field: "accountname",
      headerName: "Name",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "phone",
      headerName: "Phone",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "billingcity",
      headerName: "City",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "annualrevenue",
      headerName: "Annual Revenue",
      headerAlign: "center",
      align: "center",
      flex: 1,
      renderCell: (params) => {
        const formatCurrency = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        });
        return params.row.annualrevenue ? formatCurrency.format(params.row.annualrevenue) : null;
      },
    },
    {
      field: "industry",
      headerName: "Industry",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
  ],
};

/**
 * Accounts Component
 * Manages the display and interactions for accounts in both mobile and desktop views
 */
const Accounts = () => {
  // Hooks
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const userRoleDept = getLoginUserRoleDept(CONSTANTS.OBJECT_NAME);

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
      const response = await RequestServer("get", CONSTANTS.ROUTES.ACCOUNTS, {});
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
    navigate(CONSTANTS.ROUTES.NEW_ACCOUNT, { state: { record: {} } });
  };

  const handleAccountDetail = (event) => {
    const account = event.row || event;
    navigate(`${CONSTANTS.ROUTES.ACCOUNT_DETAIL}/${account._id}`, {
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
        `${CONSTANTS.ROUTES.DELETE_ACCOUNT}/${recordId}`,
        {}
      );

      if (response.data) {
        await fetchAccountRecords();
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

  // Column configuration with conditional delete action
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
        records={accountRecords}
        onCreateRecord={handleCreateAccount}
        onEditRecord={handleAccountDetail}
        onDeleteRecord={isMobile ? (permissions.delete ? handleDelete : null) : handleDelete}
        permissions={permissions}
        columnConfig={isMobile ? TABLE_CONFIG.mobileFields : getTableColumns()}
        isLoading={isLoading}
        isDeleteMode={isDeleteMode}
        selectedRecordIds={selectedIds}
        onToggleDeleteMode={setIsDeleteMode}
        onSelectRecords={setSelectedIds}
        ExcelDownload={ExcelDownload}
        importConfig={{
          objectName: CONSTANTS.OBJECT_NAME,
          isImport: true,
          callBack: fetchAccountRecords,
        }}
      />
    </Box>
  );
};

export default Accounts;
