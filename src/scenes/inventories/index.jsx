import React, { useState, useEffect } from "react";
import { Box, Modal, IconButton, Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import ToastNotification from "../toast/ToastNotification";
import DeleteConfirmDialog from "../toast/DeleteConfirmDialog";
import { RequestServer } from "../api/HttpReq";
import { apiCheckPermission } from "../Auth/apiCheckPermission";
import { getLoginUserRoleDept } from "../Auth/userRoleDept";
import SharedDataGrid from "../../components/SharedDataGrid";
import {
  gridPageCountSelector,
  gridPageSelector,
  useGridApiContext,
  useGridSelector,
} from "@mui/x-data-grid";
import { Pagination } from "@mui/material";
import ExcelDownload from "../Excel";
import SharedDataGridSkeleton from "../../components/Skeletons/SharedDataGridSkeleton";

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

const Inventories = () => {
  const OBJECT_API = "Inventory";
  const urlDelete = `/deleteInventory`;
  const urlInventory = `/inventories`;

  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [fetchError, setFetchError] = useState();
  const [fetchLoading, setFetchLoading] = useState(true);
  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
  });
  const [showDelete, setShowDelete] = useState(false);
  const [selectedRecordIds, setSelectedRecordIds] = useState();
  const [selectedRecordDatas, setSelectedRecordDatas] = useState();
  const [permissionValues, setPermissionValues] = useState({});

  const userRoleDpt = getLoginUserRoleDept(OBJECT_API);

  useEffect(() => {
    fetchRecords();
    fetchPermissions();
  }, []);

  const fetchRecords = () => {
    RequestServer("get", urlInventory, {})
      .then((res) => {
        if (res.success) {
          setRecords(res.data);
          setFetchLoading(false);
          setFetchError(null);
        } else {
          setRecords([]);
          setFetchError(res.error.message);
          setFetchLoading(false);
        }
      })
      .catch((err) => {
        setFetchError(err.message);
        setFetchLoading(false);
      });
  };

  const fetchPermissions = () => {
    if (userRoleDpt) {
      apiCheckPermission(userRoleDpt)
        .then((res) => {
          setPermissionValues(res);
        })
        .catch((err) => {
          setPermissionValues({});
        });
    }
  };

  const handleAddRecord = () => {
    navigate("/new-inventories", { state: { record: {} } });
  };

  const handleOnCellClick = (e) => {
    const item = e.row;
    navigate(`/inventoryDetailPage/${item._id}`, {
      state: { record: { item } },
    });
  };

  const onHandleDelete = (e, row) => {
    e.stopPropagation();
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
      row.forEach((element) => {
        onebyoneDelete(element);
      });
    } else {
      onebyoneDelete(row._id);
    }
  };

  const onebyoneDelete = async (row) => {
    try {
      let res = await RequestServer("delete", `${urlDelete}/${row}`, {});
      if (res.success) {
        setNotify({
          isOpen: true,
          message: res.data,
          type: "success",
        });
        fetchRecords();
      } else {
        setNotify({
          isOpen: true,
          message: res.error.message,
          type: "error",
        });
      }
    } catch (error) {
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

  const columns = [
    {
      field: "projectname",
      headerName: "Project Name",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "propertyname",
      headerName: "Property Name",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "type",
      headerName: "Type",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "country",
      headerName: "Country",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "status",
      headerName: "Status",
      headerAlign: "center",
      align: "center",
      flex: 1,
      cellClassName: (params) => {
        const statusClassName =
          params.row.status === "Available"
            ? "inventory-status-avail-green"
            : params.row.status === "Booked"
            ? "inventory-status-booked-pink"
            : params.row.status === "Sold"
            ? "inventory-status-sold-red"
            : params.row.status === "Processed"
            ? "inventory-status-process-yellow"
            : "";
        return statusClassName;
      },
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
        return !showDelete ? (
          <IconButton
            onClick={(e) => onHandleDelete(e, params.row)}
            style={{ padding: "20px", color: "#FF3333" }}
          >
            <DeleteIcon />
          </IconButton>
        ) : null;
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
              title="Inventories"
              subtitle="List Of Inventories"
              records={records}
              columns={columns}
              loading={fetchLoading}
              showDelete={showDelete}
              permissionValues={permissionValues}
              selectedRecordIds={selectedRecordIds}
              handleImportModalOpen={null}
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
    </>
  );
};

export default Inventories;
