import React, { useState, useEffect } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Typography,
  useTheme,
  useMediaQuery,
  Divider,
  Avatar,
  Tooltip,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ContactsIcon from '@mui/icons-material/Contacts';
import InventoryIcon from '@mui/icons-material/Inventory';
import EventIcon from '@mui/icons-material/Event';
import PersonIcon from '@mui/icons-material/Person';
import FolderIcon from '@mui/icons-material/Folder';
import SecurityIcon from '@mui/icons-material/Security';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import mainLogo from "../assets/user image.png";
import cdlogo from "../assets/cdlogo.jpg";
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import HandshakeIcon from '@mui/icons-material/Handshake';
import { appConfig } from '../config';

const titleStyles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  width: '80%',
  px: 1.5,
  py: 1,
  mb: 2,
  borderRadius: 2,
  backgroundColor: 'rgba(92, 92, 255, 0.05)',
  '& img': {
    width: 38,
    height: 38,
    borderRadius: '10px',
    objectFit: 'cover',
    boxShadow: '0 3px 6px rgba(92, 92, 255, 0.15)',
    backgroundColor: 'white'
  },
  '& .title-container': {
    ml: 1.5,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start'
  }
};

const Sidebar = ({
  tableNamearr,
  selected,
  setSelected,
  isSidebarOpen,
  setIsSidebarOpen,
  isExpanded,
  setIsExpanded
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const loggedInUserData = JSON.parse(sessionStorage.getItem("loggedInUser"));

  useEffect(() => {
    const currentPath = window.location.pathname;

    const matchedPage = tableNamearr.find(page =>
      currentPath.includes(page.toNav.toLowerCase())
    );

    if (matchedPage) {
      setSelected(matchedPage.title);
    }
  }, [tableNamearr, setSelected]);

  useEffect(() => {
    const persistedSelectedItem = sessionStorage.getItem('selectedSidebarItem');
    if (persistedSelectedItem) {
      setSelected(persistedSelectedItem);
    }
  }, [setSelected]);

  const getIcon = (title) => {
    switch (title) {
      case 'Enquiry': return <QuestionAnswerIcon />;
      case 'Deal': return <HandshakeIcon />;
      case 'Dashboard': return <DashboardIcon />;
      case 'Account': return <AccountCircleIcon />;
      case 'Contact': return <ContactsIcon />;
      case 'Inventory': return <InventoryIcon />;
      case 'Event': return <EventIcon />;
      case 'User': return <PersonIcon />;
      case 'Files': return <FolderIcon />;
      case 'Permissions': return <SecurityIcon />;
      case 'Role': return <ManageAccountsIcon />;
      default: return <DashboardIcon />;
    }
  };

  const handleMenuItemClick = (page) => {
    navigate(page.toNav);
    setSelected(page.title);

    sessionStorage.setItem('selectedSidebarItem', page.title);

    if (isMobile) setIsSidebarOpen(false);
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
  };

  const drawerContent = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: isMobile ? 300 : (isExpanded ? 300 : 73),
        transition: 'width 0.2s ease-in-out',
      }}
    >
      <Box sx={{ pt: 2 }}>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: isExpanded ? 'space-between' : 'center',
          px: 2,
          py: 1.5,
          mb: 2,
          minHeight: 70,
          borderBottom: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'background.paper',
        }}>
          {isExpanded && (
            <Box sx={titleStyles}>
              <img src={cdlogo} alt={appConfig.name} />
              <Box className="title-container">
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 800,
                    color: 'primary.main',
                    letterSpacing: '0.5px',
                    lineHeight: 1.2,
                    fontSize: '1.15rem',
                    fontFamily: '"Poppins", sans-serif',
                    textTransform: 'uppercase',
                    background: 'linear-gradient(45deg, #5C5CFF, #7D7DFF)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  {appConfig.name}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: 'text.secondary',
                    fontWeight: 600,
                    letterSpacing: '1.5px',
                    textTransform: 'uppercase',
                    fontSize: '0.65rem',
                    opacity: 0.8,
                    mt: 0.2
                  }}
                >
                  CRM System
                </Typography>
              </Box>
            </Box>
          )}
          {!isMobile && (
            <IconButton
              onClick={() => setIsExpanded(!isExpanded)}
              sx={{
                backgroundColor: 'background.default',
                '&:hover': {
                  backgroundColor: 'primary.light',
                  color: 'white'
                },
                transition: 'all 0.2s ease-in-out',
                ml: isExpanded ? 0 : 'auto'
              }}
            >
              {isExpanded ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
          )}
          {isMobile && (
            <IconButton
              onClick={() => setIsSidebarOpen(false)}
              sx={{
                backgroundColor: 'background.default',
                '&:hover': {
                  backgroundColor: 'primary.light',
                  color: 'white'
                }
              }}
            >
              <ChevronLeftIcon />
            </IconButton>
          )}
        </Box>
        <List>
          {tableNamearr.map((page) => (
            <Tooltip
              title={!isExpanded && !isMobile ? page.title : ""}
              placement="right"
              key={page.title}
            >
              <ListItem
                button
                onClick={() => handleMenuItemClick(page)}
                selected={selected === page.title}
                sx={{
                  mb: 1,
                  mx: 1,
                  borderRadius: 1,
                  justifyContent: (isExpanded || isMobile) ? 'flex-start' : 'start',
                  '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'white',
                    },
                    '& .MuiListItemText-root': {
                      color: 'white',
                    },
                  },
                  '& .MuiListItemText-root': {
                    color: 'text.primary',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'text.secondary',
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: (isExpanded || isMobile) ? 40 : 'auto' }}>
                  {getIcon(page.title)}
                </ListItemIcon>
                {(isExpanded || isMobile) && <ListItemText primary={page.title} />}
              </ListItem>
            </Tooltip>
          ))}
        </List>
      </Box>

      {/* User Profile and Logout Section */}
      <Box sx={{ mt: 'auto', pb: 2 }}>
        <Divider sx={{ my: 2 }} />
        {isExpanded ? (
          <>
            <Box sx={{ px: 2, mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Avatar src={mainLogo} sx={{ width: 40, height: 40, mr: 2 }} />
                <Box>
                  <Typography variant="subtitle1">
                    {loggedInUserData?.userFullName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {loggedInUserData?.userName}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <ListItem
              button
              onClick={handleLogout}
              sx={{
                mx: 1,
                borderRadius: 1,
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  backgroundColor: '#ffebee',
                  '& .MuiListItemIcon-root': {
                    color: '#f44336',
                  },
                  '& .MuiListItemText-root': {
                    color: '#f44336',
                  },
                },
              }}
            >
              <ListItemIcon sx={{ color: '#f44336' }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText
                primary="Logout"
                sx={{
                  color: '#f44336',
                  '& .MuiTypography-root': {
                    fontWeight: 'medium',
                  }
                }}
              />
            </ListItem>
          </>
        ) : (
          <Tooltip title="Logout" placement="right">
            <ListItem
              button
              onClick={handleLogout}
              sx={{
                justifyContent: 'center',
                mx: 1,
                borderRadius: 1,
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  backgroundColor: '#ffebee',
                  '& .MuiListItemIcon-root': {
                    color: '#f44336',
                  },
                },
              }}
            >
              <ListItemIcon sx={{
                minWidth: 'auto',
                color: '#f44336',
              }}>
                <LogoutIcon />
              </ListItemIcon>
            </ListItem>
          </Tooltip>
        )}
      </Box>
    </Box>
  );

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'permanent'}
      open={isMobile ? isSidebarOpen : true}
      onClose={() => setIsSidebarOpen(false)}
      sx={{
        '& .MuiDrawer-paper': {
          width: isMobile ? 300 : (isExpanded ? 300 : 73),
          boxSizing: 'border-box',
          border: 'none',
          backgroundColor: 'background.paper',
          boxShadow: 1,
          transition: 'width 0.2s ease-in-out',
          overflowX: 'hidden',
          zIndex: theme.zIndex.appBar + 100,
        },
        '& .MuiBackdrop-root': {
          zIndex: theme.zIndex.appBar + 50
        }
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default Sidebar;
