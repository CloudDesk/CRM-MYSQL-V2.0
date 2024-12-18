import React, { useEffect, useState } from "react";
import {
  generateLeadInitialValues,
  leadFormFields,
  metaDataFields,
} from "../../formik/InitialValues/initialValues";
import { DynamicForm } from "../../../components/Form/DynamicForm";
import { apiCheckPermission } from "../../Auth/apiCheckPermission";
import { useLocation, useNavigate } from "react-router-dom";
import { getLoginUserRoleDept } from "../../Auth/userRoleDept";
import { RequestServer } from "../../api/HttpReq";
import ToastNotification from "../../toast/ToastNotification";

const LeadDetailPage = ({ props }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const currentUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
  console.log(currentUser, "currentUser");

  console.log(props, "props");
  const existingLead = props;

  const OBJECT_API = "Enquiry";
  const upsertURL = `/UpsertLead`;
  const fetchUsersbyName = `/usersbyName`;

  //   const [singleLead, setsingleLead] = useState();

  //   const [showNew, setshowNew] = useState(true);
  //   const [usersRecord, setUsersRecord] = useState([]);
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
    RequestServer("post", upsertURL, values)
      .then((res) => {
        console.log("upsert record  response", res);
        if (res.success) {
          setNotify({
            isOpen: true,
            message: res.data,
            type: "success",
          });
          setTimeout(() => {
            navigate(-1);
          }, 2000);
        } else {
          setNotify({
            isOpen: true,
            message: res.error.message,
            type: "error",
          });
          setTimeout(() => {
            navigate(-1);
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
          navigate(-1);
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
        formTitle={existingLead ? "Edit Lead" : "New Lead"}
        submitButtonText={existingLead ? "Update Lead" : "Create Lead"}
      />
    </div>
  );
};

export default LeadDetailPage;
