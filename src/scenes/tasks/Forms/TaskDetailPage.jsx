import React, { useEffect, useState } from "react";
import { DynamicForm } from "../../../components/Form/DynamicForm";
import { apiCheckPermission } from "../../Auth/apiCheckPermission";
import { useLocation, useNavigate } from "react-router-dom";
import { getLoginUserRoleDept } from "../../Auth/userRoleDept";
import { RequestServer } from "../../api/HttpReq";
import ToastNotification from "../../toast/ToastNotification";
import {
  generateTaskInitialValues,
  metaDataFields,
  TaskFormFields,
} from "../../formik/InitialValues/initialValues";
import { de } from "date-fns/locale";
import { format } from "date-fns";

const OBJECT_API = "Event";
const TaskUpsertURL = `/UpsertTask`;

const TaskDetailPage = ({ props }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const currentUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
  console.log(currentUser, "currentUser");

  console.log(props, "props");
  const existingTask = props;

  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });
  const [permissionValues, setPermissionValues] = useState({});

  const userRoleDpt = getLoginUserRoleDept(OBJECT_API);
  console.log(userRoleDpt, "userRoleDpt");

  useEffect(() => {
    console.log("passed record", location.state.record.item);
    fetchObjectPermissions();
  }, []);

  const fetchObjectPermissions = () => {
    if (userRoleDpt) {
      apiCheckPermission(userRoleDpt)
        .then((res) => {
          console.log(res, " deals apiCheckPermission promise res");
          setPermissionValues(res);
        })
        .catch((err) => {
          console.log(err, "deals res apiCheckPermission error");
          setPermissionValues({});
        });
    }
  };

  const initialValues = generateTaskInitialValues(existingTask);

  const formFields = [
    ...TaskFormFields(existingTask),
    ...(existingTask ? metaDataFields : []),
  ];

  const handleSubmit = async (values) => {
    console.log(values, "handleSubmit values from TaskDetailPage");
    let dateSeconds = new Date().getTime();
    let startDateSec = new Date(values.startdate).getTime();
    let endDateSec = new Date(values.enddate).getTime();
    if (values.relatedtoOptions || values.relatedToOptions) {
      delete values.relatedtoOptions;
      delete values.relatedToOptions;
    }
    if (existingTask) {
      console.log("inside existingTask");
      values._id = existingTask._id;
      values.createddate = existingTask.createddate;
      values.createdby = existingTask.createdby;
      values.modifieddate = dateSeconds;
      values.modifiedby = currentUser;
    } else if (!existingTask) {
      console.log("inside new Task");
      values.startdate = startDateSec;
      values.enddate = endDateSec;
      values.createddate = dateSeconds;
      values.modifieddate = dateSeconds;
      values.createdby = currentUser;
      values.modifiedby = currentUser;
    }
    console.log(values, "values after modification");
    try {
      const response = await RequestServer("post", TaskUpsertURL, values);
      console.log(response, "response from TaskDetailPage");
      if (response.success) {
        setNotify({
          isOpen: true,
          message: response.data.message || "Task created successfully",
          type: "success",
        });
        setTimeout(() => {
          navigate("/list/event");
        }, 1500);
      } else {
        setNotify({
          isOpen: true,
          message: response.data.message || "Task creation failed",
          type: "error",
        });
      }
    } catch (error) {
      console.error(error);
      setNotify({
        isOpen: true,
        message: error || error.message || "Task creation failed",
        type: "error",
      });
    }
  };

  return (
    <div>
      <ToastNotification notify={notify} setNotify={setNotify} />
      <DynamicForm
        fields={formFields}
        initialValues={initialValues}
        onSubmit={handleSubmit}
        formTitle={existingTask ? "Edit Task" : "New Task"}
        submitButtonText={existingTask ? "Update Task" : "Create Task"}
        permissionValues={permissionValues}
      />
    </div>
  );
};

export default TaskDetailPage;
