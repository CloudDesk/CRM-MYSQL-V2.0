import React, { useEffect, useState } from "react";
import {
  generateLeadInitialValues,
  leadFormFields,
  metaDataFields,
} from "../../../formik/InitialValues/initialValues";
import { DynamicForm } from "../../../../components/Form/DynamicForm";
import { apiCheckPermission } from "../../../shared/Auth/apiCheckPermission";
import { useNavigate } from "react-router-dom";
import { getLoginUserRoleDept } from "../../../shared/Auth/userRoleDept";
import { RequestServer } from "../../../api/HttpReq";
import ToastNotification from "../../../shared/toast/ToastNotification";
import { appConfig } from "../../../../config/appConfig";

const CONSTANTS = {
  OBJECT_API: appConfig.objects.lead.apiName,
  upsert: appConfig.objects.lead.upsert,
  list: appConfig.objects.lead.list
}
const LeadDetailPage = ({ props }) => {
  const navigate = useNavigate();

  const currentUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
  console.log(currentUser, "currentUser");

  console.log(props, "props");
  const existingLead = props;

  const OBJECT_API = "Enquiry";
  const upsertURL = `/UpsertLead`;

  //   const [singleLead, setsingleLead] = useState();

  //   const [showNew, setshowNew] = useState(true);
  //   const [usersRecord, setUsersRecord] = useState([]);
  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });
  const [permissionValues, setPermissionValues] = useState({});

  const userRoleDpt = getLoginUserRoleDept(CONSTANTS.OBJECT_API);
  console.log(userRoleDpt, "userRoleDpt");

  useEffect(() => {

    //   setsingleLead(location.state.record.item || location.state.record);
    //   setshowNew(!location.state.record.item);
    // getTasks(location.state.record.item._id)
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
    // const getPermission=getPermissions("Lead")
    // console.log(getPermission,"getPermission")
    // setPermissionValues(getPermission)
  };
  const initialValues = generateLeadInitialValues(existingLead);
  console.log(initialValues, "initialValues");
  const formFields = [
    ...leadFormFields,
    ...(existingLead ? metaDataFields : []),
  ];
  const handleSubmit = (values, { setSubmitting }) => {
    console.log(values, "values before changing");
    // Prepare submission data
    let appointmentDateSec = new Date(values.appointmentdate).getTime();
    if (existingLead) {
      console.log("inisde existing lead");
      values._id = existingLead._id;
      values.appointmentdate = appointmentDateSec;
      values.createddate = existingLead.createddate;
      values.modifieddate = new Date().getTime();
      values.createdby = existingLead.createdby;
      values.modifiedby = currentUser;
    } else if (!existingLead) {
      console.log("inisde new lead");
      // values.leadid = values.leadname.id;
      // values.inventoryid = values.inventoryname.id;
      values.createddate = new Date().getTime();
      values.modifieddate = new Date().getTime();
      values.createdby = currentUser;
      values.modifiedby = currentUser;
      values.appointmentdate = appointmentDateSec;
    }
    // const submissionData = {
    //   ...values,
    //   // For new lead, set created metadata
    //   ...(!existingLead
    //     ? {
    //         createddate: new Date().getTime(),
    //         modifieddate: new Date().getTime(),
    //         createdby: currentUser,
    //         modifiedby: currentUser,
    //         appointmentdate: appointmentDateSec,
    //       }
    //     : {}),
    //   // Always update modified metadata
    //   appointmentdate: appointmentDateSec,
    //   createddate: values.createddate,
    //   modifieddate: new Date().getTime(),
    //   createdby: values.createdby,
    //   modifiedby: currentUser,
    // };

    console.log("Lead Submission:", values);
    RequestServer("post", CONSTANTS.upsert, values)
      .then((res) => {
        console.log("upsert record  response", res);
        if (res.success) {
          setNotify({
            isOpen: true,
            message: res.data,
            type: "success",
          });
          setTimeout(() => {
            navigate(CONSTANTS.list);
          }, 2000);
        } else {
          setNotify({
            isOpen: true,
            message: res.error.message,
            type: "error",
          });
          setTimeout(() => {
            navigate(CONSTANTS.list);
          }, 1000);
        }
      })
      .catch((error) => {
        console.log("upsert record error", error);
        setNotify({
          isOpen: true,
          message: error.message,
          type: "error",
        });
        setTimeout(() => {
          navigate(CONSTANTS.list);
        }, 1000);
      });
    setSubmitting(false);
  };

  return (
    <div>
      <ToastNotification notify={notify} setNotify={setNotify} />
      <DynamicForm
        fields={formFields}
        initialValues={initialValues}
        onSubmit={handleSubmit}
        formTitle={existingLead ? "Edit Enquiry" : "New Enquiry"}
        submitButtonText={existingLead ? "Update Enquiry" : "Create Enquiry"}
        permissionValues={permissionValues}
      />
    </div>
  );
};

export default LeadDetailPage;
