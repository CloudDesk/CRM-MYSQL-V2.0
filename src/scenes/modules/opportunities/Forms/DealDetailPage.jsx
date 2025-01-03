import React, { useEffect, useState } from "react";
import { DynamicForm } from "../../../../components/Form/DynamicForm";
import {
  generateOpportunityInitialValues,
  metaDataFields,
  opportunityFormFields,
} from "../../../formik/InitialValues/initialValues";
import { apiCheckPermission } from "../../../shared/Auth/apiCheckPermission";
import { useLocation, useNavigate } from "react-router-dom";
import { getLoginUserRoleDept } from "../../../shared/Auth/userRoleDept";
import { appConfig } from "../../../../config/appConfig";
import ToastNotification from "../../../shared/toast/ToastNotification";
import { RequestServer } from "../../../api/HttpReq";

const CONSTANTS = {
  OBJECT_API: appConfig.objects.opportunity.apiName,
  upsert: appConfig.objects.opportunity.upsert,
  list: appConfig.objects.opportunity.list,
}

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

  const userRoleDpt = getLoginUserRoleDept(CONSTANTS.OBJECT_API);
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
    console.log(values, "Opportunity submit values");
    let dateSeconds = new Date().getTime();
    let closeDateSec = new Date(values.closedate).getTime();

    if (existingOpportunity) {
      values._id = existingOpportunity._id;
      values.closedate = closeDateSec;
      values.modifieddate = dateSeconds;
      values.modifiedby = currentUser;
      values.createddate = existingOpportunity.createddate;
      values.createdby = existingOpportunity.createdby;
    } else if (!existingOpportunity) {
      if (typeof (values.leadname) === "object") {
        values.leadid = values.leadname.id;
      }
      if (typeof (values.inventoryname) === 'object') {
        values.inventoryid = values.inventoryname.id;
      }

      values.createddate = dateSeconds;
      values.modifieddate = dateSeconds;
      values.createdby = currentUser;
      values.modifiedby = currentUser;
      values.closedate = closeDateSec;
    }
    console.log(values, "values after change");
    try {
      const response = await RequestServer("post", CONSTANTS.upsert, values);
      console.log(response, "response");
      if (response.success) {
        setNotify({
          isOpen: true,
          message: "Opportunity saved successfully",
          type: "success",
        });
        setTimeout(() => {
          navigate(CONSTANTS.list);
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
