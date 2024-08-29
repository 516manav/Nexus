import { useState, useEffect, useCallback } from "react";
import Navbar from "./navbar.js";
import { useTheme, useMediaQuery, Box } from "@mui/material";
import Sidebar from "./sidebar.js";
import ContentArea from "./contentarea.js";
import io from 'socket.io-client';

function Chat({ user }) {

  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [userDetails, setUserDetails] = useState(null);
  const [socket, setSocket] = useState(null);
  const [contactClicked, setContactClicked] = useState(null);  
  const [transition, setTransition] = useState(true);

  const handleListClick = useCallback(element => {
    if(element !== contactClicked){
      setTransition(false);
      setTimeout(() => {
        setTransition(true);
        setContactClicked(element);
      }, 100);
    }    
  }, [contactClicked]);

  useEffect(() => {
    function handleSocketConnect() {
      socket.emit('details', user);
    }
    function handleSocketReceiveDetails(details) {
      setUserDetails(details);
    }
    const socket = io('http://localhost:8080');
    setSocket(socket);
    socket.on('connect', handleSocketConnect);
    socket.on('new-user-added', handleSocketConnect);
    socket.on('receive-details', handleSocketReceiveDetails);

    return (() => {
      socket.off('connect', handleSocketConnect);
      socket.off('new-user-added', handleSocketConnect);
      socket.off('receive-details', handleSocketReceiveDetails);
      socket.disconnect();
    })
  },[user]);

  const handleDrawer = useCallback(() => {
    setDrawerOpen( prevValue => !prevValue);
  }, [setDrawerOpen]);

  return (
    <Box sx={{display: 'flex', height: '100vh'}}>
      <Box sx={{display: 'flex', flexDirection: 'column', flexGrow: 1}}>
        <Navbar theme={theme} socket={socket} isMobile={isMobile} user={user.id} drawerOpen={drawerOpen} handleDrawer={handleDrawer} />
        {userDetails === null ? '' : <Sidebar isMobile={isMobile} drawerOpen={drawerOpen} handleDrawer={handleDrawer} details={userDetails} user={user} socket={socket} handleListClick={handleListClick}/>}
        <ContentArea user={user} isMobile={isMobile} socket={socket} userClicked={contactClicked} setUserClicked={setContactClicked} transition={transition}/>   
      </Box>
    </Box>
  );
}

export default Chat;