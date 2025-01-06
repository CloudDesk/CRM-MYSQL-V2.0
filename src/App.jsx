/*import { Suspense, useEffect, useState } from 'react';
import { CssBaseline, ThemeProvider, Box, CircularProgress } from '@mui/material';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ColorModeContext, useMode } from './theme';
import AppNavbar from '../src/components/common/navbar/AppNavbar';
import { authenticatedRoutes, unauthenticatedRoutes } from './routesConfig'
import Error404 from './components/UI/Error/Error404';

const LoadingFallback = () => (
  <Box sx={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh'
  }}>
    <CircularProgress />
  </Box>
);

const AuthenticatedLayout = ({ isExpanded, setIsExpanded, onLogout }) => {
  console.log("AuthenticatedLayout")
  const navigate = useNavigate();

  useEffect(() => {
    // Ensure we're on a valid authenticated route
    const currentPath = window.location.pathname;
    if (currentPath === '/') {
      navigate('/list/Dashboard');
    }
  }, [navigate]);


  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppNavbar isExpanded={isExpanded} setIsExpanded={setIsExpanded} onLogout={onLogout} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 1, sm: 2, md: 3 },
          ml: { xs: 0, md: isExpanded ? '300px' : '73px' },
          mt: { xs: '64px', md: 0 },
          transition: 'margin-left 0.2s ease-in-out, width 0.2s ease-in-out',
          backgroundColor: '#f5f5f5',
          minHeight: '100vh',
          width: { xs: '100%', md: `calc(100% - ${isExpanded ? '300px' : '73px'})` },
          overflow: 'auto',
        }}
      >
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {authenticatedRoutes.map(({ path, element: Element }) => (
              <Route key={path} path={path} element={<Element />} />
            ))}
            <Route path="*" element={<Error404 />} />
          </Routes>
        </Suspense>
      </Box>
    </Box>
  )
}

const UnauthenticatedLayout = ({ onLogin }) => {
  console.log("UnAuthenticatedLayout")
  const navigate = useNavigate();

  useEffect(() => {
    // Ensure we're on a valid unauthenticated route
    const currentPath = window.location.pathname;
    if (currentPath === '/') {
      navigate('/');
    }
  }, [navigate]);


  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {unauthenticatedRoutes.map(({ path, element: Element }) => (
          <Route key={path} path={path} element={<Element />} />
        ))}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}

function App() {
  const [theme, colorMode] = useMode();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    !!sessionStorage.getItem('token')
  );
  const navigate = useNavigate();

  // Handle login
  const handleLogin = () => {
    setIsAuthenticated(true);
    navigate('/list/Dashboard');
  };

  // Handle logout
  const handleLogout = () => {
    sessionStorage.clear();
    setIsAuthenticated(false);
    navigate('/');
  };
  // Listen for storage events (in case token is removed in another tab)
  useEffect(() => {
    const handleStorageChange = () => {
      const hasToken = !!sessionStorage.getItem('token');
      setIsAuthenticated(hasToken);
      if (!hasToken) {
        navigate('/');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [navigate]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {isAuthenticated ? (
          <AuthenticatedLayout isExpanded={isExpanded} setIsExpanded={setIsExpanded} onLogout={handleLogout} />
        ) : (
          <UnauthenticatedLayout onLogin={handleLogin} />
        )}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
*/

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
