import React, { useState } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  IconButton,
  ThemeProvider,
  alpha,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import { createTheme } from "@mui/material";
import Sidebar from "./Sidebar";

const theme = createTheme({
  palette: {
    primary: {
      main: "#5C5CFF",
      light: "#7D7DFF",
      dark: "#4A4ACE",
    },
    background: {
      default: "#F4F6F8",
      paper: "#FFFFFF",
    },
  },
  typography: {
    fontFamily: ["Inter", "Roboto", "Arial", "sans-serif"].join(","),
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          transition: 'all 0.3s ease-in-out',
          backdropFilter: 'blur(12px)',
          backgroundColor: 'rgba(255, 255, 255, 0.98)',
          borderBottom: '1px solid rgba(231, 235, 240, 0.8)',
        }
      }
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: 'all 0.2s ease-in-out',
        }
      }
    }
  }
});

function AppNavbar({ isExpanded, setIsExpanded }) {
  const [selected, setSelected] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSidebarToggle = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleSidebarClose = () => {
    setIsSidebarOpen(false);
  };

  const tableNamearr = [
    { title: "Dashboard", toNav: "/dashboard" },
    { title: "Enquiry", toNav: "/enquiries" },
    { title: "Deal", toNav: "/deals" },
    { title: "Account", toNav: "/accounts" },
    { title: "Contact", toNav: "/contacts" },
    { title: "Inventory", toNav: "/inventories" },
    { title: "Event", toNav: "/events" },
    { title: "User", toNav: "/users" },
    { title: "Permissions", toNav: "/permissions" },
  ];

  return (
    <ThemeProvider theme={theme}>
      <Sidebar
        tableNamearr={tableNamearr}
        selected={selected}
        setSelected={setSelected}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={handleSidebarClose}
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
      />
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          display: { md: "none" },
          zIndex: theme.zIndex.appBar,
        }}
      >
        <Toolbar
          sx={{
            justifyContent: 'space-between',
            minHeight: '64px',
            px: 2
          }}
        >
          <IconButton
            color="primary"
            aria-label="open drawer"
            edge="start"
            onClick={handleSidebarToggle}
            sx={{
              width: 40,
              height: 40,
              borderRadius: '12px',
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.08),
              }
            }}
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                letterSpacing: '0.5px',
                color: 'text.primary',
                fontSize: '1.1rem'
              }}
            >
              {selected}
            </Typography>
          </Box>

          <Box sx={{ width: 40 }} /> {/* Spacer for balance */}
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  );
}

export default AppNavbar;
