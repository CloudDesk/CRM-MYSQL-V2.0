import React, { useEffect, useRef, useState } from "react";
import { DynamicForm } from "../../../components/Form/DynamicForm";
import { apiCheckPermission } from "../../Auth/apiCheckPermission";
import { useLocation, useNavigate } from "react-router-dom";
import { getLoginUserRoleDept } from "../../Auth/userRoleDept";
import { RequestServer } from "../../api/HttpReq";
import ToastNotification from "../../toast/ToastNotification";
import {
  generatePermissionSetInitialValues,
  metaDataFields,
  PermissionSetFormFields,
} from "../../formik/InitialValues/initialValues";
import { appConfig } from "../../config";

const OBJECT_API = "Permissions";
const upsertPermissionURL = `/upsertPermission`;

const CONSTANTS = {
  OBJECT_API: appConfig.objects.permission.apiName,
  upsert: appConfig.objects.permission.upsert,
  list: appConfig.objects.permission.list
}
const PermissionDetailPage = ({ props }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const formRef = useRef();

  const currentUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
  console.log(currentUser, "currentUser");

  console.log(props, "props");
  const existingPermission = location.state.record.item;

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

  const initialValues = generatePermissionSetInitialValues(existingPermission);

  const formFields = [
    ...PermissionSetFormFields(existingPermission),
    ...(existingPermission ? metaDataFields : []),
  ];

  const handleSubmit = async (values) => {
    console.log("Permission submit values", values);
    const convertValue = [...values.permissionsets];
    convertValue.forEach((obj) => {
      let permissionLevel =
        (obj.permissions.read ? 1 : 0) +
        (obj.permissions.create ? 2 : 0) +
        (obj.permissions.edit ? 3 : 0) +
        (obj.permissions.delete ? 4 : 0);

      obj.permissionLevel = permissionLevel;
    });
    console.log(convertValue, "convertValue");
    // values.permissionSets = convertValue;
    values.permissionsets = JSON.stringify(convertValue);
    let dateSeconds = new Date().getTime();
    if (existingPermission) {
      values._id = existingPermission._id;
      values.createddate = existingPermission.createddate;
      values.modifieddate = dateSeconds;
      values.createdby = existingPermission.createdby;
      values.modifiedby = currentUser;
      delete values.userdetails;
    } else if (!existingPermission) {
      values.createddate = dateSeconds;
      values.modifieddate = dateSeconds;
      values.createdby = currentUser;
      values.modifiedby = currentUser;
      delete values.userdetails;
    }

    console.log("values after modified", values);
    try {
      const response = await RequestServer("post", CONSTANTS.upsert, values);
      console.log(response, "response");
      if (response.success) {
        setNotify({
          isOpen: true,
          message:
            response.data.message ||
            response.data ||
            response ||
            "Permission Set created successfully",
          type: "success",
        });
        setTimeout(() => {
          navigate(CONSTANTS.list);
        }, 1500);
      } else {
        setNotify({
          isOpen: true,
          message:
            response.data ||
            response.data.message ||
            response ||
            "Error creating Permission Set",
          type: "error",
        });
      }
    } catch (error) {
      console.log(error, "error");
      setNotify({
        isOpen: true,
        message: error.message || error || "Error creating Permission Set",
        type: "error",
      });
    }
  };

  const handleFieldChange = (fieldName, value, setFieldValue) => {
    if (fieldName.includes("permissions")) {
      const matches = fieldName.match(
        /permissionsets\[(\d+)\]\.permissions\.(\w+)/
      );

      if (matches) {
        const [_, sectionIndex, permissionType] = matches;
        const index = parseInt(sectionIndex, 10);

        // Get current permissions for this section
        const currentValues = formRef.current?.values || {};
        const currentPermissionsets = [...(currentValues.permissionsets || [])];
        const currentPermissions =
          currentPermissionsets[index]?.permissions || {};

        // Handle permission hierarchy
        if (value) {
          // When enabling a permission, enable all required lower-level permissions
          switch (permissionType) {
            case "delete":
              setFieldValue(
                `permissionsets[${index}].permissions.delete`,
                true
              );
              setFieldValue(`permissionsets[${index}].permissions.edit`, true);
              setFieldValue(
                `permissionsets[${index}].permissions.create`,
                true
              );
              setFieldValue(`permissionsets[${index}].permissions.read`, true);
              break;
            case "edit":
              setFieldValue(`permissionsets[${index}].permissions.edit`, true);
              setFieldValue(
                `permissionsets[${index}].permissions.create`,
                true
              );
              setFieldValue(`permissionsets[${index}].permissions.read`, true);
              break;
            case "create":
              setFieldValue(
                `permissionsets[${index}].permissions.create`,
                true
              );
              setFieldValue(`permissionsets[${index}].permissions.read`, true);
              break;
            case "read":
              setFieldValue(`permissionsets[${index}].permissions.read`, true);
              break;
          }
        } else {
          // When disabling a permission, disable all dependent higher-level permissions
          switch (permissionType) {
            case "read":
              setFieldValue(`permissionsets[${index}].permissions.read`, false);
              setFieldValue(
                `permissionsets[${index}].permissions.create`,
                false
              );
              setFieldValue(`permissionsets[${index}].permissions.edit`, false);
              setFieldValue(
                `permissionsets[${index}].permissions.delete`,
                false
              );
              break;
            case "create":
              setFieldValue(
                `permissionsets[${index}].permissions.create`,
                false
              );
              setFieldValue(`permissionsets[${index}].permissions.edit`, false);
              setFieldValue(
                `permissionsets[${index}].permissions.delete`,
                false
              );
              break;
            case "edit":
              setFieldValue(`permissionsets[${index}].permissions.edit`, false);
              setFieldValue(
                `permissionsets[${index}].permissions.delete`,
                false
              );
              break;
            case "delete":
              setFieldValue(
                `permissionsets[${index}].permissions.delete`,
                false
              );
              break;
          }
        }
      }
    }
  };

  return (
    <div>
      <ToastNotification notify={notify} setNotify={setNotify} />
      <DynamicForm
        fields={formFields}
        initialValues={initialValues}
        onSubmit={handleSubmit}
        formTitle={
          existingPermission ? "Edit Permission Set" : "New Permission Set"
        }
        submitButtonText={
          existingPermission ? "Update Permission Set" : "Create Permission Set"
        }
        permissionValues={permissionValues}
        onFieldChange={handleFieldChange}
        formref={formRef}
      />
    </div>
  );
};

export default PermissionDetailPage;
