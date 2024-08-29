import { useCallback, useState } from "react";
import axios from "axios";
import { Close, AccountCircle, ManageAccounts, Logout, Diversity2 } from '@mui/icons-material';
import { Tooltip, IconButton, AppBar, Toolbar, Typography, Menu, MenuItem, ListItemIcon, ListItemText } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Profile from './profile.js';

function Navbar ({ user, isMobile, theme, drawerOpen, handleDrawer, socket }) {

    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState();
    const [showProfile, setShowProfile] = useState(false);

    function handleClose() {
        setAnchorEl(null);
    }

    const handleLogout = useCallback(async () => {
        try{
          const response = await axios.get('http://localhost:8080/logout', { withCredentials: true });
          if(response.data.result){
            navigate('/');
          }          
          else 
          alert('Logout Failed. Please try again!');
        }catch(err){
          console.log(err);
        }
    }, [navigate]);

    return (
        <AppBar position='sticky' sx={{zIndex: theme.zIndex.drawer + 1}}>
        <Toolbar  >
          {isMobile ? (<Tooltip title={drawerOpen ? 'Close' : 'Show your Nexus'}><IconButton style={{color: 'white'}} edge='start' aria-label={drawerOpen ? 'close menu' : 'open menu'} onClick={handleDrawer} > 
            { drawerOpen ? <Close /> : <Diversity2 /> }
          </IconButton></Tooltip>) : (<IconButton style={{color: 'white'}} sx={{pointerEvents: 'none'}} edge='start' ><Diversity2 /></IconButton>)}
          <Typography variant="h6" sx={{flexGrow: 1}}>Nexus</Typography>
          <IconButton style={{color: 'white'}} edge='end' onClick={(e) => setAnchorEl(e.currentTarget)}>
            <AccountCircle fontSize="large"/>
          </IconButton>
          <Menu id='profile-menu' anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
            <MenuItem onClick={() => {handleClose(); setShowProfile(true);}}>
            <ListItemIcon>
              <ManageAccounts />
            </ListItemIcon>
            <ListItemText primary='Profile' />
            </MenuItem>
            <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <Logout />
            </ListItemIcon>
            <ListItemText primary='Logout' />
            </MenuItem>
          </Menu>
          {showProfile && <Profile user={user} isAdmin={true} handleLogout={handleLogout} socket={socket} setShowProfile={setShowProfile} showProfile={showProfile}/>}
        </Toolbar>
      </AppBar>
    );
}

export default Navbar;