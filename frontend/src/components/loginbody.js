import { useState } from "react";
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
    const [showSnackbar, setShowSnackbar] = useState(false);

    async function handleRegister() {
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
            setShowSnackbar(true);
        }
    }

    async function handleLogin() {
        try{
            const response = await axios.post('http://localhost:8080/login', {
                email: user.email,
                password: user.password,
                remember: checked
            }, { withCredentials: true });
            if(response.data.message === 'user-not-registered'){
                setShowRegister(true);
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
    }

    return (
        <Paper elevation={4} sx={{ p: 3, borderRadius: 5, marginX: 5, minWidth: '300px', maxWidth: '500px', boxSizing: 'border-box'}}>
            <LoginPart user={user} setConfirmPasswordValid={setConfirmPasswordValid} registerData={registerData} setPasswordValid={setPasswordValid} setEmailValid={setEmailValid} setUser={setUser} emailValid={emailValid} passwordValid={passwordValid} />
            <RegisterPart showRegister={showRegister} setRegisterData={setRegisterData} registerData={registerData} setConfirmPasswordValid={setConfirmPasswordValid} user={user} confirmPasswordValid={confirmPasswordValid} />
            <ButtonPart checked={checked} user={user} emailValid={emailValid} passwordValid={passwordValid} showRegister={showRegister} registerData={registerData} confirmPasswordValid={confirmPasswordValid} setShowRegister={setShowRegister} handleLogin={handleLogin} handleRegister={handleRegister} setChecked={setChecked} />
            <Snackbar open={showSnackbar} autoHideDuration={3000} onClose={() => setShowSnackbar(false)} message='User already exists. Login to continue.' />
        </Paper>
    )
}

export default LoginBody;