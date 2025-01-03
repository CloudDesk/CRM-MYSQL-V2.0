import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate, Link } from 'react-router-dom';
import {
    Grid,
    Button,
    Paper,
    Avatar,
    Typography,
    Box,
    Container,
    IconButton
} from "@mui/material";
import { Visibility, VisibilityOff } from '@mui/icons-material';
// import '../recordDetailPage/Form.css'
import Cdlogo from "../../../assets/cdlogo.jpg"
import { RequestServer } from "../../api/HttpReq";

const singupUrl = `/signup`

export default function SignUpIndex() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
            maxWidth: '500px',
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

    const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

    const validationSchema = Yup.object({
        email: Yup
            .string()
            .email('Enter Valid Email Id')
            .required('Required'),
        fullName: Yup.string().required('Required'),
        phone: Yup
            .string()
            .matches(phoneRegExp, 'Phone number is not valid')
            .min(10, "Phone number must be 10 characters")
            .max(10, "Phone number must be 10 characters"),
        password: Yup
            .string()
            .min(6, "Minimum 6 characters required")
            .max(15, "Maximum 15 characters allowed")
            .required('Please enter your password'),
        confirmPassword: Yup.string()
            .required('Please confirm your password')
            .oneOf([Yup.ref('password')], 'Passwords do not match')
    });

    const formSubmission = async (values, { resetForm }) => {
        values.userName = values.email;
        delete values.confirmPassword;

        RequestServer(singupUrl, values)
            .then((res) => {
                console.log(res.data, "sign up response")
                navigate('/');
            })
            .catch((err) => {
                console.log(err, "error")
            });
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
                            Create Account
                        </Typography>
                    </Box>

                    <Formik
                        initialValues={{
                            email: '',
                            fullName: '',
                            phone: '',
                            password: '',
                            confirmPassword: ''
                        }}
                        validationSchema={validationSchema}
                        onSubmit={formSubmission}
                    >
                        {({ isValid }) => (
                            <Form>
                                <Box sx={styles.field}>
                                    <Typography variant="subtitle2" gutterBottom>
                                        Full Name
                                    </Typography>
                                    <Field
                                        name="fullName"
                                        style={styles.input}
                                        placeholder="Enter your full name"
                                    />
                                    <ErrorMessage name="fullName" component="div" style={styles.errorText} />
                                </Box>

                                <Box sx={styles.field}>
                                    <Typography variant="subtitle2" gutterBottom>
                                        Email Address
                                    </Typography>
                                    <Field
                                        name="email"
                                        type="email"
                                        style={styles.input}
                                        placeholder="Enter your email"
                                    />
                                    <ErrorMessage name="email" component="div" style={styles.errorText} />
                                </Box>

                                <Box sx={styles.field}>
                                    <Typography variant="subtitle2" gutterBottom>
                                        Phone Number
                                    </Typography>
                                    <Field
                                        name="phone"
                                        style={styles.input}
                                        placeholder="Enter your phone number"
                                    />
                                    <ErrorMessage name="phone" component="div" style={styles.errorText} />
                                </Box>

                                <Box sx={styles.field}>
                                    <Typography variant="subtitle2" gutterBottom>
                                        Password
                                    </Typography>
                                    <Field name="password">
                                        {({ field }) => (
                                            <div style={{ position: 'relative' }}>
                                                <input
                                                    {...field}
                                                    type={showPassword ? 'text' : 'password'}
                                                    style={styles.input}
                                                    placeholder="Create password"
                                                />
                                                <IconButton
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    style={{
                                                        position: 'absolute',
                                                        right: '10px',
                                                        top: '50%',
                                                        transform: 'translateY(-50%)'
                                                    }}
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </div>
                                        )}
                                    </Field>
                                    <ErrorMessage name="password" component="div" style={styles.errorText} />
                                </Box>

                                <Box sx={styles.field}>
                                    <Typography variant="subtitle2" gutterBottom>
                                        Confirm Password
                                    </Typography>
                                    <Field name="confirmPassword">
                                        {({ field }) => (
                                            <div style={{ position: 'relative' }}>
                                                <input
                                                    {...field}
                                                    type={showConfirmPassword ? 'text' : 'password'}
                                                    style={styles.input}
                                                    placeholder="Confirm password"
                                                />
                                                <IconButton
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    style={{
                                                        position: 'absolute',
                                                        right: '10px',
                                                        top: '50%',
                                                        transform: 'translateY(-50%)'
                                                    }}
                                                >
                                                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </div>
                                        )}
                                    </Field>
                                    <ErrorMessage name="confirmPassword" component="div" style={styles.errorText} />
                                </Box>

                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={!isValid}
                                    sx={styles.button}
                                >
                                    Sign Up
                                </Button>

                                <Box sx={{ textAlign: 'center', mt: 3 }}>
                                    <Typography variant="body2">
                                        Already have an account?{' '}
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
                                            Sign In
                                        </Link>
                                    </Typography>
                                </Box>
                            </Form>
                        )}
                    </Formik>
                </Paper>
            </Container>
        </Box>
    );
}
