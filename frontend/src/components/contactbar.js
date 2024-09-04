import { IconButton, Avatar, Box, Typography, Menu, MenuItem, ListItemIcon, ListItemText, Divider, Grow } from "@mui/material";
import { MoreVert, InfoOutlined, DeleteOutline } from '@mui/icons-material';
import { useState } from "react";
import Profile from "./profile.js";
import GroupProfile from "./groupprofile.js";

function ContactBar({ transition, user, socket, userClicked, setUserClicked }) {

    const [anchorEl, setAnchorEl] = useState(null);
    const [showProfile, setShowProfile] = useState(false);

    function handleClose() {
        setAnchorEl(null);
    }

    function handleClearChat() {
        socket.emit('clear-chat', user.id, userClicked.id);
    }

    return(
        <Grow in={transition} timeout={200}>
            <Box>
            <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                <Box sx={{display: 'flex', alignItems: 'center', flexGrow: 1, minWidth: 0}}>
                    <IconButton onClick={() => setShowProfile(true)} sx={{marginLeft: '7px', marginY: '2px'}}>
                        <Avatar>{userClicked.name.split(' ').slice(0, 2).map(word => word[0].toUpperCase())}</Avatar>
                    </IconButton>
                    <Box sx={{marginLeft: '7px', marginY: '2px', flexGrow: 1, minWidth: 0}}>
                        <Typography variant="body1" sx={{overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{userClicked.name}</Typography>
                        <Typography variant="body2" sx={{opacity: 0.67, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{userClicked.email}</Typography>
                    </Box>
                </Box>
                <Box sx={{display: 'flex', alignItems: 'center'}}>
                    <IconButton sx={{marginRight: {xs: '9px', sm: '17px'}}} onClick={event => setAnchorEl(event.currentTarget)}><MoreVert /></IconButton>  
                </Box>      
            </Box> 
            <Menu sx={{'& .MuiList-root': {padding: 0}}} anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                <MenuItem onClick={() => {setShowProfile(true); handleClose();}}>
                <ListItemIcon><InfoOutlined /></ListItemIcon>
                <ListItemText primary='More info'/>
                </MenuItem>
                <MenuItem onClick={() => {handleClearChat(); handleClose();}}>
                <ListItemIcon><DeleteOutline /></ListItemIcon>
                <ListItemText primary='Clear chat'/>
                </MenuItem>
            </Menu>
            {(showProfile && userClicked.tab !== 2) ? (<Profile isAdmin={false} user={userClicked.id} showProfile={showProfile} setShowProfile={setShowProfile} socket={socket}/>)
            : (<GroupProfile setUserClicked={setUserClicked} user={user} group={userClicked.id} showProfile={showProfile} setShowProfile={setShowProfile} socket={socket} />)}
            <Divider />
            </Box>
        </Grow>
    );
}

export default ContactBar;