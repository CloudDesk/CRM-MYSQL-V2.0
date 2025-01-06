import React, { useState, useEffect } from "react";
import { DynamicForm } from "../../../../components/Form/DynamicForm";
import { useLocation, useNavigate } from "react-router-dom";
import { getUserRoleAndDepartment } from "../../../../utils/sessionUtils";
import { RequestServer } from "../../../api/HttpReq";
import { useCheckPermission } from "../../../hooks/useCheckPermission";
import ToastNotification from "../../../../components/UI/toast/ToastNotification";
import {
  generateTaskInitialValues,
  metaDataFields,
  TaskFormFields,
} from "../../../formik/initialValues";
import { appConfig } from "../../../../config/appConfig";

const CONSTANTS = {
  OBJECT_API: appConfig.objects.task.apiName,
  upsert: appConfig.objects.task.upsert,
  list: appConfig.objects.task.list,
  getAccount: appConfig.objects.account.fetchAllAccounts,
  getLead: appConfig.objects.lead.fetchAllLeads,
  getOpportunity: appConfig.objects.opportunity.fetchAllOpportunity,
}

const TaskDetailPage = ({ props }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
  const existingTask = props;

  // State management
  const [notify, setNotify] = useState({ isOpen: false, message: "", type: "" });
  const [relatedToOptions, setRelatedToOptions] = useState([]);

  // Get user role and department
  const userRoleDpt = getUserRoleAndDepartment(CONSTANTS.OBJECT_API);

  // Use the custom permission hook
  const { permissions } = useCheckPermission({
    role: userRoleDpt?.role,
    object: userRoleDpt?.object,
    departmentname: userRoleDpt?.departmentname
  });



  const initialValues = generateTaskInitialValues(existingTask);

  const fetchRelatedToOptions = async (object) => {
    const urlMap = {
      Account: CONSTANTS.getAccount,
      Enquiry: CONSTANTS.getLead,
      Deals: CONSTANTS.getOpportunity,
    };

    const fetchUrl = urlMap[object];
    console.log(fetchUrl, "fetchUrl");
    if (!fetchUrl) return [];
    try {
      const response = await RequestServer("get", fetchUrl);
      console.log(response.data, "response.data from fetchRelatedToOptions");
      return response.data.map((item) => ({
        value: item.fullname || item.opportunityname || item.accountname,
        label: item.fullname || item.opportunityname || item.accountname,
      }));
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  useEffect(() => {
    if (existingTask) {
      fetchRelatedToOptions(existingTask.object).then((options) => {
        setRelatedToOptions(options);
        initialValues.relatedto = existingTask.relatedto;
      });
    }
  }, [existingTask, existingTask?.object]);

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
      const response = await RequestServer("post", CONSTANTS.upsert, values);
      console.log(response, "response from TaskDetailPage");
      if (response.success) {
        setNotify({
          isOpen: true,
          message: response.data.message || "Task created successfully",
          type: "success",
        });
        setTimeout(() => {
          navigate(CONSTANTS.list);
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
        fields={formFields.map(field => {
          if (field.name === "relatedto") {
            field.options = relatedToOptions;
          }
          return field;
        })}
        initialValues={initialValues}
        onSubmit={handleSubmit}
        formTitle={existingTask ? "Edit Event" : "New Event"}
        submitButtonText={existingTask ? "Update Event" : "Create Event"}
        permissionValues={permissions}
      />
    </div>
  );
};

export default TaskDetailPage;
