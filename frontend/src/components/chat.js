import { useState, useEffect, useCallback, useContext } from "react";
import Navbar from "./navbar.js";
import { useTheme, useMediaQuery, Box } from "@mui/material";
import Sidebar from "./sidebar.js";
import ContentArea from "./contentarea.js";
import io from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import { UserContext } from "./contexts/usercontext.js";
import { SocketContext } from "./contexts/socketcontext.js";
import { UserClickedContext } from "./contexts/userclickedcontext.js";
import { UserDetailsContext } from "./contexts/userdetails.js";
import { UserDeletedContext } from "./contexts/userdeletedcontext.js";

function Chat() {

  const { user } = useContext(UserContext);
  const { setUserDeleted } = useContext(UserDeletedContext);
  const { setSocket } = useContext(SocketContext);
  const { userClicked, setUserClicked } = useContext(UserClickedContext);
  const { userDetails, setUserDetails } = useContext(UserDetailsContext);
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
    function handleUserDelete(userId) {
      setUserDeleted(prevValue => (prevValue + 1) % 2);
      handleUpdateProfile();
      if(userClicked && userId === userClicked.id && userClicked.tab !== 2)
      setUserClicked(null);
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
    socket.on('user-deleted', handleUserDelete);

    return (() => {
      socket.off('update-profile', handleUpdateProfile);
      socket.off('unread-update', handleUnreadUpdate);
      socket.off('removed-unread', handleRemoveUnread);
      socket.off('socket-disconnected', handleSocketDisconnected);
      socket.off('connect', handleSocketConnect);
      socket.off('new-user-added', handleSocketConnect);
      socket.off('receive-details', handleSocketReceiveDetails);
      socket.off('user-deleted', handleUserDelete);
      socket.disconnect();
    })
  },[navigate, userClicked, user, setSocket, setUserClicked, setUserDetails, setUserDeleted]);

  const handleDrawer = useCallback(() => {
    setDrawerOpen( prevValue => !prevValue);
  }, [setDrawerOpen]);

  return (
    <Box sx={{display: 'flex', height: '100vh'}}>
      <Box sx={{display: 'flex', flexDirection: 'column', flexGrow: 1}}>
        <Navbar theme={theme} isMobile={isMobile} drawerOpen={drawerOpen} handleDrawer={handleDrawer} />
        {userDetails && <Sidebar isMobile={isMobile} drawerOpen={drawerOpen} handleDrawer={handleDrawer} />}
        <ContentArea isMobile={isMobile} />
      </Box>
    </Box>
  );
}

export default Chat;