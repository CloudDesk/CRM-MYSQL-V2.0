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

// Constants
const CONSTANTS = {
  OBJECT_NAME: appConfig.objects.opportunity.apiName,
  ROUTES: {
    OPPORTUNITIES: appConfig.objects.opportunity.base || '/opportunities',
    DELETE_OPPORTUNITY: appConfig.objects.opportunity.delete || '/deleteOpportunity',
    NEW_OPPORTUNITY: appConfig.objects.opportunity.new || '/new-opportunities',
    OPPORTUNITY_DETAIL: appConfig.objects.opportunity.detail || '/opportunityDetailPage',
  },
  TITLES: {
    MAIN: appConfig.objects.opportunity.apiName,
    WEB_SUBTITLE: `List Of ${appConfig.objects.opportunity.name.plural} `,
    MOBILE_SUBTITLE: `List Of ${appConfig.objects.opportunity.name.plural} `,
  },
  ERROR_MESSAGES: {
    DELETE_MULTIPLE: 'Some dealRecords failed to delete',
    DELETE_SINGLE: 'Failed to delete record',
    DEFAULT: 'An error occurred',
  },
  SUCCESS_MESSAGES: {
    DELETE_MULTIPLE: 'All dealRecords deleted successfully',
    DELETE_SINGLE: 'Record deleted successfully',
  },
};

// Table configuration
const TABLE_CONFIG = {
  mobileFields: [
    {
      key: "opportunityname",
      label: "Deal Name"
    },
    {
      key: "propertyname",
      label: "Inventory Name"
    },
    {
      key: "type",
      label: "Type"
    },
    {
      key: "stage",
      label: "Stage"
    }
  ],
  columns: [
    {
      field: "opportunityname",
      headerName: "Deal Name",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "propertyname",
      headerName: "Inventory Name",
      headerAlign: "center",
      align: "center",
      flex: 1,
      renderCell: (params) => {
        if (params.row.inventoryname) {
          return (
            <div className="rowitem">
              {params.row.inventoryname.startsWith("{")
                ? JSON.parse(params.row.inventoryname).label
                : params.row.inventoryname || ""}
            </div>
          );
        } else {
          return <div className="rowitem">{null}</div>;
        }
      },
    },
    {
      field: "type",
      headerName: "Type",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "amount",
      headerName: "Opportunity Amount",
      headerAlign: "center",
      align: "center",
      flex: 1,
      renderCell: (params) => {
        const formatCurrency = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "INR",
        });
        return formatCurrency.format(params.row.amount);
      },
    },
    {
      field: "stage",
      headerName: "Stage",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
  ],
};

/**
 * Opportunities Component
 * Manages the display and interactions for deals/opportunities in both mobile and desktop views
 */
const Opportunities = () => {
  // Hooks
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const userRoleDept = getLoginUserRoleDept(CONSTANTS.OBJECT_NAME);

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
      const response = await RequestServer("get", CONSTANTS.ROUTES.OPPORTUNITIES, {});
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
    navigate(CONSTANTS.ROUTES.NEW_OPPORTUNITY, { state: { record: {} } });
  };

  const handleOpportunityDetail = (event) => {
    const opportunity = event.row || event;
    navigate(`${CONSTANTS.ROUTES.OPPORTUNITY_DETAIL}/${opportunity._id}`, {
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
        `${CONSTANTS.ROUTES.DELETE_OPPORTUNITY}/${recordId}`,
        {}
      );

      if (response.data) {
        await fetchDealRecords();
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
        records={dealRecords}
        onCreateRecord={handleCreateOpportunity}
        onEditRecord={handleOpportunityDetail}
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
          callBack: fetchDealRecords,
        }}
      />
    </Box>
  );
};

export default Opportunities;