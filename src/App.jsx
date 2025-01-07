import { useState, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { CssBaseline, ThemeProvider, Box } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import AppNavbar from './components/common/navbar/AppNavbar'
import { authRoutes, privateRoutes } from "./scenes/modules/routes/routes.config";
import Error404 from "./components/UI/Error/Error404";
import ProtectedRoute from "./scenes/modules/routes/ProtectedRoutes";
import Loader from "./components/UI/Loader";



function App() {
  const [theme, colorMode] = useMode();
  const [isExpanded, setIsExpanded] = useState(false);

  const PrivateLayout = ({ children }) => (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppNavbar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 1, sm: 2, md: 3 },
          ml: {
            xs: 0,
            md: isExpanded ? '300px' : '73px',
          },
          mt: { xs: '64px', md: 0 },
          transition: 'margin-left 0.2s ease-in-out, width 0.2s ease-in-out',
          backgroundColor: '#f5f5f5',
          minHeight: '100vh',
          width: {
            xs: '100%',
            md: `calc(100% - ${isExpanded ? '300px' : '73px'})`,
          },
          overflow: 'auto',
        }}
      >
        {children}
      </Box>
    </Box>
  );


  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Suspense fallback={<Loader />}>
          <Routes>
            {authRoutes.map(({ path, element: Element }) => (
              <Route
                key={path}
                path={path}
                element={
                  sessionStorage.getItem('token') ? (
                    <Navigate to="/" replace />
                  ) : (
                    <Element />
                  )
                }
              />
            ))}
            {privateRoutes.map(({ path, element: Element }) => (
              <Route
                key={path}
                path={path}
                element={
                  <ProtectedRoute>
                    <PrivateLayout>
                      <Element />
                    </PrivateLayout>
                  </ProtectedRoute>
                }
              />
            ))}
            {/* Catch all route */}
            <Route path="*" element={<Error404 />} />

          </Routes>
        </Suspense>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;

/* return (
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
   */
/*
import { Suspense, useEffect, useState } from 'react';
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
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to dashboard on mount if not already there
    if (window.location.pathname === '/') {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    onLogout();
    navigate('/');
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppNavbar
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
        onLogout={handleLogout}
      />
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
  );
};

const UnauthenticatedLayout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login on mount if not already there
    if (window.location.pathname === '/') {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {unauthenticatedRoutes.map(({ path, element: Element }) => (
          <Route
            key={path}
            path={path}
            element={
              <Element onLoginSuccess={() => {
                // Navigate to dashboard after successful login
                navigate('/dashboard');
              }} />
            }
          />
        ))}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  );
};

function App() {
  const [theme, colorMode] = useMode();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!sessionStorage.getItem('token')
  );

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {isAuthenticated ? (
          <AuthenticatedLayout
            isExpanded={isExpanded}
            setIsExpanded={setIsExpanded}
            onLogout={handleLogout}
          />
        ) : (
          <UnauthenticatedLayout onLogin={handleLogin} />
        )}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
*/
