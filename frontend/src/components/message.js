import { Typography, Box, Paper, Grow, IconButton, Menu, MenuItem, ListItemIcon, ListItemText } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { Delete, DeleteForeverOutlined, DeleteOutlined } from '@mui/icons-material';
import { UserContext } from "./contexts/usercontext.js";
import { UserClickedContext } from "./contexts/userclickedcontext.js";
import { SocketContext } from "./contexts/socketcontext.js";

function Message ({members, showDate, showSender, messageDetails, isGroupMessage}) {

    const { user } = useContext(UserContext);
    const [message, setMessage] = useState({...messageDetails, messagetime: typeof messageDetails.messagetime !== 'object' ? new Date(messageDetails.messagetime) : messageDetails.messagetime});
    const { userClicked } = useContext(UserClickedContext);
    const { socket } = useContext(SocketContext);
    const [showDelete, setShowDelete] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    useEffect(() => {
        setMessage({...messageDetails, messagetime: typeof messageDetails.messagetime !== 'object' ? new Date(messageDetails.messagetime) : messageDetails.messagetime});
    }, [messageDetails]);

    function handleClose() {
        setAnchorEl(null);
    }

    function isSameDay(date1, date2) {
        return (date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate());
    }

    function handleDate() {
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);
        const date = message.messagetime;
        if(isSameDay(date, today))
        return 'Today';
        else if(isSameDay(date, yesterday))
        return 'Yesterday';
        else {
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = String(date.getFullYear());
            return `${day}-${month}-${year}`;
        }
    }

    function handleDeleteForEveryone() {
        if(members.length !== 0)
        socket.emit('delete-for-everyone', message.id, user.id, members, isGroupMessage);
        else
        socket.emit('delete-for-everyone', message.id, user.id, userClicked.id, isGroupMessage);
        handleClose();
    }

    function handleDeleteForMe() {
        socket.emit('delete-for-me', message.id, user.id, isGroupMessage);
        handleClose();
    }

    return (
        Boolean(message.type) ? 
        (<Box sx={{marginX: 2, marginY: 1, display: 'flex', justifyContent: 'center'}}>
            <Grow in={true}>
                <Paper sx={{ display: 'inline-flex', backgroundColor: '#d9d9d9', paddingY: 0.5, paddingX: 2, borderRadius: 5}}>
                    <Typography sx={{textAlign: 'center', fontStyle: 'italic', overflowWrap: 'break-word', wordBreak: 'break-word'}} variant="caption">{message.textmessage}</Typography>
                </Paper>
            </Grow>
        </Box>) :
        <Box>
            {showDate && <Box sx={{marginX: 2, marginY: 1, display: 'flex', justifyContent: 'center'}}>
                <Grow in={true}>
                    <Paper elevation={0} sx={{ display: 'inline-flex', color: 'rgb(63, 134, 237)', border: '1.5px solid rgb(63, 134, 237)', paddingY: 0.5, paddingX: 2, borderRadius: 5}}>
                        <Typography sx={{textAlign: 'center', fontWeight: 'bold'}} variant="caption">{handleDate()}</Typography>
                    </Paper>
                </Grow>
            </Box>}
            <Box sx={{ marginTop: showSender ? 1 : 0.5, display: 'flex', flexDirection: message.senderid === user.id ? 'row-reverse' : 'row'}}>
                <Box sx={{marginX: 2, display: 'flex', flexDirection: message.senderid === user.id ? 'row-reverse' : 'row', alignItems: 'center'}} onMouseEnter={() => setShowDelete(true)} onMouseLeave={() => setShowDelete(false)}>
                <Grow in={true}>
                    <Paper component='div' sx={{ display: 'flex', flexDirection: "column", backgroundColor: message.senderid === user.id ? 'rgb(63, 134, 237)' : '#d9d9d9', borderRadius: 5, paddingX: 2, paddingTop: 0.5}}>
                        {isGroupMessage && user.id !== message.senderid && showSender && 
                        <Box component='div' sx={{ display: 'inline-flex', color: message.senderid === user.id ? 'white' : 'black', justifyContent: 'space-between', alignItems: 'center'}}>
                            <Typography sx={{paddingRight: 1, color: 'rgb(63, 134, 237)', fontWeight: 'bold', overflowWrap: 'break-word', wordBreak: 'break-word'}} variant="body2">{message.sendername}</Typography>
                            <Typography sx={{fontSize: 10, fontStyle: 'italic', opacity: 0.65, overflowWrap: 'break-word', wordBreak: 'break-word'}} variant="body2">{'~'+message.senderemail}</Typography>
                        </Box>}
                        <Box component='div' sx={{ display: 'inline-flex', color: message.senderid === user.id ? 'white' : 'black', justifyContent: 'space-between', alignItems: 'flex-end'}}>
                            <Typography sx={{paddingBottom: 0.5, paddingRight: 1, fontStyle: message.everyone ? 'italic' : 'normal', wordBreak: 'break-word', overflowWrap: 'break-word'}} variant="body1">{message.textmessage}</Typography>
                            <Typography sx={{fontSize: 10, paddingBottom: 0.2}} variant="body2">{String(message.messagetime.getHours()).padStart(2, '0')+':'+String(message.messagetime.getMinutes()).padStart(2, '0')}</Typography>
                        </Box>
                    </Paper>
                </Grow>
                {message.type !== 'leave-receipt' && (<Grow in={showDelete && !message.everyone}>
                    <IconButton sx={{marginX: 0.5}} size="small" onClick={ user.id === message.senderid ? e => setAnchorEl(e.currentTarget) : handleDeleteForMe}><Delete sx={{color: 'gray', fontSize: 20}}/></IconButton>
                </Grow>)}  
                </Box> 
                <Menu sx={{'& .MuiList-root': {padding: 0}}} anchorEl={anchorEl} onClose={handleClose} open={Boolean(anchorEl) && user.id === message.senderid}>
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
        </Box>
    );
}

export default Message;