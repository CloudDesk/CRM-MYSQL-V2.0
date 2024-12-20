import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  useTheme,
  IconButton,
  Pagination,
  Tooltip,
  Typography,
  Grid,
  Modal,
} from "@mui/material";
import {
  DataGrid,
  GridToolbar,
  gridPageCountSelector,
  gridPageSelector,
  useGridApiContext,
  useGridSelector,
} from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ToastNotification from "../toast/ToastNotification";
import DeleteConfirmDialog from "../toast/DeleteConfirmDialog";
import ModalFileUpload from "../dataLoader/ModalFileUpload";
import { OppIndexFilterPicklist } from "../../data/pickLists";
import ExcelDownload from "../Excel";
import { RequestServer } from "../api/HttpReq";
import { getPermissions } from "../Auth/getPermission";
import NoAccess from "../NoAccess/NoAccess";
import "../indexCSS/muiBoxStyles.css";
import { apiCheckPermission } from "../Auth/apiCheckPermission";
import { getLoginUserRoleDept } from "../Auth/userRoleDept";
import SharedDataGrid from "../../components/SharedDataGrid";
import SharedDataGridSkeleton from "../../components/Skeletons/SharedDataGridSkeleton";

const Opportunities = () => {
  const OBJECT_API = "Deals";
  const urlOpportunity = `/opportunities`;
  const urlDelete = `/deleteOpportunity`;

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchError, setFetchError] = useState();
  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });
  //dialog
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
  });

  const [showDelete, setShowDelete] = useState(false);
  const [selectedRecordIds, setSelectedRecordIds] = useState();
  const [selectedRecordDatas, setSelectedRecordDatas] = useState();

  const [importModalOpen, setImportModalOpen] = useState(false);
  const [filterOpportunity, setFilterOpportunity] = useState("All");
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [permissionValues, setPermissionValues] = useState({});

  const userRoleDpt = getLoginUserRoleDept(OBJECT_API);
  console.log(userRoleDpt, "userRoleDpt");

  useEffect(() => {
    fetchRecords();
    fetchPermissions();
  }, []);

  const fetchRecords = () => {
    RequestServer("get", urlOpportunity, {})
      .then((res) => {
        console.log(res, "index page res");
        if (res.success) {
          setRecords(res.data);
          setFetchError(null);
          setFetchLoading(false);
        } else {
          setRecords([]);
          setFetchError(res.error.message);
          setFetchLoading(false);
        }
      })
      .catch((error) => {
        setFetchError(error.message);
        setFetchLoading(false);
      });
  };

  const fetchPermissions = () => {
    if (userRoleDpt) {
      apiCheckPermission(userRoleDpt)
        .then((res) => {
          setPermissionValues(res);
        })
        .catch((error) => {
          setPermissionValues({});
        });
    }
    // filterRecords();
    // const getPermission=getPermissions("Opportunity")
    // setPermissionValues(getPermission)
  };

  const handleAddRecord = () => {
    navigate("/new-opportunities", { state: { record: {} } });
  };

  const handleOnCellClick = (e) => {
    console.log("selected record", e);
    const item = e.row;
    navigate(`/opportunityDetailPage/${item._id}`, {
      state: { record: { item } },
    });
  };

  const onHandleDelete = (e, row) => {
    e.stopPropagation();
    console.log("req delete rec", row);
    setConfirmDialog({
      isOpen: true,
      title: `Are you sure to delete this Record ?`,
      subTitle: "You can't undo this Operation",
      onConfirm: () => {
        onConfirmDeleteRecord(row);
      },
    });
  };
  const onConfirmDeleteRecord = (row) => {
    if (row.length) {
      console.log("if row", row);
      row.forEach((element) => {
        onebyoneDelete(element);
      });
    } else {
      console.log("else", row._id);
      onebyoneDelete(row._id);
    }
  };
  const onebyoneDelete = async (row) => {
    console.log("onebyoneDelete rec id", row);
    try {
      let res = await RequestServer("delete", `${urlDelete}/${row}`, {});
      if (res.success) {
        console.log("api delete response", res);
        setNotify({
          isOpen: true,
          message: res.data,
          type: "success",
        });
        fetchRecords();
      } else {
        console.log("api delete error", res);
        setNotify({
          isOpen: true,
          message: res.error.message,
          type: "error",
        });
      }
    } catch (error) {
      console.log("api delete error", error);
      setNotify({
        isOpen: true,
        message: error.message,
        type: "error",
      });
    } finally {
      setConfirmDialog({
        ...confirmDialog,
        isOpen: false,
      });
    }
  };

  const handleImportModalOpen = () => {
    setImportModalOpen(true);
  };
  const handleImportModalClose = () => {
    setImportModalOpen(false);
    fetchRecords();
  };

  function CustomPagination() {
    const apiRef = useGridApiContext();
    const page = useGridSelector(apiRef, gridPageSelector);
    const pageCount = useGridSelector(apiRef, gridPageCountSelector);

    return (
      <Pagination
        color="primary"
        count={pageCount}
        page={page + 1}
        onChange={(event, value) => apiRef.current.setPage(value - 1)}
      />
    );
  }

  const columns = [
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
        return <>{formatCurrency.format(params.row.amount)}</>;
      },
    },
    {
      field: "stage",
      headerName: "Stage",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
  ];
  if (permissionValues.delete) {
    columns.push({
      field: "actions",
      headerName: "Actions",
      headerAlign: "center",
      align: "center",
      flex: 1,
      width: 400,
      renderCell: (params) => {
        return (
          <>
            {!showDelete ? (
              <>
                {/* <IconButton onClick={(e) => handleOnCellClick(e, params.row)} style={{ padding: '20px', color: '#0080FF' }}>
                    <EditIcon  />
                  </IconButton> */}
                <IconButton
                  onClick={(e) => onHandleDelete(e, params.row)}
                  style={{ padding: "20px", color: "#FF3333" }}
                >
                  <DeleteIcon />
                </IconButton>
              </>
            ) : (
              ""
            )}
          </>
        );
      },
    });
  }

  return (
    <>
      <ToastNotification notify={notify} setNotify={setNotify} />
      <DeleteConfirmDialog
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
      />
      {fetchLoading ? (
        <SharedDataGridSkeleton />
      ) : (
        <Box>
          {permissionValues.read ? (
            <SharedDataGrid
              title="Deal"
              subtitle="List Of Deals"
              records={records}
              columns={columns}
              loading={fetchLoading}
              showDelete={showDelete}
              permissionValues={permissionValues}
              selectedRecordIds={selectedRecordIds}
              handleImportModalOpen={handleImportModalOpen}
              handleAddRecord={handleAddRecord}
              handleDelete={onHandleDelete}
              setShowDelete={setShowDelete}
              setSelectedRecordIds={setSelectedRecordIds}
              setSelectedRecordDatas={setSelectedRecordDatas}
              handleOnCellClick={handleOnCellClick}
              CustomPagination={CustomPagination}
              ExcelDownload={ExcelDownload}
            />
          ) : null}
        </Box>
      )}
      <Modal
        open={importModalOpen}
        onClose={handleImportModalClose}
        sx={{
          backdropFilter: "blur(1px)",
          "& .modal": {
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: 24,
            p: 4,
          },
        }}
      >
        <div className="modal">
          <ModalFileUpload
            object="Deals"
            handleModal={handleImportModalClose}
          />
        </div>
      </Modal>
    </>
  );
};
export default Opportunities;
