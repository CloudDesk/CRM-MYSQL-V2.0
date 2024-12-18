import React from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
  CssBaseline,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";

const NoAccessPage = () => {
  const handleGoBack = () => {
    // Navigate back to previous page or home
    window.history.back();
  };

  return (
    <>
      <CssBaseline />
      <Container maxWidth="sm">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            textAlign: "center",
          }}
        >
          <Paper
            elevation={6}
            sx={{
              p: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              borderRadius: 2,
              backgroundColor: "rgba(255,255,255,0.9)",
            }}
          >
            <LockIcon
              sx={{
                fontSize: 100,
                color: "error.main",
                mb: 2,
              }}
            />
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{ fontWeight: "bold", color: "text.primary" }}
            >
              Access Denied
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" paragraph>
              You do not have permission to access this page. Please contact
              your system administrator if you believe this is an error.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleGoBack}
              sx={{
                mt: 2,
                textTransform: "none",
                px: 4,
                py: 1.5,
              }}
            >
              Go Back
            </Button>
          </Paper>
        </Box>
      </Container>
    </>
  );
};

export default NoAccessPage;
