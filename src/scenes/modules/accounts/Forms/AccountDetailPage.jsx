import React, { useState } from "react";
import { DynamicForm } from "../../../../components/Form/DynamicForm";
import { useLocation, useNavigate } from "react-router-dom";
import { getUserRoleAndDepartment } from "../../../../utils/sessionUtils";
import { RequestServer } from "../../../api/HttpReq";
import ToastNotification from "../../../../components/UI/toast/ToastNotification";
import {
  accountformfields,
  generateAccountInitialValues,
  metaDataFields,
} from "../../../formik/initialValues";
import { appConfig } from "../../../../config/appConfig";
import { useCheckPermission } from "../../../hooks/useCheckPermission";


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
  const userRoleDpt = getUserRoleAndDepartment(CONSTANTS.OBJECT_API);
  console.log(userRoleDpt, "userRoleDpt");
  // Use the custom permission hook
  const { permissions } = useCheckPermission({
    role: userRoleDpt?.role,
    object: userRoleDpt?.object,
    departmentname: userRoleDpt?.departmentname
  });


  const initialValues = generateAccountInitialValues(exisitingAccount);

  const formFields = [
    ...accountformfields,
    ...(exisitingAccount ? metaDataFields : []),
  ];
  const handleSubmit = async (values, { isSubmitting }) => {
    console.log("Account Form -> values", values);
    if (values.billingcityOptions) {
      delete values.billingcityOptions
    }
    let dateSeconds = new Date().getTime();
    if (exisitingAccount) {
      values._id = exisitingAccount._id;
      //   values.inventoryid =
      //     typeof values.inventoryname === "string"
      //       ? exisitingAccount.inventoryid
      //       : values.inventoryname.id;
      values.accountnumber = Number(values.accountnumber)
      values.annualrevenue = Number(values.annualrevenue)
      values.phone = Number(values.phone)
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
        permissionValues={permissions}
      />
    </div>
  );
};

export default AccountDetailPage;


// useEffect(() => {
//   console.log("passed record", location.state.record.item);
//   fetchObjectPermissions();
// }, []);

// const fetchObjectPermissions = () => {
//   if (userRoleDpt) {
//     useCheckPermission(userRoleDpt)
//       .then((res) => {
//         console.log(res, " account useCheckPermission promise res");
//         setPermissionValues(res);
//       })
//       .catch((err) => {
//         console.log(err, "account res useCheckPermission error");
//         setPermissionValues({});
//       });
//   }
// };