import React, { useMemo, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Grid,
  Paper,
  Typography,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
  Autocomplete,
  Switch,
  FormHelperText,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { RequestServer } from "../../scenes/api/HttpReq";

// const elegantTheme = createTheme({
//   palette: {
//     primary: {
//       main: "#3A5A8C", // Deep, sophisticated blue
//       light: "#6B8EAF",
//       dark: "#1E3A5F",
//     },
//     background: {
//       default: "#F5F7FA", // Soft, light background
//       paper: "#FFFFFF",
//     },
//     text: {
//       primary: "#2C3E50", // Deep, professional text color
//       secondary: "#5D6D7E",
//     },
//     error: {
//       main: "#C0392B", // Refined error red
//     },
//   },
//   typography: {
//     // fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
//     h4: {
//       fontWeight: 600,
//       color: "#2C3E50",
//       letterSpacing: "-0.5px",
//     },
//     body1: {
//       lineHeight: 1.6,
//     },
//   },
//   components: {
//     MuiPaper: {
//       styleOverrides: {
//         root: {
//           borderRadius: 12,
//           boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
//           padding: "32px",
//         },
//       },
//     },
//     MuiTextField: {
//       styleOverrides: {
//         root: {
//           "& .MuiOutlinedInput-root": {
//             borderRadius: 10,
//             "&:hover .MuiOutlinedInput-notchedOutline": {
//               borderColor: "#3A5A8C",
//             },
//             "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
//               borderColor: "#3A5A8C",
//               borderWidth: 2,
//             },
//             "& .MuiInputBase-input": {
//               fontWeight: 700, // Makes the input text bolder
//               color: "#2C3E50", // Ensures the text color aligns with your theme
//             },
//           },
//         },
//       },
//     },
//     MuiSelect: {
//       styleOverrides: {
//         root: {
//           "& .MuiSelect-select": {
//             fontWeight: 700, // Bold text for selected value
//             color: "#2C3E50", // Ensure text color matches theme
//           },
//         },
//       },
//     },
//     MuiAutocomplete: {
//       styleOverrides: {
//         root: {
//           "& .MuiInputBase-root": {
//             fontWeight: 700, // Bold text for input and selected values
//             color: "#2C3E50", // Align text color with theme
//           },
//           "& .MuiAutocomplete-option": {
//             fontWeight: 500, // Slightly bold text for dropdown options
//             color: "#2C3E50", // Option text color
//           },
//           "& .Mui-focused": {
//             fontWeight: 700, // Bold text when focused
//           },
//         },
//       },
//     },
//     MuiButton: {
//       styleOverrides: {
//         root: {
//           borderRadius: 10,
//           textTransform: "none",
//           fontWeight: 600,
//           padding: "12px 24px",
//           margin: "0 12px",
//           boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
//           transition: "all 0.3s ease",
//           "&:hover": {
//             transform: "translateY(-2px)",
//             boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
//           },
//         },
//         containedPrimary: {
//           backgroundColor: "#3A5A8C",
//           "&:hover": {
//             backgroundColor: "#1E3A5F",
//           },
//         },
//       },
//     },
//   },
// });

const elegantTheme = createTheme({
  palette: {
    primary: {
      main: "#3A5A8C",
      light: "#6B8EAF",
      dark: "#1E3A5F",
    },
    secondary: {
      main: "#8E44AD", // Complementary purple
    },
    background: {
      default: "#F5F7FA",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#2C3E50",
      secondary: "#5D6D7E",
    },
    error: {
      main: "#C0392B",
    },
    success: {
      main: "#27AE60", // Green for success messages
    },
    warning: {
      main: "#F39C12", // Amber for warnings
    },
  },
  typography: {
    // fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: "2.125rem",
      letterSpacing: "-0.8px",
    },
    h4: {
      fontWeight: 600,
      color: "#2C3E50",
      letterSpacing: "-0.5px",
    },
    body1: {
      lineHeight: 1.6,
      color: "#5D6D7E",
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
          padding: "32px",
          transition: "box-shadow 0.3s ease",
          "&:hover": {
            boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            // borderRadius: 10,
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#3A5A8C",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#1E3A5F",
              borderWidth: 2,
            },
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 5,
          textTransform: "none",
          fontWeight: 600,
          padding: "12px 24px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
          },
        },
        containedPrimary: {
          backgroundColor: "#3A5A8C",
          "&:hover": {
            backgroundColor: "#1E3A5F",
          },
        },
      },
    },
  },
});

// Utility to generate dynamic validation schema
const generateValidationSchema = (fields) => {
  const schemaFields = {};

  fields.forEach((field) => {
    let validator = field.validator || Yup.mixed();

    if (field.required) {
      validator = validator.required(`${field.label} is required`);
    }

    schemaFields[field.name] = validator;
  });

  return Yup.object().shape(schemaFields);
};

// Dynamic Form Field Renderer
const DynamicFormField = ({
  field,
  formik,
  customComponents = {},
  permissionValues,
}) => {
  const { values, errors, touched, handleChange, setFieldValue } = formik;
  console.log(values, "values in DynamicFormField");
  const [dynamicOptions, setDynamicOptions] = useState([]);

  const fetchAutocompleteOptions = async (searchTerm) => {
    if (!field.fetchurl) return;
    let fetchurl;
    // if (field.fetchurl && field.searchfor) {
    //   fetchurl = `${field.fetchurl}?${field.searchfor}=${searchTerm}`;
    // } else {
    fetchurl = `${field.fetchurl}`;
    // }
    try {
      const response = await RequestServer("get", fetchurl);
      console.log(response.data, "response from fetchAutocompleteOptions");
      const updatedData = response.data.map((item) => {
        return {
          id: item._id,
          label: item[field.searchfor],
        };
      });
      setDynamicOptions(updatedData || []);
    } catch (error) {
      console.error("Error fetching autocomplete options:", error);
    }
  };

  // Custom component renderer
  if (customComponents[field.type]) {
    const CustomComponent = customComponents[field.type];
    return <CustomComponent field={field} formik={formik} />;
  }

  switch (field.type) {
    case "text":
    case "email":
    case "number":
    case "password":
    case "tel":
    case "url":
      return (
        <TextField
          fullWidth
          variant={field.variant || "outlined"}
          name={field.name}
          label={field.label}
          type={field.type}
          value={values[field.name] || ""}
          onChange={handleChange}
          error={touched[field.name] && Boolean(errors[field.name])}
          helperText={touched[field.name] && errors[field.name]}
          disabled={!permissionValues.edit}
          {...field.props}
        />
      );

    case "select":
      return (
        <FormControl
          fullWidth
          error={touched[field.name] && Boolean(errors[field.name])}
          disabled={!permissionValues.edit}
        >
          <InputLabel>{field.label}</InputLabel>
          <Select
            disabled={!permissionValues.edit}
            name={field.name}
            label={field.label}
            value={values[field.name] || ""}
            onChange={handleChange}
            {...field.props}
          >
            {field.options.map((option) => (
              <MenuItem key={option.text} value={option.value}>
                {option.value}
              </MenuItem>
            ))}
          </Select>
          {touched[field.name] && errors[field.name] && (
            <FormHelperText>{errors[field.name]}</FormHelperText>
          )}
        </FormControl>
      );

    case "radio":
      return (
        <FormControl
          component="fieldset"
          error={touched[field.name] && Boolean(errors[field.name])}
          disabled={!permissionValues.edit}
        >
          <RadioGroup
            name={field.name}
            value={values[field.name] || ""}
            onChange={handleChange}
            {...field.props}
          >
            {field.options.map((option) => (
              <FormControlLabel
                disabled={!permissionValues.edit}
                key={option.value}
                value={option.value}
                control={<Radio />}
                label={option.label}
              />
            ))}
          </RadioGroup>
          {touched[field.name] && errors[field.name] && (
            <FormHelperText>{errors[field.name]}</FormHelperText>
          )}
        </FormControl>
      );

    case "checkbox":
      return (
        <FormControlLabel
          control={
            <Checkbox
              disabled={!permissionValues.edit}
              checked={!!values[field.name]}
              onChange={(e) => setFieldValue(field.name, e.target.checked)}
              {...field.props}
            />
          }
          label={field.label}
        />
      );

    case "switch":
      return (
        <FormControlLabel
          control={
            <Switch
              disabled={!permissionValues.edit}
              checked={!!values[field.name]}
              onChange={(e) => setFieldValue(field.name, e.target.checked)}
              {...field.props}
            />
          }
          label={field.label}
        />
      );

    case "autocomplete":
      return (
        <Autocomplete
          disabled={!permissionValues.edit}
          options={field.fetchurl ? dynamicOptions : field.options || []}
          getOptionLabel={(option) =>
            typeof option === "string" ? option : option.label || option.value
          }
          value={values[field.name] || null}
          onInputChange={(_, newValue) => {
            if (field.fetchurl) fetchAutocompleteOptions(newValue);
          }}
          onChange={(_, newValue) => {
            setFieldValue(field.name, newValue);
          }}
          renderInput={(params) => (
            <TextField
              disabled={!permissionValues.edit}
              {...params}
              name={field.name}
              label={field.label}
              error={touched[field.name] && Boolean(errors[field.name])}
              helperText={touched[field.name] && errors[field.name]}
              {...field.props}
            />
          )}
          {...field.autocompleteProps}
        />
      );

    case "date":
      return (
        <TextField
          fullWidth
          variant={field.variant || "outlined"}
          name={field.name}
          label={field.label}
          type="date"
          value={values[field.name] || ""}
          onChange={handleChange}
          error={touched[field.name] && Boolean(errors[field.name])}
          helperText={touched[field.name] && errors[field.name]}
          disabled={!permissionValues.edit}
          {...field.props}
        />
      );

    case "multiselect":
      return (
        <Autocomplete
          disabled={!permissionValues.edit}
          multiple
          options={field.options}
          getOptionLabel={(option) =>
            typeof option === "string" ? option : option.label || option.value
          }
          value={values[field.name] || []}
          onChange={(_, newValue) => {
            setFieldValue(field.name, newValue);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              disabled={!permissionValues.edit}
              name={field.name}
              label={field.label}
              error={touched[field.name] && Boolean(errors[field.name])}
              helperText={touched[field.name] && errors[field.name]}
              {...field.props}
            />
          )}
          {...field.autocompleteProps}
        />
      );

    default:
      return null;
  }
};

// Main Dynamic Form Component
export const DynamicForm = ({
  fields,
  initialValues = {},
  onSubmit,
  validationSchema,
  customComponents = {},
  submitButtonText = "Submit",
  formTitle,
  formProps = {},
  gridProps = { spacing: 2 },
  permissionValues,
}) => {
  console.log(permissionValues, "permissionValues in DynamicForm");
  // Generate validation schema if not provided
  const schema = useMemo(() => {
    return validationSchema || generateValidationSchema(fields);
  }, [fields, validationSchema]);

  const navigate = useNavigate();
  return (
    <ThemeProvider theme={elegantTheme}>
      <Paper
        elevation={3}
        sx={{
          maxWidth: 800,
          margin: "auto",
          ...formProps.paperSx,
        }}
      >
        {formTitle && (
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              mb: 3,
              textAlign: "center",
              borderBottom: "2px solid #3A5A8C",
              paddingBottom: 1.5,
            }}
          >
            {formTitle}
          </Typography>
        )}

        <Formik
          initialValues={initialValues}
          validationSchema={schema}
          onSubmit={onSubmit}
          enableReinitialize
        >
          {(formik) => (
            <Form {...formProps}>
              <Grid container {...gridProps} spacing={3}>
                {fields.map((field) => (
                  <Grid item xs={field.xs || 12} md={field.md} key={field.name}>
                    <DynamicFormField
                      field={field}
                      formik={formik}
                      customComponents={customComponents}
                      permissionValues={permissionValues}
                    />
                  </Grid>
                ))}

                <Grid
                  item
                  xs={12}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    mt: 2,
                    gap: 2,
                  }}
                >
                  <Button
                    disabled={!permissionValues.edit}
                    type="submit"
                    variant="contained"
                    color="primary"
                  >
                    {submitButtonText}
                  </Button>
                  <Button
                    onClick={() => navigate(-1)}
                    variant="outlined"
                    color="primary"
                  >
                    Cancel
                  </Button>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </Paper>
    </ThemeProvider>
  );
};
