import React, { useState, useEffect } from "react";
import { useTheme, Box, IconButton, useMediaQuery } from "@mui/material";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import { RequestServer } from "../../api/HttpReq";
import { apiCheckPermission } from '../../../scenes/shared/Auth/apiCheckPermission';
import { getUserRoleAndDepartment } from "../../../utils/sessionUtils";
import ListViewContainer from "../../../components/common/dataGrid/ListViewContainer";
import { LEAD_TABLE_CONFIG } from "../../../config/tableConfigs";
import { LEAD_CONSTANTS } from "../../../config/constantConfigs";
/**
 * Leads Component
 * Manages the display and interactions for enquiries/leads in both mobile and desktop views
 */
const Leads = () => {

  // Hooks
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const userRoleDept = getUserRoleAndDepartment(LEAD_CONSTANTS.OBJECT_NAME);
  console.log(userRoleDept, "userRoleDept")
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
      const response = await RequestServer("get", LEAD_CONSTANTS.ROUTES.LEADS, {});
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
      console.log(permissions, "permissions")
      setPermissions(permissions);
    } catch (error) {
      console.error('Error fetching permissions:', error);
      setPermissions({});
    }
  };

  // Navigation handlers
  const handleCreateEnquiry = () => {
    navigate(LEAD_CONSTANTS.ROUTES.NEW_LEAD, { state: { record: {} } });
  };

  const handleEnquiryDetail = (event) => {
    const enquiry = event.row || event;
    navigate(`${LEAD_CONSTANTS.ROUTES.LEAD_DETAIL}/${enquiry._id}`, {
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
        `${LEAD_CONSTANTS.ROUTES.DELETE_LEAD}/${recordId}`,
        {}
      );

      if (response.data) {
        await fetchEnquiryRecords();
        return {
          success: true,
          message: LEAD_CONSTANTS.SUCCESS_MESSAGES.DELETE_SINGLE,
        };
      }

      return {
        success: false,
        message: LEAD_CONSTANTS.ERROR_MESSAGES.DELETE_SINGLE,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || LEAD_CONSTANTS.ERROR_MESSAGES.DEFAULT,
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
        ? LEAD_CONSTANTS.ERROR_MESSAGES.DELETE_MULTIPLE
        : LEAD_CONSTANTS.SUCCESS_MESSAGES.DELETE_MULTIPLE,
    };
  };


  // Column configuration with conditional delete action
  const getTableColumns = () => {
    if (!permissions.delete) return LEAD_TABLE_CONFIG.columns;

    return [
      ...LEAD_TABLE_CONFIG.columns,
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
      {/* {renderContent()} */}
      <ListViewContainer
        isMobile={isMobile}
        title={LEAD_CONSTANTS.TITLES.MAIN}
        subtitle={isMobile ? LEAD_CONSTANTS.TITLES.MOBILE_SUBTITLE : LEAD_CONSTANTS.TITLES.WEB_SUBTITLE}
        records={enquiryRecords}
        onCreateRecord={handleCreateEnquiry}
        onEditRecord={handleEnquiryDetail}
        onDeleteRecord={isMobile ? (permissions.delete ? handleDelete : null) : handleDelete}
        permissions={permissions}

        columnConfig={isMobile ? LEAD_TABLE_CONFIG.mobileFields : getTableColumns()}
        isLoading={isLoading}
        isDeleteMode={isDeleteMode}
        selectedRecordIds={selectedIds}
        onToggleDeleteMode={setIsDeleteMode}
        onSelectRecords={setSelectedIds}
        importConfig={{
          objectName: LEAD_CONSTANTS.OBJECT_NAME,
          isImport: true,
          callBack: fetchEnquiryRecords,
        }}
      />
    </Box>
  );
};

export default Leads;


/*

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
      title={LEAD_CONSTANTS.TITLES.MAIN}
      subtitle={LEAD_CONSTANTS.TITLES.MOBILE_SUBTITLE}
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
      title={LEAD_CONSTANTS.TITLES.MAIN}
      subtitle={LEAD_CONSTANTS.TITLES.WEB_SUBTITLE}
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
      importConfig={{
        objectName: LEAD_CONSTANTS.OBJECT_NAME,
        isImport: true,
        callBack: fetchEnquiryRecords,
      }}
    />
  );
*/