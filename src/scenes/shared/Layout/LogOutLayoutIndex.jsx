import React from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import LoginIndex from "../../modules/login/LoginIndex"
import SignUpIndex from "../../modules/login/SignUpIndex";
import ForgotPasswordIndex from "../../modules/login/ForgotPassword";
import ConfirmPasswordIndex from "../../modules/login/ConfirmPasswordIndex";
import NoUserNameFound from "../../modules/login/NoUserNameFound";
import OTPVerification from "../../modules/login/OTPVerification";

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
        <Route path="/sign-up" element={<SignUpIndex />} />
        <Route path="/forgot-password" element={<ForgotPasswordIndex />} />
        <Route path="/confirm-password" element={<ConfirmPasswordIndex />} />
        <Route path="/noUserFound" element={<NoUserNameFound />} />
        <Route path="/otp" element={<OTPVerification />} />
      </Routes>
    </>
  );
}

export default LogoutLayoutIndex;
