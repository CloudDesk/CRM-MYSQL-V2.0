import React, { useState, useEffect } from "react";
import { useTheme, Box, useMediaQuery, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import ExcelDownload from "../Excel";
import { RequestServer } from "../api/HttpReq";
import { apiCheckPermission } from "../Auth/apiCheckPermission";
import { getLoginUserRoleDept } from "../Auth/userRoleDept";
import ListViewContainer from "../../components/common/ListView/ListViewContainer";
import { appConfig } from "../config";
import { OPPORTUNITY_TABLE_CONFIG } from "../config/tableConfigs";
import { OPPORTUNITY_CONSTANTS } from "../config/constantConfigs";

/**
 * Opportunities Component
 * Manages the display and interactions for deals/opportunities in both mobile and desktop views
 */
const Opportunities = () => {
  // Hooks
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const userRoleDept = getLoginUserRoleDept(OPPORTUNITY_CONSTANTS.OBJECT_NAME);

  // State management
  const [dealRecords, setDealRecords] = useState([]);
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
      fetchDealRecords(),
      fetchPermissions(),
    ]);
  };

  // Fetches the list of opportunities
  const fetchDealRecords = async () => {
    try {
      const response = await RequestServer("get", OPPORTUNITY_CONSTANTS.ROUTES.OPPORTUNITIES, {});
      if (response.success) {
        setDealRecords(response.data);
        setFetchError(null);
      } else {
        setDealRecords([]);
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
  const handleCreateOpportunity = () => {
    navigate(OPPORTUNITY_CONSTANTS.ROUTES.NEW_OPPORTUNITY, { state: { record: {} } });
  };

  const handleOpportunityDetail = (event) => {
    const opportunity = event.row || event;
    navigate(`${OPPORTUNITY_CONSTANTS.ROUTES.OPPORTUNITY_DETAIL}/${opportunity._id}`, {
      state: { record: { item: opportunity } }
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
        `${OPPORTUNITY_CONSTANTS.ROUTES.DELETE_OPPORTUNITY}/${recordId}`,
        {}
      );

      if (response.data) {
        await fetchDealRecords();
        return {
          success: true,
          message: OPPORTUNITY_CONSTANTS.SUCCESS_MESSAGES.DELETE_SINGLE,
        };
      }

      return {
        success: false,
        message: OPPORTUNITY_CONSTANTS.ERROR_MESSAGES.DELETE_SINGLE,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || OPPORTUNITY_CONSTANTS.ERROR_MESSAGES.DEFAULT,
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
        ? OPPORTUNITY_CONSTANTS.ERROR_MESSAGES.DELETE_MULTIPLE
        : OPPORTUNITY_CONSTANTS.SUCCESS_MESSAGES.DELETE_MULTIPLE,
    };
  };

  // Column configuration with conditional delete action
  const getTableColumns = () => {
    if (!permissions.delete) return OPPORTUNITY_TABLE_CONFIG.columns;

    return [
      ...OPPORTUNITY_TABLE_CONFIG.columns,
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
        title={OPPORTUNITY_CONSTANTS.TITLES.MAIN}
        subtitle={isMobile ? OPPORTUNITY_CONSTANTS.TITLES.MOBILE_SUBTITLE : OPPORTUNITY_CONSTANTS.TITLES.WEB_SUBTITLE}
        records={dealRecords}
        onCreateRecord={handleCreateOpportunity}
        onEditRecord={handleOpportunityDetail}
        onDeleteRecord={isMobile ? (permissions.delete ? handleDelete : null) : handleDelete}
        permissions={permissions}

        columnConfig={isMobile ? OPPORTUNITY_TABLE_CONFIG.mobileFields : getTableColumns()}
        isLoading={isLoading}
        isDeleteMode={isDeleteMode}
        selectedRecordIds={selectedIds}
        onToggleDeleteMode={setIsDeleteMode}
        onSelectRecords={setSelectedIds}
        ExcelDownload={ExcelDownload}
        importConfig={{
          objectName: OPPORTUNITY_CONSTANTS.OBJECT_NAME,
          isImport: true,
          callBack: fetchDealRecords,
        }}
      />
    </Box>
  );
};

export default Opportunities;