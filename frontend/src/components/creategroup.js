import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Slide, TextField, Tooltip, List, Collapse, ListItem, Box, ListItemButton, ListItemText, Paper, Chip, Divider, Grow } from "@mui/material";
import { GroupAdd, PriorityHigh } from '@mui/icons-material';
import React, { useEffect, useState } from "react";

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

function CreateGroup({ open, setOpen, users, user, socket }) {

    const [groupName, setGroupName] = useState('');
    const [search, setSearch] = useState('');
    const [members, setMembers] = useState([user.email]);
    const [menuItems, setMenuItems] = useState([]);
    const [deleteChip, setDeleteChip] = useState(''); 

    useEffect(() => {
        if(search !== '')
        setMenuItems(users.filter(element => element.slice(0, Math.min(search.length, element.length)) === search));
    }, [search, users]);

    function addMember(newMember) {
        setSearch('');
        if(!members.includes(newMember))
        setMembers(prevValue => [...prevValue, newMember]);
    }
    
    function deleteMember(member) {
        setDeleteChip(member);  
        setTimeout(() => {
            setMembers(prevValue => prevValue.filter(element => element !== member)); 
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
        setMembers([user.email]);
        setMenuItems([]);
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
                    menuItems.map((menuItem, index) => (
                        <ListItem key={index} disablePadding>
                    <ListItemButton sx={{paddingY: '2px', width: '100%'}} onClick={() => addMember(menuItem)}>
                        <ListItemText>{menuItem}</ListItemText>
                    </ListItemButton>
                    </ListItem>))}
                </List>
            </Paper>
            </Collapse>
            <Divider sx={{marginTop: 2}}><Chip label='Members'/></Divider>
            <Box>
                <Chip size="small" label={user.email} variant="outlined"/>
                {members.filter(member => member !== user.email).map((member, index) => (<Grow key={index} in={member !== deleteChip}><Chip size="small" sx={{marginX: '2px', marginY: '5px'}} label={member} variant="outlined" onDelete={() => deleteMember(member)}/></Grow>))}
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
}

export default CreateGroup;