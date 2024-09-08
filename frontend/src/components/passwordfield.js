import { useEffect, useState } from "react";
import { IconButton, TextField, InputAdornment, Box } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

function PasswordField({ prevPassword, changePasswordSuccess, setChangePasswordSuccess, passwordValid, setPasswordValid, profile, setProfile }) {

    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);

    useEffect(() => {
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&*!])[A-Za-z\d@#$%^&*!]{12,}$/;
        if(profile && profile.newPassword !== '')
        setPasswordValid(passwordRegex.test(profile.newPassword));
        else
        setPasswordValid(true);
    }, [profile, setPasswordValid]);

    return(
        <Box>
            {prevPassword !== 'google' && <TextField fullWidth required type={showCurrentPassword ? "text" : "password"} label='Enter Current Password' size="small" sx={{marginY: 1}} value={profile.currentPassword} 
            onChange={e => {
                    setProfile(prevValue => ({...prevValue, currentPassword: e.target.value})); 
                    if(!changePasswordSuccess)
                    setChangePasswordSuccess(true);
            }}
            InputProps={{
            sx: {paddingRight: '2px', borderRadius: 2},
            endAdornment: (
                <InputAdornment position="end">
                    <IconButton onClick={() => setShowCurrentPassword( prevShowPassword => !prevShowPassword)} >
                        {showCurrentPassword ? <VisibilityOff /> : <Visibility /> }
                    </IconButton>
                </InputAdornment> 
            ),
        }}
        error={ !changePasswordSuccess }
        helperText={changePasswordSuccess ? '' : 'Incorrect Password. Please try again.'}/> }
        <TextField fullWidth required type={showNewPassword ? "text" : "password"} label='Enter New Password' size="small" sx={{marginY: 1}} value={profile.newPassword} onChange={e => {setProfile(prevValue => ({...prevValue, newPassword: e.target.value}));}}
        InputProps={{
            sx: {paddingRight: '2px', borderRadius: 2},
            endAdornment: (
                <InputAdornment position="end">
                    <IconButton onClick={() => setShowNewPassword( prevShowPassword => !prevShowPassword)} >
                        {showNewPassword ? <VisibilityOff /> : <Visibility /> }
                    </IconButton>
                </InputAdornment> 
            ),
        }}
        error={ !passwordValid }
        helperText={passwordValid ? '' : 'Password should be atleast 12 characters long and must contain atleast one uppercase letter, one special symbol and one digit.'} />
        </Box>
    );
}

export default PasswordField;