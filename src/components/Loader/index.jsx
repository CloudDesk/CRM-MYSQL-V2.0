import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

const Loader = ({
  size = 60,
  thickness = 4,
  color = "primary",
  message = "Loading...",
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        width: "100%",
        minHeight: "200px",
        padding: 2,
      }}
    >
      <CircularProgress color={color} size={size} thickness={thickness} />
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          marginTop: 2,
          fontWeight: 500,
        }}
      >
        {message}
      </Typography>
    </Box>
  );
};

export default Loader;
