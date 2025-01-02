import { useEffect, useState } from "react";
import { Dialog } from "@mui/material";
import { DynamicForm } from "../../components/Form/DynamicForm";
import { dashboardFormFields } from "../../scenes/formik/InitialValues/initialValues";
import { RequestServer } from "../api/HttpReq";

export const DashboardDetailPage = ({
  open,
  handleClose,
  initialValues,
  onSubmit,
  isEditing,
  dashboard,
  permissionValues,
}) => {
  const [fields, setFields] = useState([]);
  const [fieldOptions, setFieldOptions] = useState([]);

  // Fetch available objects when form opens
  useEffect(() => {
    const fetchObjects = async () => {
      try {
        const response = await RequestServer("get", "getObject");
        if (response.success) {
          const formFields = dashboardFormFields(isEditing);
          // Update the object field options
          const updatedFields = formFields.map(field => {
            if (field.name === "objectName") {
              return {
                ...field,
                options: response.data.map(obj => ({
                  value: obj.Tables_in_crm,
                  label: obj.Tables_in_crm
                })),
                onChange: async (value, formik) => {
                  formik.setFieldValue("selectedFields", []);
                  if (value) {
                    try {
                      const fieldsResponse = await RequestServer("get", `getFields?object=${value}`);
                      if (fieldsResponse.success) {
                        const options = fieldsResponse.data.map(field => ({
                          value: field.Field || field,
                          label: field.Field || field
                        }));
                        setFieldOptions(options);
                        formik.setFieldValue("selectedFieldsOptions", options);
                      }
                    } catch (error) {
                      console.error("Error fetching fields:", error);
                    }
                  }
                }
              };
            }
            if (field.name === "selectedFields") {
              return {
                ...field,
                options: fieldOptions,
                dependsOn: {
                  field: "objectName",
                  optionsKey: "selectedFieldsOptions"
                },
                onChange: (value, formik) => {
                  if (Array.isArray(value)) {
                    // Convert objects to strings
                    const stringValues = value.map(item =>
                      typeof item === 'string' ? item : item.label
                    );

                    // Limit to 2 selections
                    if (stringValues.length > 2) {
                      formik.setFieldValue("selectedFields", stringValues.slice(0, 2));
                    } else {
                      formik.setFieldValue("selectedFields", stringValues);
                    }
                  }
                }
              };
            }
            return field;
          });
          setFields(updatedFields);
        }
      } catch (error) {
        console.error("Error fetching objects:", error);
      }
    };

    if (open) {
      fetchObjects();
    }
  }, [open, isEditing, fieldOptions]);

  // Generate initial values with properly formatted selectedFields and _id
  const formInitialValues = {
    _id: initialValues?._id || "",
    dashboardName: initialValues?.dashboardname || "",
    objectName: initialValues?.objectname || "",
    selectedFields: initialValues?.fields || [], // Keep as array of strings
    chartType: initialValues?.charttype || "",
    selectedFieldsOptions: []
  };

  // If editing, fetch fields for the selected object
  useEffect(() => {
    const fetchInitialFields = async () => {
      if (initialValues?.objectname) {
        try {
          const response = await RequestServer("get", `getFields?object=${initialValues.objectname}`);
          if (response.success) {
            const options = response.data.map(field => ({
              value: field.Field || field,
              label: field.Field || field
            }));
            setFieldOptions(options);
          }
        } catch (error) {
          console.error("Error fetching initial fields:", error);
        }
      }
    };

    if (isEditing && open) {
      fetchInitialFields();
    }
  }, [initialValues?.objectname, isEditing, open]);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DynamicForm
        fields={fields}
        initialValues={formInitialValues}
        onSubmit={onSubmit}
        formTitle={isEditing ? "Edit Dashboard" : "Create Dashboard"}
        submitButtonText={isEditing ? "Update" : "Create"}
        permissionValues={permissionValues}
        handleCancel={handleClose}
      />
    </Dialog>
  );
};
