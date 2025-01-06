import React, { useState, useEffect } from "react";
import { DynamicForm } from "../../../../components/Form/DynamicForm";
import { useLocation, useNavigate } from "react-router-dom";
import { getUserRoleAndDepartment } from "../../../../utils/sessionUtils";
import { RequestServer } from "../../../api/HttpReq";
import { useCheckPermission } from "../../../hooks/useCheckPermission";
import ToastNotification from "../../../../components/UI/toast/ToastNotification";
import {
  generateInventoryInitialValues,
  inventoryformfields,
} from "../../../formik/initialValues";
import { InvCitiesPickList } from "../../../../assets/pickLists";
import { appConfig } from "../../../../config/appConfig";

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
  const exisitingInventory = props;

  // State management
  const [notify, setNotify] = useState({ isOpen: false, message: "", type: "" });

  // Get user role and department
  const userRoleDpt = getUserRoleAndDepartment(CONSTANTS.OBJECT_API);

  // Use the custom permission hook
  const { permissions } = useCheckPermission({
    role: userRoleDpt?.role,
    object: userRoleDpt?.object,
    departmentname: userRoleDpt?.departmentname
  });

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
        permissionValues={permissions}
      />
    </div>
  );
};

export default InventoryDetailPage;
