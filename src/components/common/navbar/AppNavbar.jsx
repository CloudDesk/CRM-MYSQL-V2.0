import React, { useState } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  IconButton,
  ThemeProvider,
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
});

function AppNavbar({ isExpanded, setIsExpanded }) {
  const [selected, setSelected] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const tableNamearr = [
    { title: "Dashboard", toNav: "list/Dashboard" },
    { title: "Enquiry", toNav: "list/Enquiry" },
    { title: "Deal", toNav: "list/Deals" },
    { title: "Account", toNav: "list/Account" },
    { title: "Contact", toNav: "list/Contact" },
    { title: "Inventory", toNav: "list/Inventory" },
    { title: "Event", toNav: "list/Event" },
    { title: "User", toNav: "list/User" },
    // { title: "Files", toNav: "list/File" },
    { title: "Permissions", toNav: "list/Permissions" },
    // { title: "Role", toNav: "list/Role" },
  ];

  return (
    <ThemeProvider theme={theme}>
      <Sidebar
        tableNamearr={tableNamearr}
        selected={selected}
        setSelected={setSelected}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
      />
      <AppBar
        position="fixed"
        sx={{
          display: { md: "none" },
          backgroundColor: "#5C5CFF",
          zIndex: theme.zIndex.appBar,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            {selected}
          </Typography>
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  );
}

export default AppNavbar;
