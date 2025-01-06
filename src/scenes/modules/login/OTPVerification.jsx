import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
    Box,
    Button,
    Paper,
    Avatar,
    Typography,
    Container
} from "@mui/material";
import OtpInput from 'react-otp-input';
import Cdlogo from "../../../assets/cdlogo.jpg"
import { RequestServer } from "../../api/HttpReq";
import { appConfig } from "../../../config/appConfig";

const generateotpUrl = `/generateOTP`;

const CONSTANTS = {
    authLogin: appConfig.api.auth.login,
    generateotpUrl: appConfig.api.auth.generateOTP,
    confirmPassword: appConfig.api.auth.confirmPassword
}
export default function OTPVerification() {
    const navigate = useNavigate();
    const location = useLocation();
    const isRunned = useRef(false);
    const [otp, setOtp] = useState('');
    const [isResendOtpClicked, setIsResendOtpClicked] = useState(false);
    const [otpError, setOtpError] = useState(false);

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
        subtitle: {
            color: '#666',
            marginBottom: '30px',
            textAlign: 'center'
        },
        otpContainer: {
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '20px'
        },
        actionContainer: {
            display: 'flex',
            flexDirection: 'column',
            gap: '15px'
        },
        button: {
            width: '100%',
            padding: '12px',
            borderRadius: '8px',
            fontSize: '16px',
            textTransform: 'none',
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
        },
        errorText: {
            color: '#f44336',
            textAlign: 'center',
            marginBottom: '15px'
        }
    };

    const otpInputStyle = {
        width: '50px',
        height: '50px',
        margin: '0 5px',
        fontSize: '20px',
        borderRadius: '8px',
        border: '1px solid #e0e0e0',
        textAlign: 'center'
    };

    useEffect(() => {
        if (isRunned.current) return;
        isRunned.current = true;
        handleSendEmailId();
    }, []);

    const handleSendEmailId = () => {
        RequestServer("post", CONSTANTS.generateotpUrl, { emailId: location.state.record.item[0].email })
            .then((res) => {
                console.log(res.data, "otp email res");
            })
            .catch((err) => {
                console.log(err, "otp email error");
            });
    };

    const handleSendOtp = () => {
        RequestServer("post", CONSTANTS.generateotpUrl, { otp: otp })
            .then((res) => {
                console.log(res.data, "otp RES");
                if (res.data.status === 'success') {
                    const item = location.state.record.item;
                    navigate(CONSTANTS.confirmPassword, { state: { record: { item } } });
                } else {
                    setOtpError(true);
                }
            })
            .catch((err) => {
                console.log(err, "error");
                setOtpError(true);
            });
    };

    const handleResendOtp = () => {
        setIsResendOtpClicked(true);
        setOtp('');
        setOtpError(false);
        handleSendEmailId();
    };

    const handleOtpChange = (otp) => {
        setOtp(otp);
        setOtpError(false);
    };

    return (
        <Box sx={styles.container}>
            <Container maxWidth="sm">
                <Paper elevation={0} sx={styles.paper}>
                    <Box sx={{ textAlign: 'center' }}>
                        <Avatar sx={styles.logo}>
                            <img src={Cdlogo} alt="logo" style={{ width: '100%', height: '100%' }} />
                        </Avatar>
                        <Typography variant="h4" sx={styles.title}>
                            Verify OTP
                        </Typography>
                        <Typography variant="body1" sx={styles.subtitle}>
                            Please enter the 4-digit code sent to your email
                        </Typography>
                    </Box>

                    <Box sx={styles.otpContainer}>
                        <OtpInput
                            value={otp}
                            onChange={handleOtpChange}
                            numInputs={4}
                            isInputNum={true}
                            shouldAutoFocus
                            renderInput={(props) => <input {...props} />}
                            inputStyle={otpInputStyle}
                        />
                    </Box>

                    {otpError && (
                        <Typography sx={styles.errorText}>
                            Invalid OTP. Please try again.
                        </Typography>
                    )}

                    <Box sx={styles.actionContainer}>
                        <Button
                            variant="contained"
                            onClick={handleSendOtp}
                            disabled={otp.length !== 4}
                            sx={styles.button}
                        >
                            Verify OTP
                        </Button>

                        <Button
                            variant="outlined"
                            onClick={handleResendOtp}
                            disabled={isResendOtpClicked}
                            sx={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '8px',
                                textTransform: 'none'
                            }}
                        >
                            Resend OTP
                        </Button>
                    </Box>

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
                </Paper>
            </Container>
        </Box>
    );
}