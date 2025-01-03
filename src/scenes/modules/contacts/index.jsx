import React, { useState, useEffect } from "react";
import { useTheme, Box, useMediaQuery, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import ExcelDownload from "../Excel";
import { RequestServer } from "../../api/HttpReq";
import { apiCheckPermission } from '../../../scenes/shared/Auth/apiCheckPermission';
import { getLoginUserRoleDept } from "../../../scenes/shared/Auth/userRoleDept";
import ListViewContainer from "../../../components/common/dataGrid/ListViewContainer";
import { CONTACT_TABLE_CONFIG } from "../../../config/tableConfigs";
import { CONTACT_CONSTANTS } from "../../../config/constantConfigs";


/**
 * Contacts Component
 * Manages the display and interactions for contacts in both mobile and desktop views
 */
const Contacts = () => {
  // Hooks
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const userRoleDept = getLoginUserRoleDept(CONTACT_CONSTANTS.OBJECT_NAME);

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
    await Promise.all([fetchContactRecords(), fetchPermissions()]);
  };

  // Fetches the list of contacts
  const fetchContactRecords = async () => {
    try {
      const response = await RequestServer(
        "get",
        CONTACT_CONSTANTS.ROUTES.CONTACTS,
        {}
      );
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
      console.error("Error fetching permissions:", error);
      setPermissions({});
    }
  };

  // Navigation handlers
  const handleCreateContact = () => {
    navigate(CONTACT_CONSTANTS.ROUTES.NEW_CONTACT, { state: { record: {} } });
  };

  const handleContactDetail = (event) => {
    const contact = event.row || event;
    navigate(`${CONTACT_CONSTANTS.ROUTES.CONTACT_DETAIL}/${contact._id}`, {
      state: { record: { item: contact } },
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
        `${CONTACT_CONSTANTS.ROUTES.DELETE_CONTACT}/${recordId}`,
        {}
      );

      if (response.data) {
        await fetchContactRecords();
        return {
          success: true,
          message: CONTACT_CONSTANTS.SUCCESS_MESSAGES.DELETE_SINGLE,
        };
      }

      return {
        success: false,
        message: CONTACT_CONSTANTS.ERROR_MESSAGES.DELETE_SINGLE,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || CONTACT_CONSTANTS.ERROR_MESSAGES.DEFAULT,
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
        ? CONTACT_CONSTANTS.ERROR_MESSAGES.DELETE_MULTIPLE
        : CONTACT_CONSTANTS.SUCCESS_MESSAGES.DELETE_MULTIPLE,
    };
  };

  // Column configuration with conditional delete action
  const getTableColumns = () => {
    if (!permissions.delete) return CONTACT_TABLE_CONFIG.columns;

    return [
      ...CONTACT_TABLE_CONFIG.columns,
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
        title={CONTACT_CONSTANTS.TITLES.MAIN}
        subtitle={
          isMobile
            ? CONTACT_CONSTANTS.TITLES.MOBILE_SUBTITLE
            : CONTACT_CONSTANTS.TITLES.WEB_SUBTITLE
        }
        records={contactRecords}
        onCreateRecord={handleCreateContact}
        onEditRecord={handleContactDetail}
        onDeleteRecord={
          isMobile ? (permissions.delete ? handleDelete : null) : handleDelete
        }
        permissions={permissions}
        columnConfig={isMobile ? CONTACT_TABLE_CONFIG.mobileFields : getTableColumns()}
        isLoading={isLoading}
        isDeleteMode={isDeleteMode}
        selectedRecordIds={selectedIds}
        onToggleDeleteMode={setIsDeleteMode}
        onSelectRecords={setSelectedIds}
        ExcelDownload={ExcelDownload}
        importConfig={CONTACT_CONSTANTS.IMPORT_CONFIG}
      />
    </Box>
  );
};

export default Contacts;
