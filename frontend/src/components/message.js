import { Typography, Box, Paper, Grow, IconButton, Menu, MenuItem, ListItemIcon, ListItemText } from "@mui/material";
import { useState } from "react";
import { Delete, DeleteForeverOutlined, DeleteOutlined } from '@mui/icons-material';

function Message ({messageid, socket, sender, userClicked, user, message, time}) {
    
    const [showDelete, setShowDelete] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    function handleClose() {
        setAnchorEl(null);
    }

    function handleDeleteForEveryone() {
        socket.emit('delete-for-everyone', messageid, user, userClicked);
        handleClose();
    }

    function handleDeleteForMe() {
        socket.emit('delete-for-me', messageid, user);
        handleClose();
    }

    let messageTime;
    if(typeof time !== 'object')
    messageTime = new Date(time);
    else 
    messageTime = time;
    return (
        <Box sx={{ marginTop: 0.5, display: 'flex', flexDirection: sender === user ? 'row-reverse' : 'row'}}>
            <Box sx={{marginX: 2, display: 'flex', flexDirection: sender === user ? 'row-reverse' : 'row', alignItems: 'center'}} onMouseEnter={() => setShowDelete(true)} onMouseLeave={() => setShowDelete(false)}>
            <Grow in={true}>
                <Paper component='div' sx={{ display: 'inline-flex', backgroundColor: sender === user ? 'rgb(63, 134, 237)' : '#d9d9d9', color: sender === user ? 'white' : 'black', borderRadius: 5, paddingX: 2, justifyContent: 'space-between', alignItems: 'flex-end'}}>
                    <Typography sx={{paddingY: 0.5, paddingRight: 1}} variant="body1">{message}</Typography>
                    <Typography sx={{fontSize: 10, paddingBottom: 0.2}} variant="body2">{String(messageTime.getHours()).padStart(2, '0')+':'+String(messageTime.getMinutes()).padStart(2, '0')}</Typography>
                </Paper>
            </Grow>
            <Grow in={showDelete}>
                <IconButton sx={{marginX: 0.5}} size="small" onClick={ user === sender ? e => setAnchorEl(e.currentTarget) : handleDeleteForMe}><Delete sx={{color: 'gray', fontSize: 20}}/></IconButton>
            </Grow>  
            </Box> 
            <Menu sx={{'& .MuiList-root': {padding: 0}}} anchorEl={anchorEl} onClose={handleClose} open={Boolean(anchorEl) && user === sender}>
                <MenuItem onClick={handleDeleteForEveryone}>
                    <ListItemIcon><DeleteForeverOutlined /></ListItemIcon>
                    <ListItemText primary='Delete for everyone' />
                </MenuItem>
                <MenuItem onClick={handleDeleteForMe}>
                    <ListItemIcon><DeleteOutlined /></ListItemIcon>
                    <ListItemText primary='Delete for me' />
                </MenuItem>
            </Menu>         
        </Box>
    );
}

export default Message;