import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { RequestServer } from '../api/HttpReq';
import Loader from '../../components/Loader';
import MobileListView from '../../components/common/MobileListView';

const UsersMobile = () => {
  const fields = [
    { label: "Name", key: "fullname" },
    { label: "Role", key: "roledetails" },
    { label: "Department", key: "departmentname" },
    { label: "Email", key: "email" },
    { label: "Phone", key: "phone" }
  ];

  const urlDelete = `/delete`;
  const urlUsers = `/Users`;

  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchError, setFetchError] = useState();

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = () => {
    RequestServer("get", urlUsers, {})
      .then((res) => {
        console.log(res, "index page res");
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

  const handleAddRecord = () => {
    navigate("/new-users", { state: { record: {} } });
  };

  const handleEditRecord = (row) => {
    console.log('selected record', row);
    const item = row;
    navigate(`/userDetailPage/${item._id}`, { state: { record: { item } } });
  };

  const handleDelete = async (rowId) => {
    try {
      let res = await RequestServer("delete", `${urlDelete}/${rowId}`, {});
      if (res.success) {
        console.log("api delete response", res);
        fetchRecords();
        return {
          success: true,
          message: "Record deleted successfully"
        };
      } else {
        return {
          success: false,
          message: res.error?.message || "Failed to delete record"
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.message || "Error deleting record"
      };
    }
  };

  return (
    <>
      {fetchLoading ? <Loader /> :
        <MobileListView
          title="Users"
          subtitle="List of Users"
          records={records}
          fields={fields}
          onAdd={handleAddRecord}
          onEdit={handleEditRecord}
          onDelete={handleDelete}
        />
      }
    </>
  );
};

export default UsersMobile;
