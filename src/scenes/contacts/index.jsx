import React, { useState, useEffect } from "react";
import { Box, Modal, IconButton, Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import ToastNotification from "../toast/ToastNotification";
import DeleteConfirmDialog from "../toast/DeleteConfirmDialog";
import EmailModalPage from "../recordDetailPage/EmailModalPage";
import WhatAppModalPage from "../recordDetailPage/WhatsAppModalPage";
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
import EmailIcon from "@mui/icons-material/Email";
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

const Contacts = () => {
  const OBJECT_API = "Contact";
  const urlContact = `/contacts`;
  const urlDelete = `/deleteContact`;

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
  const [showEmail, setShowEmail] = useState(false);
  const [selectedRecordIds, setSelectedRecordIds] = useState();
  const [selectedRecordDatas, setSelectedRecordDatas] = useState();
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [whatsAppModalOpen, setWhatsAppModalOpen] = useState(false);
  const [permissionValues, setPermissionValues] = useState({});

  const userRoleDpt = getLoginUserRoleDept(OBJECT_API);

  useEffect(() => {
    fetchRecords();
    fetchPermission();
  }, []);

  const fetchRecords = () => {
    RequestServer("get", urlContact, {})
      .then((res) => {
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

  const fetchPermission = () => {
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
    navigate("/new-contacts", { state: { record: {} } });
  };

  const handleOnCellClick = (e) => {
    const item = e.row;
    navigate(`/contactDetailPage/${item._id}`, { state: { record: { item } } });
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

  const handleEmailAction = () => {
    setEmailModalOpen(true);
  };

  const toolbarActions = showEmail ? (
    <>
      <Tooltip title="Email">
        <IconButton onClick={handleEmailAction}>
          <EmailIcon sx={{ color: "#DB4437" }} />
        </IconButton>
      </Tooltip>
    </>
  ) : null;

  const columns = [
    {
      field: "lastname",
      headerName: "Last Name",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "accountname",
      headerName: "Account Name",
      headerAlign: "center",
      align: "center",
      flex: 1,
      renderCell: (params) => {
        if (params.row.accountname) {
          return <div className="rowitem">{params.row.accountname}</div>;
        }
        return <div className="rowitem">{null}</div>;
      },
    },
    {
      field: "phone",
      headerName: "Phone",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "leadsource",
      headerName: "Lead Source",
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
      flex: 1,
      width: 400,
      renderCell: (params) => {
        return !showEmail ? (
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
              title="Contacts"
              subtitle="List Of Contacts"
              records={records}
              columns={columns}
              loading={fetchLoading}
              showDelete={showEmail}
              permissionValues={permissionValues}
              selectedRecordIds={selectedRecordIds}
              handleImportModalOpen={null}
              handleAddRecord={handleAddRecord}
              handleDelete={onHandleDelete}
              setShowDelete={setShowEmail}
              setSelectedRecordIds={setSelectedRecordIds}
              setSelectedRecordDatas={setSelectedRecordDatas}
              handleOnCellClick={handleOnCellClick}
              CustomPagination={CustomPagination}
              ExcelDownload={ExcelDownload}
              additionalToolbarActions={toolbarActions}
            />
          ) : null}
        </Box>
      )}

      <Modal
        open={emailModalOpen}
        onClose={() => setEmailModalOpen(false)}
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
          <EmailModalPage
            data={selectedRecordDatas}
            handleModal={() => setEmailModalOpen(false)}
            bulkMail={true}
          />
        </div>
      </Modal>

      <Modal
        open={whatsAppModalOpen}
        onClose={() => setWhatsAppModalOpen(false)}
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
          <WhatAppModalPage
            data={selectedRecordDatas}
            handleModal={() => setWhatsAppModalOpen(false)}
            bulkMail={true}
          />
        </div>
      </Modal>
    </>
  );
};

export default Contacts;
