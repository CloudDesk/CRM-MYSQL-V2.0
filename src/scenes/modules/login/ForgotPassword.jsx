import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate, Link } from 'react-router-dom';
import {
    Button,
    Paper,
    Avatar,
    Typography,
    Box,
    Container
} from "@mui/material";
// import '../recordDetailPage/Form.css'
import Cdlogo from "../../../assets/cdlogo.jpg"
import { RequestServer } from "../../api/HttpReq";
import { appConfig } from "../../../config/appConfig";


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
        padding: '0',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
    },
    title: {
        marginBottom: '30px',
        color: '#333',
        fontWeight: 600
    },
    subtitle: {
        color: '#666',
        marginBottom: '30px',
        textAlign: 'center'
    },
    field: {
        marginBottom: '20px'
    },
    input: {
        width: '100%',
        padding: '12px',
        borderRadius: '8px',
        border: '1px solid #e0e0e0',
        fontSize: '16px',
        transition: 'border-color 0.3s',
        '&:focus': {
            borderColor: '#1976d2',
            outline: 'none'
        }
    },
    button: {
        width: '100%',
        padding: '12px',
        borderRadius: '8px',
        fontSize: '16px',
        textTransform: 'none',
        marginTop: '20px',
        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
        boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
    },
    errorText: {
        color: '#f44336',
        marginTop: '5px',
        fontSize: '14px'
    }
};
const CONSTANTS = {
    checkExist: appConfig.objects.user.checkExist,
    authLogin: appConfig.api.auth.login,
    verifyOTP: appConfig.api.auth.verifyOTP
}

export default function ForgotPasswordIndex() {
    const [isUser, setIsUser] = useState(false);
    const navigate = useNavigate();
    const [error, setError] = useState({
        isError: false, message: ""
    });
    const validationSchema = Yup.object({
        userName: Yup
            .string()
            .email('Please enter a valid email')
            .required('Email is required'),
    });

    const formSubmission = async (values) => {
        try {
            const res = await RequestServer("get", `${CONSTANTS.checkExist}${values.userName}`);
            console.log(res, "res from forgotpassword formsubmission");

            if (res.data.status === "failure") {
                setError({ isError: true, message: "Email address not found. Please check and try again." });
                setIsUser(true);
            } else if (res.data.status === "success" || (res.success === true && res.data.length > 0)) {
                setError({ isError: false, message: "" });
                setIsUser(false);
                const item = res.data;
                navigate(CONSTANTS.verifyOTP, { state: { record: { item } } });
            } else {
                setError({ isError: true, message: "Email address not found. Please check and try again." });
            }
        } catch (err) {
            console.error(err, "error");
            setError({ isError: true, message: err.message || "Something went wrong. Please try again." });
        }
    }

    return (
        <Box sx={styles.container}>
            <Container maxWidth="sm">
                <Paper elevation={0} sx={styles.paper}>
                    <Box sx={{ textAlign: 'center' }}>
                        <Avatar sx={styles.logo}>
                            <img src={Cdlogo} alt="logo" style={{ width: '100%', height: '100%' }} />
                        </Avatar>
                        <Typography variant="h4" sx={styles.title}>
                            Forgot Password
                        </Typography>
                        <Typography variant="body1" sx={styles.subtitle}>
                            Enter your registered email address and we'll send you a code to reset your password
                        </Typography>
                    </Box>

                    <Formik
                        initialValues={{ userName: '' }}
                        validationSchema={validationSchema}
                        onSubmit={formSubmission}
                    >
                        {({ isValid, setFieldValue }) => (
                            <Form>
                                <Box sx={styles.field}>
                                    <Typography variant="subtitle2" gutterBottom>
                                        Email Address
                                    </Typography>
                                    <Field
                                        name="userName"
                                        type="email"
                                        style={styles.input}
                                        placeholder="Enter your email"
                                        onChange={(e) => {
                                            setFieldValue("userName", e.target.value);
                                            setIsUser(false);
                                        }}
                                    />
                                    <ErrorMessage name="userName" component="div" style={styles.errorText} />
                                    {error.isError && (
                                        <Typography color="error" sx={{ mt: 1, fontSize: '14px' }}>
                                            {error.message}
                                        </Typography>
                                    )}
                                </Box>

                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={!isValid}
                                    sx={styles.button}
                                >
                                    Send Reset Link
                                </Button>

                                <Box sx={{ textAlign: 'center', mt: 3 }}>
                                    <Link
                                        to={CONSTANTS.authLogin}
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
                            </Form>
                        )}
                    </Formik>
                </Paper>
            </Container>
        </Box>
    );
}


