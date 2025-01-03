import { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { CssBaseline, ThemeProvider, Box } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import LoginLayoutIndex from "./scenes/shared/Layout/LoginLayoutIndex";
import LogoutLayoutIndex from "./scenes/shared/Layout/LogOutLayoutIndex";
import AppNavbar from "../src/components/common/navbar/AppNavbar";

function App() {
  const [theme, colorMode] = useMode();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {sessionStorage.getItem("token") ? (
          <Box sx={{ display: "flex", minHeight: "100vh" }}>
            <AppNavbar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                p: { xs: 1, sm: 2, md: 3 },
                ml: {
                  xs: 0,
                  md: isExpanded ? "300px" : "73px",
                },
                mt: { xs: "64px", md: 0 },
                transition:
                  "margin-left 0.2s ease-in-out, width 0.2s ease-in-out",
                backgroundColor: "#f5f5f5",
                minHeight: "100vh",
                width: {
                  xs: "100%",
                  md: `calc(100% - ${isExpanded ? "300px" : "73px"})`,
                },
                overflow: "auto",
              }}
            >
              <LoginLayoutIndex />
            </Box>
          </Box>
        ) : (
          <LogoutLayoutIndex />
        )}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
