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
import mainLogo from "../../../assets/user image.png";
import cdlogo from "../../../assets/cdlogo.jpg";
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import HandshakeIcon from '@mui/icons-material/Handshake';
import { appConfig } from '../../../config/appConfig';
import { useAuth } from '../../../scenes/hooks/useAuth';

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
  setIsExpanded,
  onLogout
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const loggedInUserData = JSON.parse(sessionStorage.getItem("loggedInUser"));
  const { logout } = useAuth();
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
    // sessionStorage.clear();
    // navigate("/");
    // // onLogout()
    logout()
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
      <Box sx={{
        p: 2,
        display: 'flex',
        alignItems: 'center',
        borderBottom: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.paper',
        position: 'relative',
        minHeight: 64
      }}>
        {isExpanded && (
          <Box sx={{
            ...titleStyles,
            transition: 'all 0.3s ease-in-out',
            opacity: isExpanded ? 1 : 0,
          }}>
            <img
              src={cdlogo}
              alt={appConfig.name}
              style={{
                transition: 'all 0.3s ease-in-out',
                transform: isExpanded ? 'scale(1)' : 'scale(0.8)',
              }}
            />
            <Box className="title-container">
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  background: 'linear-gradient(45deg, #5C5CFF, #7D7DFF)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '0.5px',
                  fontSize: '1.15rem',
                  transition: 'all 0.3s ease-in-out',
                }}
              >
                {appConfig.name}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                  fontWeight: 600,
                  letterSpacing: '1px',
                  fontSize: '0.65rem',
                  opacity: 0.9,
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
              position: 'absolute',
              right: isExpanded ? 12 : '50%',
              transform: isExpanded ? 'none' : 'translateX(50%)',
              width: 28,
              height: 28,
              backgroundColor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                backgroundColor: 'primary.main',
                borderColor: 'primary.main',
                color: 'white',
                transform: isExpanded ? 'scale(1.1)' : 'translateX(50%) scale(1.1)',
              },
              '& .MuiSvgIcon-root': {
                fontSize: 18,
                transition: 'transform 0.3s ease-in-out',
                transform: isExpanded ? 'rotate(0deg)' : 'rotate(180deg)',
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
          boxShadow: '0 0 20px rgba(0,0,0,0.03)',
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          overflowX: 'hidden',
          zIndex: theme.zIndex.appBar + 100,
          '&:hover': {
            boxShadow: '0 0 30px rgba(0,0,0,0.05)',
          }
        },
        '& .MuiBackdrop-root': {
          backdropFilter: 'blur(8px)',
          backgroundColor: 'rgba(0,0,0,0.2)',
        }
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default Sidebar;
