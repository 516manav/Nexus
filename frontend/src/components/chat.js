import { useState, useEffect, useCallback } from "react";
import Navbar from "./navbar.js";
import { useTheme, useMediaQuery, Box } from "@mui/material";
import Sidebar from "./sidebar.js";
import ContentArea from "./contentarea.js";
import io from 'socket.io-client';
import { useNavigate } from 'react-router-dom';

function Chat({ user }) {

  const navigate = useNavigate();
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
      socket.emit('join-room', user.id);
      socket.emit('details', user);
    }
    function handleSocketReceiveDetails(details) {
      setUserDetails(details);
    }
    function handleSocketDisconnected() {
      navigate('/');
    }
    function handleUnreadUpdate(newEntry) {
      if(newEntry.email)
      setUserDetails(prevValue => ({ ...prevValue, users: [newEntry, ...prevValue.users.filter(entry => entry.id !== newEntry.id)], favourites: prevValue.favourites.some(entry => entry.id === newEntry.id) ? [newEntry, ...prevValue.favourites.filter(entry => entry.id !== newEntry.id)] : prevValue.favourites}));
      else
      setUserDetails(prevValue => ({ ...prevValue, groups: [newEntry, ...prevValue.groups.filter(entry => entry.id !== newEntry.id)]}));
    }
    function handleRemoveUnread(userClickedId, isGroup) {
      if(isGroup)
      setUserDetails(prevValue => ({ ...prevValue, groups: prevValue.groups.map(entry => entry.id === userClickedId ? {...entry, messagecount: 0} : entry)}));
      else
      setUserDetails(prevValue => ({ ...prevValue, users: prevValue.users.map(entry => entry.id === userClickedId ? {...entry, messagecount: 0} : entry), favourites: prevValue.favourites.some(entry => entry.id === userClickedId) ? prevValue.favourites.map(entry => entry.id === userClickedId ? {...entry, messagecount: 0} : entry) : prevValue.favourites}));
    }
    function handleUpdateProfile() {
      socket.emit('details', user);
    }
    const socket = io('http://localhost:8080');
    setSocket(socket);
    socket.on('update-profile', handleUpdateProfile);
    socket.on('removed-unread', handleRemoveUnread);
    socket.on('socket-disconnected', handleSocketDisconnected);
    socket.on('connect', handleSocketConnect);
    socket.on('new-user-added', handleSocketConnect);
    socket.on('receive-details', handleSocketReceiveDetails);
    socket.on('unread-update', handleUnreadUpdate);

    return (() => {
      socket.off('update-profile', handleUpdateProfile);
      socket.off('unread-update', handleUnreadUpdate);
      socket.off('removed-unread', handleRemoveUnread);
      socket.off('socket-disconnected', handleSocketDisconnected);
      socket.off('connect', handleSocketConnect);
      socket.off('new-user-added', handleSocketConnect);
      socket.off('receive-details', handleSocketReceiveDetails);
      socket.disconnect();
    })
  },[navigate, user]);

  const handleDrawer = useCallback(() => {
    setDrawerOpen( prevValue => !prevValue);
  }, [setDrawerOpen]);

  return (
    <Box sx={{display: 'flex', height: '100vh'}}>
      <Box sx={{display: 'flex', flexDirection: 'column', flexGrow: 1}}>
        <Navbar theme={theme} socket={socket} isMobile={isMobile} user={user} drawerOpen={drawerOpen} handleDrawer={handleDrawer} />
        {userDetails === null ? '' : <Sidebar isMobile={isMobile} userClicked={contactClicked} drawerOpen={drawerOpen} handleDrawer={handleDrawer} details={userDetails} user={user} socket={socket} handleListClick={handleListClick}/>}
        <ContentArea user={user} isMobile={isMobile} socket={socket} userClicked={contactClicked} setUserClicked={handleListClick} transition={transition}/>   
      </Box>
    </Box>
  );
}

export default Chat;