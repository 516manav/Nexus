import { useState, useEffect } from "react";
import Navbar from "./navbar.js";
import { useTheme, useMediaQuery, Box } from "@mui/material";
import Sidebar from "./sidebar.js";
import ContentArea from "./contentarea.js";
import io from 'socket.io-client';

function Chat({ user }) {

  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [userDetails, setUserDetails] = useState({});

  useEffect(() => {
    const socket = io('http://localhost:8080');
    socket.on('connect', () => {
      socket.emit('details', user);
    });
    socket.on('receive-details', details => {
      setUserDetails(details);
    });
    return (() => {
      socket.off('connect', () => {
        socket.emit('details', user);
      });
      socket.off('receive-details', details => {
        setUserDetails(details);
      });
      socket.disconnect();
    })
  },[user]);

  function handleDrawer(){
    setDrawerOpen( prevValue => !prevValue);
  }

  return (
    <Box>
      <Navbar theme={theme} isMobile={isMobile} drawerOpen={drawerOpen} handleDrawer={handleDrawer} />
      <Sidebar isMobile={isMobile} drawerOpen={drawerOpen} handleDrawer={handleDrawer} details={userDetails} user={user}/>
      <ContentArea isMobile={isMobile} />
    </Box>
  );
}

export default Chat;