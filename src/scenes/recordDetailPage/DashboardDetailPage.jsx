import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Chip,
  Box,
  OutlinedInput,
} from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { RequestServer } from "../api/HttpReq";

// Initial values for new dashboard creation
const DashboardInitialValues = {
  dashboardName: "",
  objectName: "",
  selectedFields: [],
  chartType: "",
};

// Function to generate saved values when editing
const DashboardSavedValues = (dashboard) => {
  if (!dashboard) return DashboardInitialValues;

  return {
    _id: dashboard._id,
    dashboardName: dashboard.dashboardName || dashboard.dashboardname || "",
    objectName: dashboard.objectName || dashboard.objectname || "",
    selectedFields: dashboard.selectedFields || dashboard.fields || [],
    chartType: dashboard.chartType || dashboard.charttype || "",
  };
};

export const DashboardDetailPage = ({
  open,
  handleClose,
  initialValues,
  onSubmit,
  isEditing,
  onObjectChange,
  dashboard,
  permissionValues,
}) => {
  const [objects, setObjects] = useState([]);
  const [fields, setFields] = useState([]);
  const [selectedFields, setSelectedFields] = useState([]);

  // Validation Schema
  const validationSchema = Yup.object({
    dashboardName: Yup.string()
      .required("Dashboard Name is Required")
      .max(50, "Dashboard Name must be less than 50 characters"),
    objectName: Yup.string().required("Object Name is Required"),
    selectedFields: Yup.array().min(1, "At least one field must be selected"),
    chartType: Yup.string().required("Chart Type is Required"),
  });

  // Fetch available objects when form opens
  useEffect(() => {
    const fetchObjects = async () => {
      try {
        const response = await RequestServer("get", "getObject");
        if (response.success) {
          setObjects(response.data);
        }
      } catch (error) {
        console.error("Error fetching objects:", error);
      }
    };

    if (open) {
      fetchObjects();
    }
  }, [open]);
  console.log(initialValues, "initialValues");

  useEffect(() => {
    if (
      initialValues !== null &&
      initialValues.objectname &&
      Object.keys(initialValues.objectname).length > 0
    ) {
      fetchFields(initialValues.objectname);
    }
  }, [initialValues?.objectname]);

  // Fetch fields when object is selected
  const fetchFields = async (objectName) => {
    try {
      const response = await RequestServer(
        "get",
        `getFields?object=${objectName}`
      );
      console.log(response.data, "response data from fields");
      if (response.success) {
        setFields(response.data);
      }
    } catch (error) {
      console.error("Error fetching fields:", error);
    }
  };

  const handleObjectChange = async (e, setFieldValue) => {
    const objectName = e.target.value;
    setFieldValue("objectName", objectName);
    setFieldValue("selectedFields", []); // Reset selected fields
    setSelectedFields([]); // Reset local state
    if (objectName) {
      await fetchFields(objectName);
    }
    // if (onObjectChange) {
    //     onObjectChange(objectName);
    // }
  };

  // Determine initial values based on editing state
  const formInitialValues = isEditing
    ? DashboardSavedValues(dashboard || initialValues)
    : DashboardInitialValues;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {isEditing ? "Edit Dashboard" : "Create Dashboard"}
      </DialogTitle>
      <Formik
        enableReinitialize={true}
        initialValues={formInitialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          setFieldValue,
        }) => (
          <Form>
            <DialogContent>
              <TextField
                disabled={!permissionValues?.edit}
                fullWidth
                margin="normal"
                name="dashboardName"
                label="Dashboard Name"
                value={values.dashboardName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.dashboardName && Boolean(errors.dashboardName)}
                helperText={touched.dashboardName && errors.dashboardName}
              />

              <TextField
                disabled={!permissionValues?.edit}
                select
                fullWidth
                margin="normal"
                name="objectName"
                label="Select Object"
                value={values.objectName}
                onChange={(e) => handleObjectChange(e, setFieldValue)}
                onBlur={handleBlur}
                error={touched.objectName && Boolean(errors.objectName)}
                helperText={touched.objectName && errors.objectName}
              >
                {objects.map((object) => (
                  <MenuItem
                    key={object.Tables_in_crm}
                    value={object.Tables_in_crm}
                  >
                    {object.Tables_in_crm}
                  </MenuItem>
                ))}
              </TextField>

              <FormControl
                disabled={!permissionValues?.edit}
                fullWidth
                margin="normal"
                error={touched.selectedFields && Boolean(errors.selectedFields)}
              >
                <InputLabel id="fields-select-label">Select Fields</InputLabel>
                <Select
                  labelId="fields-select-label"
                  multiple
                  name="selectedFields"
                  value={values.selectedFields}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.length <= 2) {
                      setFieldValue(
                        "selectedFields",
                        typeof value === "string" ? value.split(",") : value
                      );
                    }
                  }}
                  input={<OutlinedInput label="Select Fields" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                  disabled={!values.objectName || !permissionValues?.edit}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 48 * 4.5,
                        width: 250,
                      },
                    },
                  }}
                >
                  {fields.map((field) => {
                    const fieldName = field.Field || field;
                    return (
                      <MenuItem
                        key={fieldName}
                        value={fieldName}
                        style={{
                          fontWeight:
                            values.selectedFields?.indexOf(fieldName) === -1
                              ? "normal"
                              : "bold",
                        }}
                      >
                        {fieldName}
                      </MenuItem>
                    );
                  })}
                </Select>
                {touched.selectedFields && errors.selectedFields && (
                  <Box
                    sx={{ color: "error.main", fontSize: "0.75rem", mt: 0.5 }}
                  >
                    {errors.selectedFields}
                  </Box>
                )}
              </FormControl>

              <TextField
                disabled={!permissionValues?.edit}
                select
                fullWidth
                margin="normal"
                name="chartType"
                label="Chart Type"
                value={values.chartType}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.chartType && Boolean(errors.chartType)}
                helperText={touched.chartType && errors.chartType}
              >
                <MenuItem value="bar">Bar Chart</MenuItem>
                <MenuItem value="line">Line Chart</MenuItem>
                <MenuItem value="pie">Pie Chart</MenuItem>
              </TextField>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button
                disabled={!permissionValues?.edit}
                type="submit"
                variant="contained"
                color="primary"
              >
                {isEditing ? "Update" : "Create"}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};
