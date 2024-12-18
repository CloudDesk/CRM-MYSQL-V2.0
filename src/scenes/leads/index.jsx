import React, { useState, useEffect } from "react";
import { useTheme, Box, IconButton, Modal, useMediaQuery } from "@mui/material";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import ModalFileUpload from "../dataLoader/ModalFileUpload";
import ExcelDownload from "../Excel";
import { RequestServer } from "../api/HttpReq";
import "../recordDetailPage/Form.css";
import "../indexCSS/muiBoxStyles.css";
import { apiCheckPermission } from "../Auth/apiCheckPermission";
import { getLoginUserRoleDept } from "../Auth/userRoleDept";
import SharedDataGridSkeleton from "../../components/Skeletons/SharedDataGridSkeleton";
import SharedDataGrid from "../../components/SharedDataGrid";
import MobileListView from "../../components/common/MobileListView";
import WebListView from "../../components/common/WebListView";
import NoAccessPage from "../../components/NoAccessPage";

const Leads = () => {
  const OBJECT_API = "Enquiry";
  const urlLead = `/leads`;
  const urlDelete = `/deleteLead`;

  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [records, setRecords] = useState([]);
  const [fetchError, setFetchError] = useState();
  const [fetchLoading, setFetchLoading] = useState(true);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedRecordIds, setSelectedRecordIds] = useState([]);
  const [selectedRecordDatas, setSelectedRecordDatas] = useState([]);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [permissionValues, setPermissionValues] = useState({});

  const userRoleDpt = getLoginUserRoleDept(OBJECT_API);

  const mobileFields = [
    { label: "Enquiry Name", key: "fullname" },
    { label: "Lead Source", key: "leadsource" },
    { label: "Lead Status", key: "leadstatus" },
    { label: "Email", key: "email" },
  ];

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

  useEffect(() => {
    fetchRecords();
    fetchPermissions();
  }, []);

  const fetchRecords = () => {
    RequestServer("get", urlLead, {})
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
    navigate("/new-leads", { state: { record: {} } });
  };

  const handleOnCellClick = (e) => {
    console.log("selected record", e);
    const item = e.row ? e.row : e;
    navigate(`/leadDetailPage/${item._id}`, { state: { record: { item } } });
  };

  const onHandleDelete = async (e, rowId) => {
    e.stopPropagation();
    console.log("row onHandleDelete", rowId);
    try {
      const res = await RequestServer("delete", `${urlDelete}/${rowId}`, {});
      console.log(res.data, "res onHandleDelete");
      if (res.data) {
        fetchRecords();
        return {
          success: true,
          message: "Record deleted successfully",
        };
      } else {
        return {
          success: false,
          message: res.error?.message || "Failed to delete record",
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.message || "Error deleting record",
      };
    }
  };

  const handleImportModalOpen = () => {
    setImportModalOpen(true);
  };

  const handleImportModalClose = () => {
    setImportModalOpen(false);
    fetchRecords();
  };

  if (permissionValues.delete) {
    columns.push({
      field: "actions",
      headerName: "Actions",
      headerAlign: "center",
      align: "center",
      width: 400,
      flex: 1,
      renderCell: (params) => (
        <>
          {!showDelete && (
            <IconButton
              onClick={(e) => onHandleDelete(e, params.row._id)}
              style={{ padding: "20px", color: "#FF3333" }}
            >
              <DeleteIcon />
            </IconButton>
          )}
        </>
      ),
    });
  }

  return (
    <>
      {fetchLoading ? (
        <SharedDataGridSkeleton />
      ) : (
        <Box>
          {permissionValues.read ? (
            isMobile ? (
              <MobileListView
                title="Enquiries"
                subtitle="List of Enquiries"
                records={records}
                fields={mobileFields}
                onAdd={handleAddRecord}
                onEdit={handleOnCellClick}
                onDelete={permissionValues.delete ? onHandleDelete : null}
              />
            ) : (
              <WebListView
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
                ExcelDownload={ExcelDownload}
              />
            )
          ) : (
            <NoAccessPage />
          )}
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
    </>
  );
};

export default Leads;
