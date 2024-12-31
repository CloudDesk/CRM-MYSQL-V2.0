import React, { useEffect, useState } from "react";
import { DynamicForm } from "../../../components/Form/DynamicForm";
import { apiCheckPermission } from "../../Auth/apiCheckPermission";
import { useLocation, useNavigate } from "react-router-dom";
import { getLoginUserRoleDept } from "../../Auth/userRoleDept";
import { RequestServer } from "../../api/HttpReq";
import ToastNotification from "../../toast/ToastNotification";
import {
  generateInventoryInitialValues,
  inventoryformfields,
  metaDataFields,
} from "../../formik/InitialValues/initialValues";
import { InvCitiesPickList } from "../../../data/pickLists";
import { appConfig } from "../../config";

const OBJECT_API = "Inventory";
const upsertInventoryURL = `/UpsertInventory`;

const CONSTANTS = {
  OBJECT_API: appConfig.objects.inventory.apiName,
  upsert: appConfig.objects.inventory.upsert,
  list: appConfig.objects.inventory.list
}

const InventoryDetailPage = ({ props }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [cityOptions, setCityOptions] = useState([]);

  const currentUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
  console.log(currentUser, "currentUser");

  console.log(props, "props");
  const exisitingInventory = props;

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

  const fetchObjectPermissions = async () => {
    if (userRoleDpt) {
      await apiCheckPermission(userRoleDpt)
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



  const initialValues = {
    ...generateInventoryInitialValues(exisitingInventory),
    country: exisitingInventory?.country || "USA",
    city: exisitingInventory?.city || "",
  };

  const formFields = [
    ...inventoryformfields(!!exisitingInventory),
    // ...(exisitingInventory ? metaDataFields : []),
  ];

  useEffect(() => {
    const cities = InvCitiesPickList[initialValues.country] || [];
    setCityOptions(cities);
  }, [initialValues.country]);

  const handleSubmit = async (values, { isSubmitting }) => {
    console.log("Account Form -> values", values);
    if (values.cityOptions) {
      delete values.cityOptions
    }
    let dateSeconds = new Date().getTime();
    if (exisitingInventory) {
      console.log("inside existing inventory");
      values._id = exisitingInventory._id;
      //   values.inventoryid =
      //     typeof values.inventoryname === "string"
      //       ? exisitingInventory.inventoryid
      //       : values.inventoryname.id;
      values.createddate = exisitingInventory.createddate;
      values.createdby = exisitingInventory.createdby;
      values.modifieddate = dateSeconds;
      values.modifiedby = currentUser;
    } else if (!exisitingInventory) {
      console.log("inside new inventory");
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
          message: "Inventory created successfully",
          type: "success",
        });
        setTimeout(() => {
          navigate(CONSTANTS.list);
        }, 1500);
      } else {
        setNotify({
          isOpen: true,
          message: "Failed to create Inventory",
          type: "error",
        });
      }
    } catch (error) {
      console.log(error);
      setNotify({
        isOpen: true,
        message: "Failed to create Inventory",
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
        formTitle={exisitingInventory ? "Edit Inventory" : "New Inventory"}
        submitButtonText={
          exisitingInventory ? "Update Inventory" : "Create Inventory"
        }
        permissionValues={permissionValues}
      />
    </div>
  );
};

export default InventoryDetailPage;
