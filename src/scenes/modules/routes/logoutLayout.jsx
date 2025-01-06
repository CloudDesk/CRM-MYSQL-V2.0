import React from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import LoginIndex from "../login/LoginIndex";
import ForgotPasswordIndex from "../login/ForgotPassword";
import ConfirmPasswordIndex from "../login/ConfirmPasswordIndex";
import OTPVerification from "../login/OTPVerification";

function LogoutLayoutIndex() {
    const navigate = useNavigate();
    const handleAuthentication = () => {
        navigate("/");
    };

    return (
        <>
            <Routes>
                <Route
                    path="/"
                    element={<LoginIndex onAuthentication={handleAuthentication} />}
                />
                <Route path="/forgot-password" element={<ForgotPasswordIndex />} />
                <Route path="/confirm-password" element={<ConfirmPasswordIndex />} />
                <Route path="/otp" element={<OTPVerification />} />
            </Routes>
        </>
    );
}

export default LogoutLayoutIndex;
