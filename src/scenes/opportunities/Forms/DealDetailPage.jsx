import React, { useEffect, useState } from "react";
import { DynamicForm } from "../../../components/Form/DynamicForm";
import {
  generateOpportunityInitialValues,
  metaDataFields,
  opportunityFormFields,
} from "../../formik/InitialValues/initialValues";
import { apiCheckPermission } from "../../Auth/apiCheckPermission";
import { useLocation, useNavigate } from "react-router-dom";
import { getLoginUserRoleDept } from "../../Auth/userRoleDept";
import { RequestServer } from "../../api/HttpReq";
import ToastNotification from "../../toast/ToastNotification";
import { format } from "date-fns";

const OBJECT_API = "Deals";
const url = `/UpsertOpportunity`;
// const fetchLeadsbyName = `/LeadsbyName`;
// const fetchInventoriesbyName = `/InventoryName`;

const DealDetailPage = ({ props }) => {
  const location = useLocation();
  const navigate = useNavigate();

  console.log(location.state.record.item, "location.state.record.item");
  const currentUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
  console.log(currentUser, "currentUser");

  console.log(props, "props");
  const existingOpportunity = props;

  const initialValues = generateOpportunityInitialValues(existingOpportunity);

  const [permissionValues, setPermissionValues] = useState({});
  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });

  const formFields = [
    ...opportunityFormFields,
    ...(existingOpportunity ? metaDataFields : []),
  ];

  const userRoleDpt = getLoginUserRoleDept(OBJECT_API);
  console.log(userRoleDpt, "userRoleDpt");

  useEffect(() => {
    fetchObjectPermissions();
  }, []);

  const fetchObjectPermissions = () => {
    if (userRoleDpt) {
      apiCheckPermission(userRoleDpt)
        .then((res) => {
          setPermissionValues(res);
        })
        .catch((err) => {
          console.log(err, "res apiCheckPermission error");
          setPermissionValues({});
        });
    }
  };

  const handleSubmit = async (values, { isSubmitting }) => {
    console.log(values, "values");
    let dateSeconds = new Date().getTime();
    let closeDateSec = existingOpportunity
      ? existingOpportunity?.closedate
      : new Date(values.closedate).getTime();

    if (existingOpportunity) {
      values._id = existingOpportunity._id;
      values.closedate = closeDateSec;
      values.modifieddate = dateSeconds;
      values.modifiedby = currentUser;
      values.createddate = existingOpportunity.createddate;
      values.createdby = existingOpportunity.createdby;
    } else if (!existingOpportunity) {
      values.createddate = dateSeconds;
      values.modifieddate = dateSeconds;
      values.createdby = currentUser;
      values.modifiedby = currentUser;
      values.closedate = closeDateSec;
    }
    console.log(values, "values after change");
    try {
      const response = await RequestServer("post", url, values);
      console.log(response, "response");
      if (response.success) {
        setNotify({
          isOpen: true,
          message: "Opportunity saved successfully",
          type: "success",
        });
        setTimeout(() => {
          navigate("/list/deals");
        }, 1500);
      } else {
        setNotify({
          isOpen: true,
          message: "Error saving Opportunity",
          type: "error",
        });
      }
    } catch (error) {
      console.error(error);
    }

    console.log("after change form submission value", values);
  };

  return (
    <div>
      <ToastNotification notify={notify} setNotify={setNotify} />
      <DynamicForm
        fields={formFields}
        initialValues={initialValues}
        onSubmit={handleSubmit}
        formTitle={existingOpportunity ? "Edit Deal" : "New Deal"}
        submitButtonText={existingOpportunity ? "Update Deal" : "Create Deal"}
        permissionValues={permissionValues}
      />
    </div>
  );
};

export default DealDetailPage;
