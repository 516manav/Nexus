import { TextField, InputAdornment, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState, useEffect } from "react";

function LoginPart ({ user, setPasswordValid, setEmailValid, setUser, emailValid, passwordValid }) {

    const [showPassword, setShowPassword] = useState(false);

    useEffect( () => {
        if(passwordValidate(user.password) || user.password === '')
            setPasswordValid({
                check: true,
                message: ''
            });
        else
            setPasswordValid({
                check: false,
                message: "Password should be atleast 12 characters long and must contain atleast one uppercase letter, one special symbol and one digit"           
            });
    }, [user.password, setPasswordValid]);

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
        <>
        <TextField id="email" label="Email" type="email" required fullWidth onChange={handleChange} value={user.email} onFocus={() => setEmailValid(true)} onBlur={() => setEmailValid(emailValidate(user.email) || user.email === "" )} error={ !emailValid } helperText={ emailValid ? '' : 'Invalid email address'}/>
        <TextField id="password" label="Password" type={showPassword ? "text" : "password"} required fullWidth onChange={handleChange} value={user.password}
            InputProps={ {
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
        </>
    );
}

export default LoginPart;