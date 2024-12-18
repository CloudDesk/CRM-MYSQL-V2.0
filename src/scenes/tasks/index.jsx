import React, { useState, useEffect } from "react";
import { Box, Modal, IconButton, Tooltip, Pagination } from "@mui/material";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import ToastNotification from "../toast/ToastNotification";
import DeleteConfirmDialog from "../toast/DeleteConfirmDialog";
import { RequestServer } from "../api/HttpReq";
import { apiCheckPermission } from "../Auth/apiCheckPermission";
import { getLoginUserRoleDept } from "../Auth/userRoleDept";
import SharedDataGrid from "../../components/SharedDataGrid";
import {
  DataGrid,
  GridToolbar,
  gridPageCountSelector,
  gridPageSelector,
  useGridApiContext,
  useGridSelector,
} from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { useTheme } from "@mui/material";
import { Button } from "@mui/material";
import ExcelDownload from "../Excel";
import { getPermissions } from "../Auth/getPermission";
import NoAccess from "../NoAccess/NoAccess";
import "../indexCSS/muiBoxStyles.css";
import SharedDataGridSkeleton from "../../components/Skeletons/SharedDataGridSkeleton";

const Task = () => {
  const OBJECT_API = "Event";
  const urlTask = `/Task`;
  const urlDelete = `/deleteTask`;

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchError, setFetchError] = useState();
  // notification
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
  const [permissionValues, setPermissionValues] = useState({});

  const userRoleDpt = getLoginUserRoleDept(OBJECT_API);
  console.log(userRoleDpt, "userRoleDpt");

  useEffect(() => {
    fetchRecords();
    fetchPermissions();
  }, []);

  const fetchRecords = () => {
    RequestServer("get", urlTask, {})
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
      .catch((err) => {
        setFetchError(err.message);
        setFetchLoading(false);
      });
  };

  const fetchPermissions = () => {
    if (userRoleDpt) {
      apiCheckPermission(userRoleDpt)
        .then((res) => {
          console.log(res, "res");
          setPermissionValues(res);
        })
        .catch((error) => {
          setPermissionValues({});
        });
    }
    // const getPermission = getPermissions("Task")
    // setPermissionValues(getPermission)
  };

  const handleAddRecord = () => {
    navigate("/new-task", { state: { record: {} } });
  };

  const handleOnCellClick = (e) => {
    console.log("selected record", e);
    const item = e.row;
    navigate(`/taskDetailPage/${item._id}`, { state: { record: { item } } });
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
      field: "subject",
      headerName: "Subject",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "realatedTo",
      headerName: "Realated To",
      headerAlign: "center",
      align: "center",
      flex: 1,
      renderCell: (params) => {
        console.log(params.row, "params.row");
        if (params.row?.object === "Account") {
          return <div className="rowitem">{params.row?.accountname}</div>;
        } else if (params.row?.object === "Enquiry") {
          return <div className="rowitem">{params.row?.leadname}</div>;
        } else if (params.row.object === "Deals") {
          return <div className="rowitem">{params.row?.opportunityname}</div>;
        } else {
          <div className="rowitem">{null}</div>;
        }
      },
    },
    {
      field: "object",
      headerName: "Object",
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
      width: 400,
      flex: 1,
      renderCell: (params) => {
        return (
          <>
            {!showDelete ? (
              <>
                {/* <IconButton style={{ padding: '20px', color: '#0080FF' }}>
                    <EditIcon onClick={(e) => handleOnCellClick(e, params.row)} />
                  </IconButton> */}
                <IconButton style={{ padding: "20px", color: "#FF3333" }}>
                  <DeleteIcon onClick={(e) => onHandleDelete(e, params.row)} />
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
              title="Tasks"
              subtitle="List Of Tasks"
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
export default Task;
