import { useState } from "react";
import axios from "axios";
import { Menu as MenuIcon, Close, AccountCircle, ManageAccounts, Logout } from '@mui/icons-material';
import { Tooltip, IconButton, AppBar, Toolbar, Typography, Menu, MenuItem, ListItemIcon, ListItemText } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Navbar ({ isMobile, theme, drawerOpen, handleDrawer }) {

    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState();

    function handleClose() {
        setAnchorEl(null);
    }

    async function handleLogout() {
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
    }

    return (
        <AppBar position='sticky' sx={{zIndex: theme.zIndex.drawer + 1}}>
        <Toolbar  >
          {isMobile && (<IconButton style={{color: 'white'}} edge='start' aria-label={drawerOpen ? 'close menu' : 'open menu'} onClick={handleDrawer} >
            { drawerOpen ? <Close /> : <MenuIcon /> }
          </IconButton> )}
          <Typography variant="h6" sx={{flexGrow: 1}}>Nexus</Typography>
          <Tooltip title='Profile'>
            <IconButton style={{color: 'white'}} edge='end' aria-label="profile" onClick={(e) => setAnchorEl(e.currentTarget)}>
              <AccountCircle fontSize="large"/>
            </IconButton>
          </Tooltip>
          <Menu id='profile-menu' anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
            <MenuItem onClick={handleClose}>
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
        </Toolbar>
      </AppBar>
    );
}

export default Navbar;