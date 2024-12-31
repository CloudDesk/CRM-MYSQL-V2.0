import React, { useEffect, useState } from "react";
import { DynamicForm } from "../../../components/Form/DynamicForm";
import { apiCheckPermission } from "../../Auth/apiCheckPermission";
import { useLocation, useNavigate } from "react-router-dom";
import { getLoginUserRoleDept } from "../../Auth/userRoleDept";
import { RequestServer } from "../../api/HttpReq";
import ToastNotification from "../../toast/ToastNotification";
import {
  accountformfields,
  generateAccountInitialValues,
  metaDataFields,
} from "../../formik/InitialValues/initialValues";
import { appConfig } from "../../config";


const CONSTANTS = {
  OBJECT_API: appConfig.objects.account.apiName,
  upsert: appConfig.objects.account.upsert,
  list: appConfig.objects.account.list
}

const AccountDetailPage = ({ props }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const currentUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
  console.log(currentUser, "currentUser");

  console.log(props, "props");
  const exisitingAccount = props;

  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });
  const [permissionValues, setPermissionValues] = useState({});

  const userRoleDpt = getLoginUserRoleDept(CONSTANTS.OBJECT_API);
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

  const initialValues = generateAccountInitialValues(exisitingAccount);

  const formFields = [
    ...accountformfields,
    ...(exisitingAccount ? metaDataFields : []),
  ];
  const handleSubmit = async (values, { isSubmitting }) => {
    console.log("Account Form -> values", values);

    let dateSeconds = new Date().getTime();
    if (exisitingAccount) {
      values._id = exisitingAccount._id;
      //   values.inventoryid =
      //     typeof values.inventoryname === "string"
      //       ? exisitingAccount.inventoryid
      //       : values.inventoryname.id;
      values.createddate = exisitingAccount.createddate;
      values.createdby = exisitingAccount.createdby;
      values.modifieddate = dateSeconds;
      values.modifiedby = currentUser;
    } else if (!exisitingAccount) {
      //   values.inventoryid = values.inventoryname.id;
      values.createddate = dateSeconds;
      values.modifieddate = dateSeconds;
      values.createdby = currentUser;
      values.modifiedby = currentUser;
    }
    console.log(values, "values after changing");
    try {
      const response = await RequestServer("post", CONSTANTS.upsert, values);
      console.log(response, "response");
      if (response.success) {
        setNotify({
          isOpen: true,
          message: "Account created successfully",
          type: "success",
        });
        setTimeout(() => {
          navigate(CONSTANTS.list);
        }, 1500);
      } else {
        setNotify({
          isOpen: true,
          message: "Failed to create account",
          type: "error",
        });
      }
    } catch (error) {
      console.log(error);
      setNotify({
        isOpen: true,
        message: "Failed to create account",
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
        formTitle={exisitingAccount ? "Edit Account" : "New Account"}
        submitButtonText={
          exisitingAccount ? "Update Account" : "Create Account"
        }
        permissionValues={permissionValues}
      />
    </div>
  );
};

export default AccountDetailPage;
