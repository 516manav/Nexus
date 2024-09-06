import { Dialog, DialogTitle, DialogActions, DialogContent, Chip, Typography, Slide, Box, Divider, Avatar, IconButton, Tooltip, Zoom, AvatarGroup } from "@mui/material";
import { Close, GroupRemove } from "@mui/icons-material";
import React, { useEffect, useState } from "react";

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

function GroupProfile({ user, group, showProfile, setShowProfile, socket, setUserClicked }) {

    const [show, setShow] = useState(true);
    const [groupDetails, setGroupDetails] = useState(null);
    const [groupMembers, setGroupMembers] = useState([]);

    useEffect(() => {
        setShow(showProfile);
        socket.emit('get-group-info', group);
        function handleGroupInfo(groupInfo, members) {
            if(groupInfo && groupInfo.created)
            setGroupDetails({
                ...groupInfo,
                created: new Date(groupInfo.created)
            });
            setGroupMembers(members);
        }
        
        socket.on('group-info', handleGroupInfo);
        return(() => {
            socket.off('group-info', handleGroupInfo);
        });
    }, [group, socket, showProfile]);

    function handleLeave() {
        socket.emit('leave-group', user, group);
        handleClose();
        setUserClicked(null);
    }

    function handleClose() {
        setShow(false);
    }

    return(
        groupDetails && <Dialog fullWidth open={show} onClose={handleClose} TransitionComponent={Transition} onTransitionExited={() => {setShowProfile(false); setGroupDetails(null); setGroupMembers([]);}}>
            <DialogTitle sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                <Typography component='div' variant="h6" sx={{ color: '#1976d2'}}>Group Info</Typography>
                <Avatar>{groupDetails.groupname.split(' ').slice(0, 2).map(word => word[0].toUpperCase()).join('')}</Avatar>
            </DialogTitle>
            <DialogContent>
                <Box sx={{display: "flex", alignItems: 'center', justifyContent: 'space-between', width: '100%', flexGrow: 1}}>
                    <Box sx={{minWidth: 0, flexGrow: 1}}>
                        <Typography variant="body1" sx={{overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis'}}>{groupDetails.groupname}</Typography>
                        <Typography sx={{fontStyle: 'italic', fontSize: '0.8rem', color: 'rgba(0, 0, 0, 0.6)'}} variant="body2">Created on {groupDetails.created.getDate()+'/'+(groupDetails.created.getMonth()+1)+'/'+groupDetails.created.getFullYear()} at {String(groupDetails.created.getHours()).padStart(2, '0')+':'+String(groupDetails.created.getMinutes()).padStart(2, '0')}</Typography>
                        <Typography sx={{fontStyle: 'italic', fontSize: '0.8rem', color: 'rgba(0, 0, 0, 0.6)'}} variant="body2">by {groupDetails.createdby}</Typography>
                    </Box>                    
                    <AvatarGroup max={2}>
                        <Avatar key={user.email}>{user.username.split(' ').slice(0, 2).map(word => word[0].toUpperCase()).join('')}</Avatar>
                        {groupMembers.filter(member => member.id !== user.id).map(member => <Avatar key={member.email}>{member.username.split(' ').slice(0, 2).map(word => word[0].toUpperCase()).join('')}</Avatar>)}
                    </AvatarGroup>
                </Box>
                <Divider sx={{marginTop: 2, marginBottom: 1}}><Chip label='Members' /></Divider>
                <Chip variant="outlined" sx={{m: '2px'}} label={user.email}/>
                {groupMembers.filter(member => member.email !== user.email).map(member => <Chip key={member.email} variant="outlined" sx={{m: '2px'}} label={member.email} />)}
            </DialogContent>
            <DialogActions sx={{display: 'flex', justifyContent: 'space-between'}}>
                <Tooltip title='Leave Group' onClick={handleLeave}>
                    <Zoom in={true}>
                        <IconButton><GroupRemove /></IconButton>
                    </Zoom>
                </Tooltip>
                <Tooltip title='Close' onClick={handleClose}>
                    <Box component='span'>
                        <Zoom in={true} > 
                            <IconButton>
                                <Close color="primary"/>
                            </IconButton>
                        </Zoom>
                    </Box>
                </Tooltip>
            </DialogActions>
        </Dialog>
    );
}

export default GroupProfile;