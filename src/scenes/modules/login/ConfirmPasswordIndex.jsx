import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
    Box,
    Button,
    Paper,
    Avatar,
    Typography,
    Container
} from "@mui/material";
import Cdlogo from "../../../assets/cdlogo.jpg"
import ToastNotification from "../../shared/toast/ToastNotification";
import { RequestServer } from "../../api/HttpReq";

const singupUrl = `/UpsertUser`;

export default function ConfirmPasswordIndex() {
    const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' });
    const location = useLocation();
    const navigate = useNavigate();

    const styles = {
        container: {
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            padding: '20px'
        },
        paper: {
            padding: '40px',
            borderRadius: '15px',
            boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
            width: '100%',
            maxWidth: '400px',
            margin: '0 auto',
            background: 'rgba(255, 255, 255, 0.95)'
        },
        logo: {
            width: 80,
            height: 80,
            margin: '0 auto 20px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
        },
        title: {
            marginBottom: '30px',
            color: '#333',
            fontWeight: 600
        },
        inputContainer: {
            marginBottom: '20px'
        },
        input: {
            width: '100%',
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid #e0e0e0',
            fontSize: '16px',
            marginTop: '8px',
            transition: 'border-color 0.3s',
            '&:focus': {
                borderColor: '#1976d2',
                outline: 'none'
            }
        },
        errorText: {
            color: '#f44336',
            fontSize: '14px',
            marginTop: '5px'
        },
        button: {
            width: '100%',
            padding: '12px',
            borderRadius: '8px',
            fontSize: '16px',
            textTransform: 'none',
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
        }
    };

    // Ensure location state exists before accessing
    const initialValues = location.state?.record?.item?.[0] ? {
        userName: location.state.record.item[0].userName,
        email: location.state.record.item[0].email,
        password: '',
        confirmPassword: '',
        departmentName: location.state.record.item[0].departmentName,
        roleDetails: location.state.record.item[0].roleDetails,
        access: location.state.record.item[0].access,
        phone: location.state.record.item[0].phone,
        role: location.state.record.item[0].role,
        _id: location.state.record.item[0]._id,
        firstName: location.state.record.item[0].firstName,
        lastName: location.state.record.item[0].lastName,
        createdDate: location.state.record.item[0].createdDate,
        modifiedDate: location.state.record.item[0].modifiedDate,
        createdBy: location.state.record.item[0].createdBy,
        modifiedBy: location.state.record.item[0].modifiedBy,
    } : {};

    const validationSchema = Yup.object({
        email: Yup
            .string()
            .email('Enter Valid Email Id')
            .required('Required'),
        password: Yup
            .string()
            .min(6, "Minimum 6 characters exist")
            .max(15, "Maximum 15 characters exist")
            .required('Please enter your password.'),
        confirmPassword: Yup.string()
            .required('Please re-enter your password.')
            .oneOf([Yup.ref('password')], 'Your passwords do not match.')
    });

    const formSubmission = async (values) => {
        console.log(values, "values");
        const submissionValues = { ...values };
        submissionValues.userName = submissionValues.email;
        delete submissionValues.confirmPassword;

        RequestServer("post", singupUrl, submissionValues)
            .then((res) => {
                if (res.success) {
                    setNotify({
                        isOpen: true,
                        message: res.data,
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
                setNotify({
                    isOpen: true,
                    message: error.message,
                    type: 'error'
                });
            })
            .finally(() => {
                setTimeout(() => {
                    navigate('/');
                }, 2000);
            });
    };

    return (
        <Box sx={styles.container}>
            <Container maxWidth="sm">
                <Paper elevation={0} sx={styles.paper}>
                    <ToastNotification notify={notify} setNotify={setNotify} />

                    <Box sx={{ textAlign: 'center' }}>
                        <Avatar sx={styles.logo}>
                            <img src={Cdlogo} alt="logo" style={{ width: '100%', height: '100%' }} />
                        </Avatar>
                        <Typography variant="h4" sx={styles.title}>
                            Setup New Password
                        </Typography>
                    </Box>

                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={(values) => formSubmission(values)}
                    >
                        {(props) => {
                            const { isValid } = props;
                            return (
                                <Form>
                                    <Box sx={styles.inputContainer}>
                                        <Typography variant="subtitle2" gutterBottom>
                                            Email/User Name <span style={{ color: 'red' }}>*</span>
                                        </Typography>
                                        <Field
                                            name="email"
                                            type="email"
                                            style={styles.input}
                                            readOnly
                                        />
                                        <ErrorMessage
                                            name="email"
                                            component="div"
                                            style={styles.errorText}
                                        />
                                    </Box>

                                    <Box sx={styles.inputContainer}>
                                        <Typography variant="subtitle2" gutterBottom>
                                            New Password <span style={{ color: 'red' }}>*</span>
                                        </Typography>
                                        <Field
                                            name="password"
                                            type="password"
                                            style={styles.input}
                                        />
                                        <ErrorMessage
                                            name="password"
                                            component="div"
                                            style={styles.errorText}
                                        />
                                    </Box>

                                    <Box sx={styles.inputContainer}>
                                        <Typography variant="subtitle2" gutterBottom>
                                            Confirm New Password <span style={{ color: 'red' }}>*</span>
                                        </Typography>
                                        <Field
                                            name="confirmPassword"
                                            type="password"
                                            style={styles.input}
                                        />
                                        <ErrorMessage
                                            name="confirmPassword"
                                            component="div"
                                            style={styles.errorText}
                                        />
                                    </Box>

                                    <Button
                                        type="submit"
                                        variant="contained"
                                        disabled={!isValid}
                                        sx={styles.button}
                                    >
                                        Sign Up
                                    </Button>
                                </Form>
                            );
                        }}
                    </Formik>

                    <Box sx={{ textAlign: 'center', mt: 3 }}>
                        <Link
                            to="/"
                            style={{
                                color: '#1976d2',
                                textDecoration: 'none',
                                '&:hover': {
                                    textDecoration: 'underline'
                                }
                            }}
                        >
                            Back to Sign In
                        </Link>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
}