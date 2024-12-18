import React, { useState, useEffect } from 'react';
import {
  Box, Button, useTheme, Card, CardContent, IconButton,
  Pagination, Tooltip, Grid, MenuItem, Menu
} from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
// import axios from 'axios';
import { RequestServer } from '../api/HttpReq';
import { useNavigate } from "react-router-dom";
import ToastNotification from '../toast/ToastNotification';
import DeleteConfirmDialog from '../toast/DeleteConfirmDialog';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Loader from '../../components/Loader';
import MobileListView from '../../components/common/MobileListView';

const TaskMobile = () => {

  const urlDelete = `/deleteTask`;
  const urlTask = `/Task`;
  const fields = [
    { label: "Subject", key: "subject" },
    { label: "Object", key: "object" },
    {
      label: "RelatedTo", key: "relatedto",
      render: (value, record) => {
        if (record.object === "Account") {
          return record.accountname;
        } else if (record.object === "Enquiry") {
          return record.leadname;
        } else if (record.object === "Deals") {
          return record.opportunityname;
        } else {
          return "---";
        }
      }
    },
    { label: "Description", key: "description" },
  ];

  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchError, setFetchError] = useState()

  useEffect(() => {
    fetchRecords();
  }, []);


  const fetchRecords = () => {
    console.log('urlTask', urlTask);
    RequestServer("get", urlTask, {})
      .then(
        (res) => {
          console.log("res task records", res);
          if (res.success) {
            setRecords(res.data);
            setFetchLoading(false)

          }
          else {
            setRecords([]);
            setFetchLoading(false)
          }
        }
      )
      .catch((error) => {
        console.log('res task error', error);
        setFetchLoading(false)
      })
  }
  const handleAddRecord = () => {
    navigate("/taskDetailPage", { state: { record: {} } })
  };

  const handleEditRecord = (row) => {
    console.log('selected record', row);
    const item = row;
    navigate("/taskDetailPage", { state: { record: { item } } })
  };


  const handleDelete = async (rowId) => {
    try {
      let res = await RequestServer("delete", `${urlDelete}/${rowId}`, {})
      if (res.success) {
        console.log("api delete response", res);
        fetchRecords()
        return {
          success: true,
          message: "Record deleted successfully"
        };
      } else {
        console.log("api delete error", res);
        return {
          success: false,
          message: res.error?.message || "Failed to delete record"
        };
      }
    } catch (error) {
      console.log("api delete error", error);
      return {
        success: false,
        message: error.message || "Error deleting record"
      };
    }

  };


  return (
    <>

      {
        fetchLoading ? <Loader /> :
          <MobileListView
            title="Events"
            subtitle="List of Events"
            records={records}
            fields={fields}
            onAdd={handleAddRecord}
            onEdit={handleEditRecord}
            onDelete={handleDelete}
          />
      }
    </>
  )
}
export default TaskMobile;
