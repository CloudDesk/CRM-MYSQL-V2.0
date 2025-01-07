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
  Button,
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
  width: '100%',
  px: 2.5,
  py: 2,
  mx: 1.5,
  borderRadius: 1.5,
  backgroundColor: 'rgba(92, 92, 255, 0.03)',
  backdropFilter: 'blur(8px)',
  // border: '1px solid',
  // borderColor: 'divider',
  transition: 'all 0.3s ease-in-out',
  // '&:hover': {
  //   backgroundColor: 'rgba(92, 92, 255, 0.05)',
  //   borderColor: 'primary.main',
  // },
  '& img': {
    width: 36,
    height: 36,
    borderRadius: '10px',
    objectFit: 'cover',
    boxShadow: '0 2px 8px rgba(92, 92, 255, 0.15)',
    backgroundColor: 'white',
    padding: '3px',
    // border: '1px solid',
    // borderColor: 'primary.light',
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
      transform: 'scale(1.05)',
    }
  },
  '& .title-container': {
    ml: 2,
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
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
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
    if (isMobile) {
      // Close drawer first, then navigate

      setTimeout(() => {
        navigate(page.toNav);
        setSelected(page.title);
        sessionStorage.setItem('selectedSidebarItem', page.title);
      }, 0);
    } else {
      setIsSidebarOpen(false);
      navigate(page.toNav);
      setSelected(page.title);
      sessionStorage.setItem('selectedSidebarItem', page.title);
    }
    setIsSidebarOpen(false);
  };

  const handleLogout = () => {
    logout();
  };

  const drawerWidth = isMobile ? 300 : (isExpanded || isHovered ? 300 : 88);

  const drawerContent = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: drawerWidth,
        transition: 'width 0.3s ease-in-out',
      }}
      onMouseEnter={() => !isMobile && setIsHovered(true)}
      onMouseLeave={() => !isMobile && setIsHovered(false)}
    >
      <Box sx={{
        p: 2.5,
        display: 'flex',
        alignItems: 'center',
        borderBottom: '1px solid',
        borderColor: 'divider',
        backgroundColor: theme.palette.background.paper,
        position: 'relative',
        height: 80,
        overflow: 'hidden'
      }}>
        <Box sx={{
          ...titleStyles,
          transition: 'all 0.3s ease-in-out',
          display: isExpanded || isHovered || isMobile ? "flex" : "none",
          transform: isExpanded || isHovered ? 'translateX(0)' : 'translateX(-20px)',
        }}>
          <img
            src={cdlogo}
            alt={appConfig.name}
            style={{
              transition: 'all 0.3s ease-in-out',
              transform: (isExpanded || isHovered) ? 'scale(1)' : 'scale(0.8)',
            }}
          />
          <Box className="title-container">
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(135deg, #5C5CFF 0%, #8A8AFF 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '0.5px',
                fontSize: '1.1rem',
                lineHeight: 1.2,
                mb: 0.5,
                textShadow: '0 2px 4px rgba(92, 92, 255, 0.1)',
              }}
            >
              {appConfig.name}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                fontWeight: 500,
                letterSpacing: '1px',
                fontSize: '0.7rem',
                lineHeight: 1,
                textTransform: 'uppercase',
                opacity: 0.8,
                background: 'linear-gradient(135deg, #666 0%, #999 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              CRM System
            </Typography>
          </Box>

        </Box>

        {/* {!isMobile && (
          <IconButton
            onClick={() => setIsExpanded(!isExpanded)}
            sx={{
              position: 'absolute',
              right: (isExpanded || isHovered) ? 20 : '50%',
              top: '50%',
              transform: (isExpanded || isHovered)
                ? 'translateY(-50%)'
                : 'translate(50%, -50%)',
              width: 28,
              height: 28,
              backgroundColor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              transition: 'all 0.3s ease-in-out',
              opacity: 1,
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
              '&:hover': {
                backgroundColor: 'primary.main',
                borderColor: 'primary.main',
                color: 'white',
                transform: (isExpanded || isHovered)
                  ? 'translateY(-50%) scale(1.1)'
                  : 'translate(50%, -50%) scale(1.1)',
                boxShadow: '0 4px 8px rgba(92, 92, 255, 0.2)',
              },
              '& .MuiSvgIcon-root': {
                fontSize: 18,
                transition: 'transform 0.3s ease-in-out',
                transform: (isExpanded || isHovered) ? 'rotate(0deg)' : 'rotate(180deg)',
              }
            }}
          >
            <ChevronLeftIcon />
          </IconButton>
        )} */}

        {!isExpanded && !isHovered && !isMobile && (
          <Box sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <img
              src={cdlogo}
              alt={appConfig.name}
              style={{
                width: 36,
                height: 36,
                borderRadius: '10px',
                objectFit: 'cover',
                boxShadow: '0 2px 8px rgba(92, 92, 255, 0.15)',
                backgroundColor: 'white',
                padding: '3px',
                // border: '1px solid',
                borderColor: theme.palette.primary.light,
                transition: 'all 0.3s ease-in-out',
              }}
            />
          </Box>
        )}
      </Box>


      <List sx={{
        px: 2,
        py: 2.5,
      }}>
        {tableNamearr.map((page) => (
          <Tooltip
            title={!isExpanded && !isHovered && !isMobile ? page.title : ""}
            placement="right"
            key={page.title}
          >
            <ListItem
              button
              onClick={() => handleMenuItemClick(page)}
              selected={selected === page.title}
              sx={{
                mb: 1,
                borderRadius: 1.5,
                justifyContent: (isExpanded || isHovered || isMobile) ? 'flex-start' : 'center',
                minHeight: 48,
                transition: 'all 0.2s ease-in-out',
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
                '&:hover': {
                  backgroundColor: selected === page.title ? 'primary.dark' : 'rgba(92, 92, 255, 0.08)',
                },
                '& .MuiListItemText-root': {
                  color: 'text.primary',
                  opacity: (isExpanded || isHovered || isMobile) ? 1 : 0,
                  transition: 'opacity 0.2s ease-in-out',
                },
                '& .MuiListItemIcon-root': {
                  color: selected === page.title ? 'white' : 'text.secondary',
                  minWidth: (isExpanded || isHovered || isMobile) ? 40 : 'auto',
                  transition: 'all 0.2s ease-in-out',
                },
              }}
            >
              <ListItemIcon>
                {getIcon(page.title)}
              </ListItemIcon>
              <ListItemText
                primary={page.title}
                sx={{
                  opacity: (isExpanded || isHovered || isMobile) ? 1 : 0,
                  transform: (isExpanded || isHovered || isMobile) ? 'translateX(0)' : 'translateX(-10px)',
                  transition: 'all 0.3s ease-in-out',
                }}
              />
            </ListItem>
          </Tooltip>
        ))}
      </List>

      {/* User Profile Section */}
      <Box sx={{
        mt: 'auto',
        pb: 2,
        opacity: (isExpanded || isHovered) ? 1 : 0,
        transition: 'opacity 0.3s ease-in-out',
      }}>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ px: 2 }}>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            p: 1.5,
            borderRadius: 2,
            backgroundColor: 'rgba(92, 92, 255, 0.04)',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              backgroundColor: 'rgba(92, 92, 255, 0.08)',
            }
          }}>
            <Avatar
              src={mainLogo}
              sx={{
                width: 40,
                height: 40,
                mr: 2,
                border: '2px solid',
                borderColor: 'primary.light'
              }}
            />
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {loggedInUserData?.userFullName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {loggedInUserData?.userName}
              </Typography>
            </Box>
          </Box>

          <Button
            fullWidth
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
            sx={{
              mt: 2,
              py: 1,
              color: 'error.main',
              borderColor: 'error.light',
              '&:hover': {
                backgroundColor: 'error.lighter',
                borderColor: 'error.main',
              },
            }}
            variant="outlined"
          >
            Logout
          </Button>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'permanent'}
      open={isMobile ? isSidebarOpen : true}
      onClose={() => setIsSidebarOpen(false)}
      keepMounted={false}
      disableScrollLock={!isMobile}
      ModalProps={{
        keepMounted: false,
        disableScrollLock: !isMobile,
        onBackdropClick: () => setIsSidebarOpen(false)
      }}
      sx={{
        '& .MuiDrawer-paper': {
          width: drawerWidth,
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
          backgroundColor: 'rgba(0,0,0,0.2)'
        }
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default Sidebar;
