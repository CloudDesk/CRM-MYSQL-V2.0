import React, { useState, useEffect } from "react";
import { useTheme, Box, useMediaQuery, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import ExcelDownload from "../Excel";
import { RequestServer } from "../api/HttpReq";
import { apiCheckPermission } from "../Auth/apiCheckPermission";
import { getLoginUserRoleDept } from "../Auth/userRoleDept";
import ListViewContainer from "../../components/common/ListViewContainer";

// Constants
const CONSTANTS = {
  OBJECT_NAME: 'Contact',
  ROUTES: {
    CONTACTS: '/contacts',
    DELETE_CONTACT: '/deleteContact',
    NEW_CONTACT: '/new-contacts',
    CONTACT_DETAIL: '/contactDetailPage',
  },
  TITLES: {
    MAIN: 'Contacts',
    WEB_SUBTITLE: 'List Of Contacts',
    MOBILE_SUBTITLE: 'List of Contacts',
  },
  ERROR_MESSAGES: {
    DELETE_MULTIPLE: 'Some contacts failed to delete',
    DELETE_SINGLE: 'Failed to delete contact',
    DEFAULT: 'An error occurred',
  },
  SUCCESS_MESSAGES: {
    DELETE_MULTIPLE: 'All contacts deleted successfully',
    DELETE_SINGLE: 'Contact deleted successfully',
  },
  IMPORT_CONFIG: {
    objectName: 'Contact',
    isImport: false,
    callBack: null,
  },
};

// Table configuration
const TABLE_CONFIG = {
  mobileFields: [
    {
      key: "lastname",
      label: "Last Name"
    },
    {
      key: "accountname",
      label: "Account Name"
    },
    {
      key: "phone",
      label: "Phone"
    },
    {
      key: "email",
      label: "Email"
    }
  ],
  columns: [
    {
      field: "lastname",
      headerName: "Last Name",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "accountname",
      headerName: "Account Name",
      headerAlign: "center",
      align: "center",
      flex: 1,
      renderCell: (params) => {
        if (params.row.accountname) {
          return <div className="rowitem">{params.row.accountname}</div>;
        }
        return <div className="rowitem">{null}</div>;
      },
    },
    {
      field: "phone",
      headerName: "Phone",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "leadsource",
      headerName: "Lead Source",
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
  ],
};

/**
 * Contacts Component
 * Manages the display and interactions for contacts in both mobile and desktop views
 */
const Contacts = () => {
  // Hooks
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const userRoleDept = getLoginUserRoleDept(CONSTANTS.OBJECT_NAME);

  // State management
  const [contactRecords, setContactRecords] = useState([]);
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
      fetchContactRecords(),
      fetchPermissions(),
    ]);
  };

  // Fetches the list of contacts
  const fetchContactRecords = async () => {
    try {
      const response = await RequestServer("get", CONSTANTS.ROUTES.CONTACTS, {});
      if (response.success) {
        setContactRecords(response.data);
        setFetchError(null);
      } else {
        setContactRecords([]);
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
  const handleCreateContact = () => {
    navigate(CONSTANTS.ROUTES.NEW_CONTACT, { state: { record: {} } });
  };

  const handleContactDetail = (event) => {
    const contact = event.row || event;
    navigate(`${CONSTANTS.ROUTES.CONTACT_DETAIL}/${contact._id}`, {
      state: { record: { item: contact } }
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
        `${CONSTANTS.ROUTES.DELETE_CONTACT}/${recordId}`,
        {}
      );

      if (response.data) {
        await fetchContactRecords();
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
        records={contactRecords}
        onCreateRecord={handleCreateContact}
        onEditRecord={handleContactDetail}
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

export default Contacts;
