import { TextField, InputAdornment, IconButton, Box, Typography } from "@mui/material";
import { Visibility, VisibilityOff, Diversity2 } from "@mui/icons-material";
import { useState, useEffect } from "react";

function LoginPart ({ user, showRegister, setConfirmPasswordValid, registerData, setPasswordValid, setEmailValid, setUser, emailValid, passwordValid }) {

    const [showPassword, setShowPassword] = useState(false);

    useEffect( () => {
        if(passwordValidate(user.password) || user.password === '')
            setPasswordValid({
                check: true,
                message: ''
            });
        else {
            if(showRegister)
            setPasswordValid({
                check: false,
                message: "Password should be atleast 12 characters long and must contain atleast one uppercase letter, one special symbol and one digit"           
            });
        }
    }, [user.password, showRegister, setPasswordValid]);

    function passwordValidate(password) {
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&*!])[A-Za-z\d@#$%^&*!]{12,}$/;
        return passwordRegex.test(password);
    }

    function emailValidate(email) {
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]+$/i;
        return emailRegex.test(email);
    }

    function handleChange(event) {
        setUser( prevUser => {
            return ({
                ...prevUser,
                [event.target.id]: event.target.value
            });
        });
    }

    return (
        <Box>
        <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgb(78, 153, 247)', marginY: 1}}><Diversity2 sx={{marginRight: 0.5}}/><Typography variant="h5">Nexus</Typography></Box>
        <TextField sx={{marginTop: 1.1}} InputProps={{sx: {borderRadius: 5}}} size="small" id="email" label="Email" type="email" required fullWidth onChange={handleChange} value={user.email} onFocus={() => setEmailValid(true)} onBlur={() => setEmailValid(emailValidate(user.email) || user.email === "" )} error={ !emailValid } helperText={ emailValid ? '' : 'Invalid email address'}/>
        <TextField sx={{marginTop: 1.1}} size="small" id="password" label="Password" type={showPassword ? "text" : "password"} required fullWidth onChange={handleChange} value={user.password}
            onBlur={() => {
                if(user.password === registerData.confirmPassword)
                setConfirmPasswordValid(true);
                else
                setConfirmPasswordValid(false);
            }}
            InputProps={ {
                sx: {borderRadius: 5},
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword( prevShowPassword => !prevShowPassword)} >
                        {showPassword ? <VisibilityOff /> : <Visibility /> }
                        </IconButton>
                    </InputAdornment>
                ),
            }}
            error={ !passwordValid.check }
            helperText={ passwordValid.message }
        />
        </Box>
    );
}

export default LoginPart;