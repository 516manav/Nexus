import { useState } from "react";
import LoginPart from "./loginpart.js";
import RegisterPart from "./registerpart.js";
import ButtonPart from "./buttonpart.js";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

function LoginBody() {

    const navigate = useNavigate();

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

    return (
        <div>
            <LoginPart user={user} setPasswordValid={setPasswordValid} setEmailValid={setEmailValid} setUser={setUser} emailValid={emailValid} passwordValid={passwordValid} />
            <RegisterPart showRegister={showRegister} setRegisterData={setRegisterData} registerData={registerData} setConfirmPasswordValid={setConfirmPasswordValid} user={user} confirmPasswordValid={confirmPasswordValid} />
            <ButtonPart checked={checked} user={user} emailValid={emailValid} passwordValid={passwordValid} showRegister={showRegister} registerData={registerData} confirmPasswordValid={confirmPasswordValid} setShowRegister={setShowRegister} handleSubmit={handleSubmit} setChecked={setChecked} />
        </div>
    )
}

export default LoginBody;