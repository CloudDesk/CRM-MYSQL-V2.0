import React, { useState, useEffect } from "react";
import {
  useTheme,
  Box,
  Button,
  IconButton,
  Pagination,
  Tooltip,
  Grid,
  Modal,
  Typography,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
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
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import EmailIcon from "@mui/icons-material/Email";
import EmailModalPage from "../recordDetailPage/EmailModalPage";
import WhatAppModalPage from "../recordDetailPage/WhatsAppModalPage";
import ExcelDownload from "../Excel";
import { RequestServer } from "../api/HttpReq";
import "../recordDetailPage/Form.css";
import { LeadMonthPicklist } from "../../data/pickLists";
import { getPermissions } from "../Auth/getPermission";
import NoAccess from "../NoAccess/NoAccess";
import "../indexCSS/muiBoxStyles.css";
import { apiCheckPermission } from "../Auth/apiCheckPermission";
import { getLoginUserRoleDept } from "../Auth/userRoleDept";
import SharedDataGrid from "../../components/SharedDataGrid";
import DataGridSkeleton from "../../components/Skeletons/DataGridSkeleton";
import Loader from "../../components/Loader";
import SharedDataGridSkeleton from "../../components/Skeletons/SharedDataGridSkeleton";

const Leads = () => {
  const OBJECT_API = "Enquiry";
  const urlLead = `/leads`;
  const urlSearchLead = `/leads?`;
  const urlDelete = `/deleteLead`;

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [filteredRecord, setFilteredRecord] = useState([]);
  const [fetchError, setFetchError] = useState();
  const [fetchLoading, setFetchLoading] = useState(true);
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

  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [whatsAppModalOpen, setWhatsAppModalOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);

  const [filterMonth, setFilterMonth] = useState();
  const [permissionValues, setPermissionValues] = useState({});

  const userRoleDpt = getLoginUserRoleDept(OBJECT_API);
  console.log(userRoleDpt, "userRoleDpt");

  useEffect(() => {
    fetchRecords();
    fetchPermissions();
  }, []);

  const fetchRecords = () => {
    RequestServer("get", urlLead, {})
      .then((res) => {
        console.log(res.data, "index page res");
        if (res.success) {
          setRecords(res.data);
          setFilteredRecord(res.data);
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
    console.log("fetchPermissions");
    if (userRoleDpt) {
      let url = apiCheckPermission(userRoleDpt)
        .then((res) => {
          setPermissionValues(res);
        })
        .catch((err) => {
          setPermissionValues({});
        });
    }
    // const getPermission=getPermissions("Lead")
    // setPermissionValues(getPermission)
  };

  const handleAddRecord = () => {
    navigate("/new-leads", { state: { record: {} } });
  };

  const handleOnCellClick = (e) => {
    console.log("selected record", e);
    const item = e.row;
    navigate(`/leadDetailPage/${item._id}`, { state: { record: { item } } });
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

  const handlesendEmail = () => {
    console.log("inside email");
    console.log("selectedRecordIds", selectedRecordIds);
    setEmailModalOpen(true);
  };

  const setEmailModalClose = () => {
    setEmailModalOpen(false);
  };

  const handlesendWhatsapp = () => {
    console.log("inside whats app");
    console.log("selectedRecordIds", selectedRecordIds);
    setWhatsAppModalOpen(true);
  };

  const setWhatAppModalClose = () => {
    setWhatsAppModalOpen(false);
  };

  const handleLeadFilterChange = (e) => {
    const value = e.target.value;
    const label = e.target.name;
    console.log(`${urlSearchLead}${label}=${value}`);
    if (e.target.value === null) {
      fetchRecords();
    } else {
      RequestServer(`${urlSearchLead}${label}=${value}`)
        .then((res) => {
          console.log("Searched Month ", res);
          if (res.success) {
            setFilteredRecord(res.data);
          }
        })
        .catch((err) => {
          console.log("Search Error is ", err);
        });
    }
  };
  const columns = [
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
                {/* <IconButton  onClick={(e) => handleOnCellClick(e, params.row)} style={{ padding: '20px', color: '#0080FF' }}>
                    <EditIcon />
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
              title="Enquiry"
              subtitle="List Of Enquiries"
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
            object="Enquiry"
            handleModal={handleImportModalClose}
          />
        </div>
      </Modal>

      <Modal
        open={emailModalOpen}
        onClose={setEmailModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="modal">
          <EmailModalPage
            data={selectedRecordDatas}
            handleModal={setEmailModalClose}
            bulkMail={true}
          />
        </div>
      </Modal>

      <Modal
        open={whatsAppModalOpen}
        onClose={setWhatAppModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="modal">
          <WhatAppModalPage
            data={selectedRecordDatas}
            handleModal={setWhatAppModalClose}
            bulkMail={true}
          />
        </div>
      </Modal>
    </>
  );
};

export default Leads;
