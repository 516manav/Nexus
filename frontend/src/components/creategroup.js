import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Slide, TextField, Tooltip, List, Collapse, ListItem, Box, ListItemButton, ListItemText, Paper, Chip, Divider, Grow } from "@mui/material";
import { GroupAdd, PriorityHigh } from '@mui/icons-material';
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "./contexts/usercontext";
import { SocketContext } from "./contexts/socketcontext";
import { UserDetailsContext } from "./contexts/userdetails";

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

const CreateGroup = React.memo(({ open, setOpen }) => {

    const { user } = useContext(UserContext);
    const { userDetails } = useContext(UserDetailsContext);
    const { socket } = useContext(SocketContext);
    const [groupName, setGroupName] = useState('');
    const [search, setSearch] = useState('');
    const [members, setMembers] = useState([{email: user.email, id: user.id}]);
    const [menuItems, setMenuItems] = useState([]);
    const [deleteChip, setDeleteChip] = useState(-1); 

    useEffect(() => {
        if(search !== '')
        setMenuItems(userDetails.users.filter(element => element.email.slice(0, Math.min(search.length, element.email.length)) === search));
    }, [search, userDetails]);

    function addMember(newMember) {
        setSearch('');
        if(!members.some(member => member.id === newMember.id))
        setMembers(prevValue => [...prevValue, newMember]);
    }
    
    function deleteMember(member) {
        setDeleteChip(member.id);  
        setTimeout(() => {
            setMembers(prevValue => prevValue.filter(element => element.id !== member.id)); 
            setDeleteChip(''); 
        }, 300);  
    }

    function handleSubmit() {
        socket.emit('create-group', groupName, members, user.email);
    }

    function handleClose() {
        setOpen(false);
        setGroupName('');
        setSearch('');
        setMembers([{email: user.email, id: user.id}]);
        setMenuItems([]);
        setDeleteChip(-1);
    }

    return (
        <Dialog keepMounted open={open} TransitionComponent={Transition} onClose={handleClose}>
        <DialogTitle><Typography component='div' variant="h6" sx={{ color: '#1976d2'}}>Create Group</Typography></DialogTitle>
        <DialogContent>
            <TextField fullWidth value={groupName} onChange={(e) => setGroupName(e.target.value)} placeholder='Group Name' sx={{paddingBottom: 1}} InputProps={{ sx: {borderRadius: 2, '& .MuiInputBase-input': { paddingY: '5px', paddingLeft: '10px' }}}}/>
            <TextField fullWidth autoComplete="off" value={search} onChange={(e) => setSearch(e.target.value)} placeholder='Add Members' InputProps={{ sx: {borderRadius: 2, '& .MuiInputBase-input': { paddingY: '5px', paddingLeft: '10px' }}}}/>
            <Collapse in={Boolean(search)}>
            <Paper variant="outlined" sx={{borderRadius: 2, marginTop: '2px', maxHeight: '100px', overflowY: 'auto', width: '100%', boxSizing: 'border-box'}}>
                <List disablePadding>
                    {menuItems.length === 0 ? 
                    (<ListItem disablePadding> 
                    <ListItemButton sx={{ pointerEvents: 'none', paddingY: '2px', width: '100%'}}>
                        <ListItemText><PriorityHigh sx={{verticalAlign: 'sub', fontSize: '1.3rem'}}/>No user found</ListItemText>
                    </ListItemButton>
                    </ListItem>) : 
                    menuItems.map(menuItem => (
                    <ListItem key={menuItem.id} disablePadding>
                    <ListItemButton sx={{paddingY: '2px', width: '100%'}} onClick={() => addMember(menuItem)}>
                        <ListItemText>{menuItem.email}</ListItemText>
                    </ListItemButton>
                    </ListItem>))}
                </List>
            </Paper>
            </Collapse>
            <Divider sx={{marginTop: 2}}><Chip label='Members'/></Divider>
            <Box>
                <Chip size="small" label={user.email} variant="outlined"/>
                {members.filter(member => member.id !== user.id).map(member => (<Grow key={member.id} in={member.id !== deleteChip}><Chip size="small" sx={{marginX: '2px', marginY: '5px'}} label={member.email} variant="outlined" onDelete={() => deleteMember(member)}/></Grow>))}
            </Box>           
        </DialogContent>
        <DialogActions>
            <Tooltip title='Create Group'>
                <Box>
                    <Button disabled={!groupName || members.length <= 2} onClick={() => {handleClose(); handleSubmit();}} color="primary">
                        <GroupAdd/>
                    </Button>
                </Box>                
            </Tooltip>            
        </DialogActions>
    </Dialog>
    );
});

export default CreateGroup;