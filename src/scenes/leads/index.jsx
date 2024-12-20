import React, { useState, useEffect } from "react";
import { useTheme, Box, IconButton, useMediaQuery } from "@mui/material";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import ExcelDownload from "../Excel";
import { RequestServer } from "../api/HttpReq";
import { apiCheckPermission } from "../Auth/apiCheckPermission";
import { getLoginUserRoleDept } from "../Auth/userRoleDept";
import SharedDataGridSkeleton from "../../components/Skeletons/SharedDataGridSkeleton";
import MobileListView from "../../components/common/MobileListView";
import WebListView from "../../components/common/WebListView";
import NoAccessPage from "../../components/NoAccessPage";


// Constants
const CONSTANTS = {
  OBJECT_NAME: 'Enquiry',
  ROUTES: {
    LEADS: '/leads',
    DELETE_LEAD: '/deleteLead',
    NEW_LEAD: '/new-leads',
    LEAD_DETAIL: '/leadDetailPage',
  },
  TITLES: {
    MAIN: 'Enquiries',
    WEB_SUBTITLE: 'List Of Enquiries',
    MOBILE_SUBTITLE: 'List of Enquiries',
  },
  ERROR_MESSAGES: {
    DELETE_MULTIPLE: 'Some records failed to delete',
    DELETE_SINGLE: 'Failed to delete record',
    DEFAULT: 'An error occurred',
  },
  SUCCESS_MESSAGES: {
    DELETE_MULTIPLE: 'All records deleted successfully',
    DELETE_SINGLE: 'Record deleted successfully',
  },
};

// Table configuration
const TABLE_CONFIG = {
  mobileFields: [
    { label: "Enquiry Name", key: "fullname" },
    { label: "Lead Source", key: "leadsource" },
    { label: "Lead Status", key: "leadstatus" },
    { label: "Email", key: "email" },
  ],
  columns: [
    {
      field: "fullname",
      headerName: "Full Name",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "leadsource",
      headerName: "Enquiry Source",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "industry",
      headerName: "Industry",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "leadstatus",
      headerName: "Enquiry Status",
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
 * Leads Component
 * Manages the display and interactions for enquiries/leads in both mobile and desktop views
 */
const Leads = () => {

  // Hooks
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const userRoleDept = getLoginUserRoleDept(CONSTANTS.OBJECT_NAME);

  // State management
  const [enquiryRecords, setEnquiryRecords] = useState([]);
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
      fetchEnquiryRecords(),
      fetchUserPermissions(),
    ]);
  };

  // Fetches the list of enquiries
  const fetchEnquiryRecords = async () => {
    try {
      const response = await RequestServer("get", CONSTANTS.ROUTES.LEADS, {});
      if (response.success) {
        setEnquiryRecords(response.data);
        setFetchError(null);
      } else {
        setEnquiryRecords([]);
        setFetchError(response.error.message);
      }
    } catch (error) {
      setFetchError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserPermissions = async () => {
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
  const handleCreateEnquiry = () => {
    navigate(CONSTANTS.ROUTES.NEW_LEAD, { state: { record: {} } });
  };

  const handleEnquiryDetail = (event) => {
    const enquiry = event.row || event;
    navigate(`${CONSTANTS.ROUTES.LEAD_DETAIL}/${enquiry._id}`, {
      state: { record: { item: enquiry } }
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
        `${CONSTANTS.ROUTES.DELETE_LEAD}/${recordId}`,
        {}
      );

      if (response.data) {
        await fetchEnquiryRecords();
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


  // Render helpers
  const renderContent = () => {
    if (isLoading) return <SharedDataGridSkeleton />;
    if (!permissions.read) return <NoAccessPage />;

    return isMobile
      ? renderMobileView()
      : renderWebView();
  };

  const renderMobileView = () => (
    <MobileListView
      title={CONSTANTS.TITLES.MAIN}
      subtitle={CONSTANTS.TITLES.MOBILE_SUBTITLE}
      records={enquiryRecords}
      columnConfig={TABLE_CONFIG.mobileFields}
      onCreateRecord={handleCreateEnquiry}
      onEditRecord={handleEnquiryDetail}
      permissions={permissions}
      onDeleteRecord={permissions.delete ? handleDelete : null}
    />
  );

  const renderWebView = () => (
    <WebListView
      title={CONSTANTS.TITLES.MAIN}
      subtitle={CONSTANTS.TITLES.WEB_SUBTITLE}
      records={enquiryRecords}
      columnConfig={getTableColumns()}
      isLoading={isLoading}
      isDeleteMode={isDeleteMode}
      permissions={permissions}
      selectedRecordIds={selectedIds}
      onCreateRecord={handleCreateEnquiry}
      onDeleteRecord={handleDelete}
      onToggleDeleteMode={setIsDeleteMode}
      onSelectRecords={setSelectedIds}
      onEditRecord={handleEnquiryDetail}
      ExcelDownload={ExcelDownload}
      importConfig={{
        objectName: CONSTANTS.OBJECT_NAME,
        isImport: true,
        callBack: fetchEnquiryRecords,
      }}
    />
  );

  return (
    <Box>
      {renderContent()}
    </Box>
  );
};

export default Leads;
