import { useEffect, useState } from "react";
import { TextField, Button, InputAdornment, IconButton, Collapse, Fade, Checkbox, FormControlLabel } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import GoogleIcon from '@mui/icons-material/Google';
import axios from "axios";
import { useNavigate } from "react-router-dom";

function LoginBody() {

    const [user, setUser] = useState({
        email: "",
        password: ""
    });
    const [registerData, setRegisterData] = useState({
        confirmPassword: "",
        username: "",
        status: ""
    });
    const [checked, setChecked] = useState(false);
    const [emailValid, setEmailValid] = useState(true);
    const [passwordValid, setPasswordValid] = useState({
        check: true,
        message: ""
    });
    const [showRegister, setShowRegister] = useState(false);
    const [confirmPasswordValid, setConfirmPasswordValid] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

    function passwordValidate(password) {
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&*!])[A-Za-z\d@#$%^&*!]{12,}$/;
        return passwordRegex.test(password);
    }

    function emailValidate(email) {
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]+$/i;
        return emailRegex.test(email);
    }

    function handleBlur(event) {
        if(emailValidate(user.email) || user.email === "" )
            setEmailValid(true);
        else
            setEmailValid(false);
    }

    function handleButtonDisable() {
        if(user.email !== "" && user.password !== "" && emailValid && passwordValid && !showRegister)
            return false;
        else if(user.email !== "" && user.password !== "" && registerData.confirmPassword !== "" && emailValid && passwordValid && showRegister && confirmPasswordValid)
            return false;
        else 
            return true;
    }

    function handleChange(event) {
        setUser( prevUser => {
            return ({
                ...prevUser,
                [event.target.id]: event.target.value
            }
            )
        });
    }

    function handleGoogle() {
        window.location.href = `http://localhost:8080/auth/google?remember=${checked}`;
    }

    async function handleSubmit() {
        try{
            if(showRegister){
                await axios.post('http://localhost:8080/register', {
                    email: user.email,
                    password: user.password,
                    username: registerData.username,
                    status: registerData.status || "Available"
                });
                setShowRegister(false);
            }
            const response = await axios.post('http://localhost:8080/login', {
                email: user.email,
                password: user.password,
                remember: checked
            }, { withCredentials: true });
            if(response.data.message === 'user-not-registered'){
                setShowRegister(true);
            }                
            else if(response.data.message === 'success')
            navigate('/chat');
            else{
                setPasswordValid({
                    check: false,
                    message: 'Incorrect password. Please type again carefully'
                });
            }
        }catch (err){
            console.log("Error: ", err);
        }
    }

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
    }, [user.password]);

    return (
        <div>
            <TextField id="email" label="Email" type="email" required fullWidth onChange={handleChange} value={user.email} onFocus={() => setEmailValid(true)} onBlur={handleBlur} error={ !emailValid } helperText={ emailValid ? '' : 'Invalid email address'}/>
            <Collapse in={showRegister} collapsedSize={0} > 
                <TextField id="user-name" label="User Name" type="text" required fullWidth onChange={(e) => setRegisterData( prevRegisterData => { return ({ ...prevRegisterData, username: e.target.value })})} value={registerData.username} />
            </Collapse>
            <TextField id="password" label="Password" type={showPassword ? "text" : "password"} required fullWidth onChange={handleChange} value={user.password}
            InputProps={ {
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword( prevShowPassword => !prevShowPassword)} >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon /> }
                        </IconButton>
                    </InputAdornment>
                ),
            }}
            error={ !passwordValid.check }
            helperText={ passwordValid.message }
            />
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
                                {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon /> }
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
                error={ !confirmPasswordValid }
                helperText={ confirmPasswordValid ? '' : "Passwords do not match"}
                />
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
            <FormControlLabel control={<Checkbox checked={checked} onChange={() => setChecked(prevChecked => !prevChecked)} size="small"/>} label="Remember me for a month" />
            <Button variant="outlined" color="primary" onClick={ handleSubmit } fullWidth disabled={ handleButtonDisable() }>
                { showRegister ? "Create Your Account" : "Login" }
            </Button>
            <div>Other log in option</div>
            <Button variant="outlined" color="primary" fullWidth onClick={handleGoogle}>Sign in with Google <GoogleIcon /> </Button>
            <Fade in={!showRegister}>
                <div>
                    <em>Don't have an account? </em>
                    <u style={{ cursor: "pointer"}} onClick={() => setShowRegister(true)}>Sign up</u>
                </div>
            </Fade>
        </div>
    )
}

export default LoginBody;