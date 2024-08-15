import { useState } from "react";
import { TextField, InputAdornment, IconButton, Collapse } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

function RegisterPart ({ showRegister, setRegisterData, registerData, setConfirmPasswordValid, user, confirmPasswordValid }) {

    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    return (
        <Collapse in={showRegister} collapsedSize={0} > 
                <TextField id="confirm-password" label="Confirm Password" type={showConfirmPassword ? "text" : "password"} required fullWidth onChange={(e) => setRegisterData( prevRegisterData => { return ({ ...prevRegisterData, confirmPassword: e.target.value})})} value={registerData.confirmPassword} 
                onFocus={() => setConfirmPasswordValid(true)}
                onBlur={() => {
                    if(user.password === registerData.confirmPassword)
                    setConfirmPasswordValid(true);
                    else
                    setConfirmPasswordValid(false);
                }}
                InputProps={ {
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton onClick={() => setShowConfirmPassword( prevShowConfirmPassword => !prevShowConfirmPassword)} >
                                {showConfirmPassword ? <VisibilityOff /> : <Visibility /> }
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
                error={ !confirmPasswordValid }
                helperText={ confirmPasswordValid ? '' : "Passwords do not match"}
                />
                <TextField id="user-name" label="User Name" type="text" required fullWidth onChange={(e) => setRegisterData( prevRegisterData => { return ({ ...prevRegisterData, username: e.target.value })})} value={registerData.username} />
                <TextField id="status" label="Status" type="text" fullWidth 
                onChange={(e) => {
                    setRegisterData( prevRegisterData => { return ({ ...prevRegisterData, status: e.target.value.substring(0, Math.min(e.target.value.length, 140)) })})
                }} value={registerData.status}
                InputProps={ {
                    endAdornment: (
                        <InputAdornment position="end">
                            <em>{registerData.status.length+"/140"}</em>
                        </InputAdornment>
                    ),
                }}/>
            </Collapse>
    );
}

export default RegisterPart;