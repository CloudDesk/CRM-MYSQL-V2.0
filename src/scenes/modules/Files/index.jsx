import React, { useState, useEffect } from "react";
import {
  Box, Button, useTheme, IconButton, Pagination,
  Tooltip, Modal, Typography,
} from "@mui/material";
import {
  DataGrid, gridPageCountSelector,
  gridPageSelector, useGridApiContext, useGridSelector,
} from "@mui/x-data-grid";
import { tokens } from "../../../theme";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import ToastNotification from "../../../components/UI/toast/ToastNotification";
import DeleteConfirmDialog from "../toast/DeleteConfirmDialog";
import { RequestServer } from "../../api/HttpReq";
import { getUserRoleAndDepartment } from "../../../utils/sessionUtils";
import CircularProgress from '@mui/material/CircularProgress';
import ModalFileUpload from "./ModalNewFile";
import './FileModal.css'
import '../recordDetailPage/Form.css'
import { appConfig } from "../../../config/appConfig";
import { useCheckPermission } from "../../hooks/useCheckPermission";
const Files = () => {

  const OBJECT_API = 'File'
  const URL_getRecords = '/files'
  const URL_deleteRecords = `/deletefiles/`

  const CONSTANTS = {
    OBJECT_API: appConfig.api.files.apiName,
    get: appConfig.api.files.base,
    delete: appConfig.api.files.delete
  }


  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [fetchError, setFetchError] = useState();
  const [fetchRecordsLoading, setFetchRecordsLoading] = useState(true);
  const [fetchPermissionloading, setFetchPermissionLoading] = useState(true);

  const [selectedRecordDatas, setSelectedRecordDatas] = useState();
  const [selectedRecordIds, setSelectedRecordIds] = useState();


  const [showEmail, setShowEmail] = useState()
  const [notify, setNotify] = useState({ isOpen: false, message: "", type: "", });
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: "", subTitle: "", });



  const [modalFileUpload, setModalFileUpload] = useState(false)
  const userRoleDept = getUserRoleAndDepartment(CONSTANTS.OBJECT_API)
  console.log(userRoleDept, "userRoleDpt")
  // Use the custom permission hook
  const { permissions } = useCheckPermission({
    role: userRoleDept?.role,
    object: userRoleDept?.object,
    departmentname: userRoleDept?.departmentname
  });
  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    setFetchRecordsLoading(true)
    await RequestServer("get", CONSTANTS.get, {})
      .then((res) => {
        console.log(res, "index page res");
        if (res.success) {
          setRecords(res.data);
          setFetchError(null);
        } else {
          setRecords([]);
          setFetchError(res.error.message);
        }
      })
      .catch((err) => {
        setFetchError(err.message);
      })
      .finally(() => {
        setFetchRecordsLoading(false)
      })
  };

  const handleAddRecord = () => {
    setModalFileUpload(true)
  };


  const handleRowClick = (e) => {
    console.log(e.row.fileUrl, "handleRowClick")
    window.open(e.row.fileUrl, "_blank");
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
      row.forEach((element) => {
        onebyoneDelete(element);
      });
    } else {
      onebyoneDelete(row._id);
    }
  };

  const onebyoneDelete = (row) => {
    console.log("one by on delete", row);

    RequestServer("delete", `${CONSTANTS.delete}/${row}`, {})
      .then((res) => {
        console.log(res, "delete")
        if (res.success) {
          fetchRecords();
          setNotify({
            isOpen: true,
            message: res.data,
            type: "success",
          });
        } else {
          console.log(res, "error in then");
          setNotify({
            isOpen: true,
            message: res.error.message,
            type: "error",
          });
        }
      })
      .catch((error) => {
        console.log("api delete error", error);
        setNotify({
          isOpen: true,
          message: error.message,
          type: "error",
        });
      })
      .finally(() => {
        setConfirmDialog({
          ...confirmDialog,
          isOpen: false,
        });
      });
  };

  const handleFileModalClose = () => {
    setModalFileUpload(false)
    fetchRecords()
  }

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
      field: "fileName",
      headerName: "File Name",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "mimetype",
      headerName: "File Type",
      headerAlign: "center",
      align: "center",
      flex: 1,
    }
  ]
  if (permissions.delete) {
    columns.push(
      {
        field: "actions",
        headerName: "Actions",
        headerAlign: "center",
        align: "center",
        flex: 1,
        width: 400,
        renderCell: (params) => {
          return (
            <>
              {!showEmail ? (
                <>
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
      },
    )
  }

  return (
    <>
      <ToastNotification notify={notify} setNotify={setNotify} />
      <DeleteConfirmDialog
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
      />

      <Box m="20px">
        {fetchPermissionloading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="200px"
          >
            <CircularProgress />
          </Box>
        ) : (
          permissions.read && (
            <>

              <Typography
                variant="h2"
                color={colors.grey[100]}
                fontWeight="bold"
                sx={{ m: "0 0 5px 0" }}
              >
                {CONSTANTS.OBJECT_API}
              </Typography>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="h5" color={colors.greenAccent[400]}>
                  List Of {CONSTANTS.OBJECT_API}
                </Typography>

                <div
                  style={{
                    display: "flex",
                    width: "200px",
                    justifyContent: "space-evenly",
                    height: "30px",
                  }}
                >
                  {showEmail ? (
                    <>
                      <div
                        style={{
                          width: "180px",
                          display: "flex",
                          justifyContent: "flex-end",
                          gap: "15px",
                        }}
                      >
                        {
                          permissions.delete &&
                          <Tooltip title="Delete Selected">
                            <IconButton>
                              <DeleteIcon
                                sx={{ color: "#FF3333" }}
                                onClick={(e) => onHandleDelete(e, selectedRecordIds)}
                              />
                            </IconButton>
                          </Tooltip>
                        }
                      </div>
                    </>
                  ) : (
                    <>
                      {
                        permissions.create &&
                        <>
                          <Button
                            variant="contained" color="info"
                            onClick={handleAddRecord}
                          >
                            Upload File
                          </Button>
                        </>
                      }
                    </>
                  )}
                </div>
              </Box>
              <Box m="15px 0 0 0" height="380px" className="my-mui-styles">
                <DataGrid
                  sx={{
                    boxShadow:
                      "rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px",
                  }}
                  rows={records}
                  columns={columns}
                  getRowId={(row) => row._id}
                  pageSize={7}
                  rowsPerPageOptions={[7]}
                  components={{
                    // Toolbar: GridToolbar,
                    Pagination: CustomPagination,
                  }}
                  loading={fetchRecordsLoading}
                  getRowClassName={(params) =>
                    params.indexRelativeToCurrentPage % 2 === 0
                      ? "C-MuiDataGrid-row-even"
                      : "C-MuiDataGrid-row-odd"
                  }
                  checkboxSelection
                  disableSelectionOnClick
                  onSelectionModelChange={(ids) => {
                    var size = Object.keys(ids).length;
                    size > 0 ? setShowEmail(true) : setShowEmail(false);
                    console.log("checkbox selection ids", ids);
                    setSelectedRecordIds(ids);
                    const selectedIDs = new Set(ids);
                    const selectedRowRecords = records.filter((row) =>
                      selectedIDs.has(row._id.toString())
                    );
                    setSelectedRecordDatas(selectedRowRecords);
                    console.log("selectedRowRecords", selectedRowRecords);
                  }}
                  onRowClick={(e) => handleRowClick(e)}
                />
              </Box>
              <Modal
                open={modalFileUpload}
                onClose={handleFileModalClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                sx={{ backdropFilter: "blur(1px)" }}
              >
                <div className="related-modal-box">
                  <ModalFileUpload handleModal={handleFileModalClose} />
                </div>
              </Modal>

            </>
          ))}
      </Box>

    </>
  );
};

export default Files;
