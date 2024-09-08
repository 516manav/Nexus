import { useState, useCallback } from "react";
import LoginPart from "./loginpart.js";
import RegisterPart from "./registerpart.js";
import ButtonPart from "./buttonpart.js";
import axios from 'axios';
import { Paper, Snackbar } from "@mui/material";

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
    const [showSnackbar, setShowSnackbar] = useState({show: false, message: null});

    function handleButtonDisable() {
        if(user.email !== "" && user.password !== "" && emailValid && passwordValid && !showRegister)
            return false;
        else if(user.email !== "" && user.password !== "" && registerData.confirmPassword !== "" && emailValid && passwordValid && showRegister && confirmPasswordValid)
            return false;
        else 
            return true;
    }

    const handleLogin = useCallback(async () => {
        try{
            const response = await axios.post('http://localhost:8080/login', {
                email: user.email,
                password: user.password,
                remember: checked
            }, { withCredentials: true });
            if(response.data.message === 'user-not-registered'){
                setShowRegister(true);
                setShowSnackbar({show: true, message: 'User not Registered. Create an account to continue.'});
            }                
            else if(response.data.message === 'success')
            window.location.reload();
            else{
                setPasswordValid({
                    check: false,
                    message: 'Incorrect password. Please type again carefully'
                });
            }
        }catch (err){
            console.log("Error: ", err);
        }
    }, [checked, user]);

    const handleRegister = useCallback(async () => {
        const response = await axios.post('http://localhost:8080/register', {
            email: user.email,
            password: user.password,
            username: registerData.username,
            status: registerData.status || "Available"
        });
        if(response.data.message === 'success') {
            handleLogin();
        }
        else {
            setShowRegister(false);
            setShowSnackbar({show: true, message: 'User already exists. Login to continue.'});
        }
    }, [user, handleLogin, registerData]);

    return (
        <Paper elevation={4} sx={{ p: 3, borderRadius: 5, marginX: 5, minWidth: '300px', maxWidth: '500px', boxSizing: 'border-box'}}>
            <LoginPart user={user} showRegister={showRegister} setConfirmPasswordValid={setConfirmPasswordValid} registerData={registerData} setPasswordValid={setPasswordValid} setEmailValid={setEmailValid} setUser={setUser} emailValid={emailValid} passwordValid={passwordValid} />
            <RegisterPart user={user} setConfirmPasswordValid={setConfirmPasswordValid} showRegister={showRegister} setRegisterData={setRegisterData} registerData={registerData} confirmPasswordValid={confirmPasswordValid} />
            <ButtonPart buttonDisable={handleButtonDisable()} checked={checked} showRegister={showRegister} setShowRegister={setShowRegister} handleLogin={handleLogin} handleRegister={handleRegister} setChecked={setChecked} />
            <Snackbar sx={{ '& .MuiPaper-root': {backgroundColor: 'rgb(67, 123, 204)', color: 'white', fontSize: '1rem'}}} open={showSnackbar.show} autoHideDuration={3000} onClose={() => setShowSnackbar({show: false, message: null})} message={showSnackbar.message} />
        </Paper>
    )
}

export default LoginBody;