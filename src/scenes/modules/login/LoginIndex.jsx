import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import {
  Button,
  Paper,
  Avatar,
  Typography,
  Box,
  Container,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Cdlogo from "../../../assets/cdlogo.jpg"
import { RequestServer } from "../../api/HttpReq";
import { useAuth } from "../../hooks/useAuth";
import { appConfig } from "../../../config/appConfig";

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
    padding: "20px",
  },
  paper: {
    padding: "40px",
    borderRadius: "15px",
    boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "400px",
    margin: "0 auto",
    background: "rgba(255, 255, 255, 0.95)",
  },
  logo: {
    width: 80,
    height: 80,
    margin: "0 auto 20px",
    padding: "0",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
  },
  title: {
    marginBottom: "30px",
    color: "#333",
    fontWeight: 600,
  },
  field: {
    marginBottom: "20px",
  },
  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #e0e0e0",
    fontSize: "16px",
    transition: "border-color 0.3s",
    "&:focus": {
      borderColor: "#1976d2",
      outline: "none",
    },
  },
  button: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    fontSize: "16px",
    textTransform: "none",
    marginTop: "20px",
    background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
    boxShadow: "0 3px 5px 2px rgba(33, 203, 243, .3)",
  },
  forgotPassword: {
    marginTop: "20px",
    textAlign: "center",
    color: "#1976d2",
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    },
  },
  errorText: {
    color: "#f44336",
    marginTop: "5px",
    fontSize: "14px",
  },
};

const CONSTANTS = {
  signIn: appConfig.api.auth.signin,
  urlPermission: appConfig.api.auth.rolePermission,
  forgotPassword: appConfig.api.auth.forgotPassword
}

export default function LoginIndex() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState({
    isError: false, message: ""
  });
  const { login } = useAuth();


  const validationSchema = Yup.object({
    userName: Yup.string().email().required("Required"),
    password: Yup.string()
      .min(6, "Minimum 6 characters exist")
      .max(15, "Maximum 15 characters exist")
      .required("Required"),
  });

  const formSubmission = async (values, { resetForm }) => {
    console.log("inside form Submission", values);
    let url = `${CONSTANTS.signIn}/${values.userName}/${values.password}`;

    try {
      const res = await RequestServer("get", url, {});
      console.log(res, "res from login formsubmission");
      if (res.success) {
        console.log(res.data.userDetails, "userDetails");
        setError({ isError: false, message: "" });
        let obj = {
          userId: res.data.userDetails[0]._id,
          userName: res.data.userDetails[0].username,
          userFullName:
            res.data.userDetails[0].firstname +
            " " +
            res.data.userDetails[0].lastname,
          userRole: res.data.userDetails[0].roledetails,
          userDepartment: res.data.userDetails[0].departmentname,
        };
        sessionStorage.setItem("token", res.data.content);
        sessionStorage.setItem("loggedInUser", JSON.stringify(obj));
        getPermissions(res.data.userDetails[0].roledetails, res.data.content);
      } else {
        setError({ isError: true, message: res.error.message || "Something went wrong. Please try again." });
      }
    } catch (err) {
      console.log(err, "error");
      setError({ isError: true, message: err.message || "Something went wrong. Please try again." });
    }
  };

  const getPermissions = (userRoleDpt, token) => {
    console.log("inside getPermissions user Role Dpt", userRoleDpt);

    let url = `${CONSTANTS.urlPermission}${userRoleDpt}`;
    // sendRolePermission?roledetails=Admin
    RequestServer("get", url, {})
      .then((res) => {
        console.log("urlPermission INDEX page", res);
        if (res.success) {
          sessionStorage.setItem("userPermissions", res.data[0].permissionsets);
          // onAuthentication();
          // onAuthentication()
          login(token)
        } else {
          console.log(res.error.message);
        }
      })
      .catch((err) => {
        console.log(err.message, "ERROR");
      });
  };

  return (
    <Box sx={styles.container}>
      <Container maxWidth="sm">
        <Paper elevation={0} sx={styles.paper}>
          <Box sx={{ textAlign: "center" }}>
            <Avatar sx={styles.logo}>
              <img
                src={Cdlogo}
                alt="logo"
                style={{ width: "100%", height: "100%" }}
              />
            </Avatar>
            <Typography variant="h4" sx={styles.title}>
              Welcome Back
            </Typography>
          </Box>

          <Formik
            initialValues={{ userName: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={formSubmission}
          >
            {({ isValid, setFieldValue }) => (
              <Form>
                <Box sx={styles.field}>
                  <Typography variant="subtitle2" gutterBottom
                    component="label"
                    style={{ fontWeight: "bold", fontSize: "0.8rem" }}
                  >
                    Email Address
                  </Typography>
                  <Field
                    name="userName"
                    type="email"
                    style={styles.input}
                    placeholder="Enter your email"
                    onChange={(e) => {
                      setFieldValue("userName", e.target.value);
                    }}
                  />
                  <ErrorMessage
                    name="userName"
                    component="div"
                    style={styles.errorText}
                  />
                </Box>

                <Box sx={styles.field}>
                  <Typography variant="subtitle2" gutterBottom
                    component="label"
                    style={{ fontWeight: "bold", fontSize: "0.8rem" }}
                  >
                    Password
                  </Typography>
                  <Field name="password">
                    {({ field }) => (
                      <div style={{ position: "relative" }}>
                        <input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          style={styles.input}
                          placeholder="Enter your password"
                        />
                        <IconButton
                          className="view-password"
                          aria-label={showPassword ? "Hide password" : "Show password"}
                          onClick={() => setShowPassword(!showPassword)}
                          style={{
                            position: "absolute",
                            right: "10px",
                            top: "50%",
                            transform: "translateY(-50%)",
                          }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </div>
                    )}
                  </Field>
                  <ErrorMessage
                    name="password"
                    component="div"
                    style={styles.errorText}
                  />
                </Box>

                {error.isError && (
                  <Typography color="error" sx={{ mt: 2, textAlign: "center" }}>
                    {error.message}
                  </Typography>
                )}

                <Button
                  type="submit"
                  variant="contained"
                  disabled={!isValid}
                  sx={styles.button}
                >
                  Sign In
                </Button>

                <Box sx={{ textAlign: "center", mt: 3 }}>
                  <Link
                    to={CONSTANTS.forgotPassword}
                    style={{
                      color: "#1976d2",
                      textDecoration: "none",
                      "&:hover": {
                        textDecoration: "underline",
                      },
                    }}
                  >
                    Forgot password?
                  </Link>
                </Box>
              </Form>
            )}
          </Formik>
        </Paper>
      </Container>
    </Box>
  );
}
