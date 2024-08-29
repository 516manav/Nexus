import { Dialog, DialogTitle, DialogActions, DialogContent, Typography, Slide, Box, Avatar, IconButton, Tooltip, Zoom, Collapse, TextField } from "@mui/material";
import { Close, Save, Delete, Lock } from "@mui/icons-material";
import React, { useCallback, useEffect, useState } from "react";
import ProfileFields from "./profilefields.js";
import PasswordField from "./passwordfield.js";

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

function Profile({ socket, user, showProfile, setShowProfile, handleLogout, isAdmin }) {

    const [show, setShow] = useState(showProfile);
    const [profile, setProfile] = useState(null);
    const [edit, setEdit] = useState(false);
    const [hover, setHover] = useState('');
    const [transition, setTransition] = useState(true);
    const [changePassword, setChangePassword] = useState(false);
    const [passwordValid, setPasswordValid] = useState(true);
    const [disabled, setDisabled] = useState(false);
    const [changePasswordSuccess, setChangePasswordSuccess] = useState(true);
    const handleTransition = useCallback(editValue => {
        setTransition(false);
        setTimeout(() => {
            setTransition(true);
            setEdit(editValue);
        }, 150);
    }, [setTransition, setEdit]);

    useEffect(() => {
        if(profile){
        if(profile.password !== 'google')
        setDisabled(changePassword && (profile.currentPassword === '' || profile.newPassword === '' || !passwordValid));
        else
        setDisabled(changePassword && (profile.newPassword === '' || !passwordValid));
        }
    }, [changePassword, profile, passwordValid]);

    useEffect(() => {
        socket.emit('get-user-profile', user);
        function handleUserProfile(updatedProfile) {
            if(updatedProfile !== 'error') {
                setProfile({...updatedProfile, currentPassword: '', newPassword: ''});
                handleTransition(false);
                setChangePassword(false);
            } else
            setChangePasswordSuccess(false);
        }
        socket.on('user-profile', handleUserProfile);
        return(() => {
            socket.off('user-profile', handleUserProfile);
        });
    }, [user, socket, handleTransition]);

    function handleDelete() {
        socket.emit('delete-user', user);
        handleClose();
        handleLogout();
    }

    function handleClose() {
        setShow(false);
        setEdit(false);
        setHover(-1);
        setTransition(true);
        setChangePassword(false);
    }

    function handleSave() {
        socket.emit('update-user-profile', profile, user);
    }
    
    function handleChangePassword() {
        setChangePassword(true);
        handleTransition(true);
    }

    if(profile !== null)
    return(
        <Dialog open={show} onClose={handleClose} TransitionComponent={Transition} onTransitionExited={() => {setShowProfile(false); setProfile(null);}}>
            <DialogTitle sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                <Typography component='div' variant="h6" sx={{ color: '#1976d2'}}>Profile</Typography>
                <Avatar>{profile.name.split(' ').slice(0, 2).map(word => word[0].toUpperCase()).join('')}</Avatar>
            </DialogTitle>
            <DialogContent>
                <Box>
                    <TextField fullWidth label='Email' value={profile.email} size="small" sx={{marginY: 1}} InputProps={{ readOnly: true, sx: {borderRadius: 2}}} />
                    <ProfileFields hover={hover} setHover={setHover} edit={edit} value={profile.name} label='Name' setProfile={setProfile} handleTransition={handleTransition} isAdmin={isAdmin}/>
                    <ProfileFields hover={hover} setHover={setHover} edit={edit} value={profile.status} label='Status' setProfile={setProfile} handleTransition={handleTransition} isAdmin={isAdmin}/>
                    <Collapse in={changePassword} timeout={200}>
                        <PasswordField changePasswordSuccess={changePasswordSuccess} setChangePasswordSuccess={setChangePasswordSuccess} passwordValid ={passwordValid} profile={profile} setProfile={setProfile} setPasswordValid={setPasswordValid}/>                        
                    </Collapse>
                </Box>                
            </DialogContent>
            <DialogActions sx={{display: 'flex', justifyContent: 'space-between'}}>
                <Tooltip title='Change Password' onClick={handleChangePassword}>
                    <Zoom in={isAdmin && !changePassword}> 
                        <IconButton><Lock /></IconButton>
                    </Zoom>
                </Tooltip>
                <Box>
                {isAdmin && <Tooltip title='Delete Account' onClick={handleDelete}>
                    <Zoom in={transition && !edit}> 
                        <IconButton><Delete /></IconButton>
                    </Zoom>
                </Tooltip>}
                <Tooltip title={edit ? 'Save Changes' : 'Close'} onClick={edit ? handleSave : handleClose}>
                    <Box component='span'>
                        <Zoom in={transition} > 
                            <IconButton disabled={disabled}>
                            {edit ? <Save color="primary" sx={{opacity: disabled ? 0.5 : 1}}/> : <Close color="primary"/>}
                            </IconButton>
                        </Zoom>
                    </Box>
                </Tooltip> 
                </Box>  
            </DialogActions>
        </Dialog>
    );
}

export default Profile;