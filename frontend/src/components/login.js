import LoginBody from "./loginbody";
import LoginAnimation from "./animation.js";
import { Box } from "@mui/material";

function Login() {
    return (
        <Box sx={{display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center'}}>
            <Box sx={{display: {xs: 'none', md: 'block'}, minWidth: '550px'}}><LoginAnimation label='login' /></Box>
            <LoginBody />
        </Box>
    );
}

export default Login;