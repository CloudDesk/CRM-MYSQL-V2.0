import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Typography,
  Accordion,
  AccordionSummary,
  Modal,
  AccordionDetails,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  OBJECT_API_EVENT,
  GET_FILE,
  DELETE_FILE,
  GET_EVENT_RELATED_FILE,
} from "../api/endUrls";
import ModalTaskFileUpload from "../Files/ModalTaskRelatedFile";
import { RequestServer } from "../api/HttpReq";
import { apiMethods } from "../api/methods";
import FilePresentIcon from "@mui/icons-material/FilePresent";
import DeleteIcon from "@mui/icons-material/Delete";
import ToastNotification from "../toast/ToastNotification";
import DeleteConfirmDialog from "../toast/DeleteConfirmDialog";
import "../recordDetailPage/Form.css";
import queryString from "query-string";

const TaskRelatedItems = ({ item }) => {
  const OBJECT_API = OBJECT_API_EVENT;
  const URL_getRelatedFiles = "files";
  const urlDelete = `/deletefiles`;

  const navigate = useNavigate();
  const location = useLocation();

  const [taskRecord, setTaskRecord] = useState();
  const [modalFileUpload, setModalFileUpload] = useState(false);
  const [records, setRecords] = useState([]);
  const [fetchError, setFetchError] = useState(true);
  const [fetchRecordsLoading, setFetchRecordsLoading] = useState(true);

  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
  });
  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });

  console.log(taskRecord, "taskRecord");
  useEffect(() => {
    console.log(" Task Related Item", location.state.record.item);
    if (location.state.record.item) {
      setTaskRecord({
        taskId: location.state.record.item._id,
        OBJECT_API: OBJECT_API,
      });
    }
    fetchRelatedFiles(location.state.record.item._id, OBJECT_API)
  }, []);

  const fetchRelatedFiles = (id, OBJECT_API) => {
    console.log("inside fetchRelatedFiles");
    let obj = { id: id, object: OBJECT_API };
    console.log(obj, "obj queryObj");
    let queryObj = queryString.stringify(obj);
    console.log(queryObj, "queryObj");
    RequestServer("get", `${URL_getRelatedFiles}?eventid=${id}`)
      .then((res) => {
        console.log(res, "index page res fetchRelatedFiles");
        if (res.success) {
          setRecords(res.data);
          setFetchError(null);
        } else {
          setRecords([]);
          setFetchError(res.error.message);
        }
      })
      .catch((err) => {
        console.log("fetchRelatedFiles");
        setFetchError(err.message);
      })
      .finally(() => {
        setFetchRecordsLoading(false);
      });
  };

  const handleAddRecord = () => {
    setModalFileUpload(true);
  };

  const handleFileModalClose = () => {
    setModalFileUpload(false);
    fetchRelatedFiles(taskRecord.taskId, OBJECT_API);
  };

  const handleViewFileClick = (item) => {
    console.log("handleViewFileClick", item);
    window.open(item.fileurl, "_blank");
  };
  const handleChartFileDelete = (e, recId) => {
    e.stopPropagation();
    console.log("inside handleReqContactCardDelete fn");
    setConfirmDialog({
      isOpen: true,
      title: `Are you sure to delete this Record ?`,
      subTitle: "You can't undo this Operation",
      onConfirm: () => {
        onConfirmContactCardDelete(recId);
      },
    });
  };

  const onConfirmContactCardDelete = async (recId) => {
    console.log("req delete rec recId", recId);

    try {
      let res = await RequestServer("delete", `${urlDelete}/${recId}`, {});
      if (res.success) {
        console.log("api delete response", res);
        setNotify({
          isOpen: true,
          message: res.data,
          type: "success",
        });
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

      fetchRelatedFiles(taskRecord.taskId, OBJECT_API);
    }
  };

  function bytesToKB(bytes) {
    return (bytes / 1024).toFixed(2) + "KB";
  }

  return (
    <>
      <ToastNotification notify={notify} setNotify={setNotify} />
      <DeleteConfirmDialog
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
      />

      <div style={{ textAlign: "center", marginBottom: "10px" }}>
        <h2> Related Items </h2>
      </div>

      <Accordion style={{ borderRadius: "10px" }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography variant="h4">
            Notes and Attachments ({records.length}){" "}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div style={{ textAlign: "end", marginBottom: "5px" }}>
            <Button variant="contained" color="info" onClick={handleAddRecord}>
              Upload File
            </Button>
          </div>
          <List
            sx={{
              width: "100%",
              maxWidth: 360,
              bgcolor: "background.paper",
              position: "relative",
              overflow: "auto",
              maxHeight: 300,
              "& ul": { padding: 0 },
            }}
          >
            {records &&
              records.map((item, index) => {

                const bytes = bytesToKB(item.size);
                return (
                  <ListItem sx={{ maxHeight: "200px", marginTop: "-10px" }}
                    key={item._id}>
                    {index + 1}

                    <ListItemButton
                      onClick={() => handleViewFileClick(item)}
                      title={`${item.fileName}`}
                    >
                      <ListItemIcon>
                        <FilePresentIcon />
                      </ListItemIcon>

                      <ListItemText
                        sx={{ wordBreak: "break-all" }}
                        primary={`${item.filename}`}
                        secondary={`${bytes}`}
                      ></ListItemText>
                    </ListItemButton>

                    <DeleteIcon
                      sx={{ cursor: "pointer" }}
                      onClick={(e) => handleChartFileDelete(e, item._id)}
                    />
                  </ListItem>
                );
              })}
          </List>
        </AccordionDetails>
      </Accordion>
      <Modal
        open={modalFileUpload}
        onClose={handleFileModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{ backdropFilter: "blur(1px)" }}
      >
        <div className="related-modal-box">
          <ModalTaskFileUpload
            record={taskRecord}
            handleModal={handleFileModalClose}
          />
        </div>
      </Modal>
    </>
  );
};
export default TaskRelatedItems;
