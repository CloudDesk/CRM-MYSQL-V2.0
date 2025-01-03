import React, { useEffect, useState } from "react";
import { DynamicForm } from "../../../../components/Form/DynamicForm";
import { apiCheckPermission } from "../../../shared/Auth/apiCheckPermission";
import { useLocation, useNavigate } from "react-router-dom";
import { getLoginUserRoleDept } from "../../../shared/Auth/userRoleDept";
import { RequestServer } from "../../../api/HttpReq";
import ToastNotification from "../../../shared/toast/ToastNotification";
import {
  generateUserInitialValues,
  metaDataFields,
  UserFormFields,
} from "../../../formik/InitialValues/initialValues";
import { appConfig } from "../../../../config/appConfig";
const OBJECT_API = "Users";
const urlUpsertUser = `/UpsertUser`;
const urlSendEmail = `/singlemail`;

const CONSTANTS = {
  OBJECT_API: appConfig.objects.user.apiName,
  upsert: appConfig.objects.user.upsert,
  list: appConfig.objects.user.list,
  sendEmail: appConfig.api.email.single
}

const UserDetailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const currentUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
  console.log(currentUser, "currentUser");

  const existingUser = location.state.record.item;

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

  const initialValues = generateUserInitialValues(existingUser);

  const formFields = [
    ...UserFormFields(existingUser),
    ...(existingUser ? metaDataFields : []),
  ];

  const sendInviteEmail = (values) => {
    const greetingEmail = {
      emailId: `${values.email}`,
      subject: `Welcome to ${appConfig.name} ${appConfig.subTitle}`,
      htmlbody:
        `Dear ${values.fullName || values.fullname},\n\n` +
        `Welcome to ${appConfig.name} ${appConfig.subTitle}. You can access your account using the following credentials:\n\n` +
        `Username: ${values.userName || values.username}\n\n` +
        `To generate your ${appConfig.subTitle} password, click here: ${appConfig.resetLink}\n\n` +
        `Note: This link will expire in 4 days.\n\n` +
        `If you have any trouble logging in, please contact us at ${appConfig.adminEmail}.\n\n` +
        `Thanks and Regards,\n` +
        `${appConfig.name}`,
    };
    console.log(greetingEmail, "sendInviteEmail");

    RequestServer("post", CONSTANTS.sendEmail, greetingEmail)
      .then((res) => {
        console.log("eamil res", res.data);
        if (res.success) {
          setNotify({
            isOpen: true,
            message: "Mail sent Succesfully",
            type: "success",
          });
        } else {
          setNotify({
            isOpen: true,
            message: res.error.message,
            type: "error",
          });
        }
      })
      .catch((error) => {
        console.log("email send error", error);
        setNotify({
          isOpen: true,
          message: error.message,
          type: "error",
        });
      });
  };

  const handleSubmit = async (values) => {
    console.log("User Form Submission", values);
    let dateSeconds = new Date().getTime();
    if (existingUser) {
      console.log("inside existingUser");
      values._id = existingUser._id;
      values.createddate = existingUser.createddate;
      values.modifieddate = dateSeconds;
      values.createdby = existingUser.createdby;
      values.modifiedby = currentUser;
      values.fullname = values.firstname + " " + values.lastname;
      values.username = values.email;
      values.roledetails = values.roledetails;
    } else if (!existingUser) {
      console.log("inside new User");
      values.modifieddate = dateSeconds;
      values.createddate = dateSeconds;
      values.fullname = values.firstname + " " + values.lastname;
      values.createdby = currentUser;
      values.modifiedby = currentUser;
      values.roledetails = values.roledetails;
    }
    console.log("values after modification", values);

    try {
      const response = await RequestServer("post", CONSTANTS.upsert, values);
      console.log("response from UserDetailPage", response);
      if (response.success) {
        setNotify({
          isOpen: true,
          message: response.data.message || "User created successfully",
          type: "success",
        });
        if (!existingUser) {
          sendInviteEmail(values);
        }
        setTimeout(() => {
          navigate(CONSTANTS.list);
        }, 1500);
      } else {
        setNotify({
          isOpen: true,
          message: response.data.message || "User creation failed",
          type: "error",
        });
      }
    } catch (error) {
      console.error(error);
      setNotify({
        isOpen: true,
        message: error || error.message || "User creation failed",
        type: "error",
      });
    }
  };

  const handleFieldChange = (fieldName, value, setFieldValue) => {
    console.log(`Field ${fieldName} changed to:`, value);

    if (fieldName === "email") {
      setFieldValue("username", value);
    }
  };

  return (
    <div>
      <ToastNotification notify={notify} setNotify={setNotify} />
      <DynamicForm
        fields={formFields}
        initialValues={initialValues}
        onSubmit={handleSubmit}
        formTitle={existingUser ? "Edit User" : "New User"}
        submitButtonText={existingUser ? "Update User" : "Create User"}
        permissionValues={permissionValues}
        onFieldChange={handleFieldChange}
      />
    </div>
  );
};

export default UserDetailPage;
