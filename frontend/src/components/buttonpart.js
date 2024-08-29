import { Button, Checkbox, FormControlLabel, Link, Typography, Divider, Box } from "@mui/material";
import { Google, RadioButtonChecked, RadioButtonUnchecked } from '@mui/icons-material';

function ButtonPart ({ checked, user, emailValid, registerData, passwordValid, showRegister, confirmPasswordValid, handleRegister, handleLogin, setShowRegister, setChecked }) {

    function handleGoogle() {
        window.location.href = `http://localhost:8080/auth/google?remember=${checked}`;
    }

    function handleButtonDisable() {
        if(user.email !== "" && user.password !== "" && emailValid && passwordValid && !showRegister)
            return false;
        else if(user.email !== "" && user.password !== "" && registerData.confirmPassword !== "" && emailValid && passwordValid && showRegister && confirmPasswordValid)
            return false;
        else 
            return true;
    }

    return (
        <Box>
        <FormControlLabel sx={{marginTop: 2, width: '100%', justifyContent: 'center'}} control={<Checkbox icon={<RadioButtonUnchecked sx={{fontSize: 'medium'}}/>} checkedIcon={<RadioButtonChecked sx={{fontSize: 'medium'}}/>} size="small" checked={checked} onChange={() => setChecked(prevChecked => !prevChecked)} />} label={<Typography variant="body2">Remember me for a month</Typography>} />
            <Button variant="outlined" sx={{borderRadius: 10, marginY: 1}} color="primary" onClick={ showRegister ? handleRegister : handleLogin } fullWidth disabled={ handleButtonDisable() }>
                <Typography>{ showRegister ? "Create Your Account" : "Login" }</Typography>
            </Button>
            <Typography component='div' variant="body2" textAlign='center'><Divider>Or</Divider></Typography>
            <Button sx={{borderRadius: 10, marginY: 1}} variant="outlined" color="primary" fullWidth onClick={handleGoogle}><Typography>Sign in with Google</Typography> <Google sx={{fontSize: 'large'}}/></Button>
            {!showRegister && <Typography component='div' textAlign='center'>
                    <Typography component='span' variant="body2" sx={{fontStyle: 'italic'}}>Don't have an account?{' '} </Typography>
                    <Link component='span' sx={{
                        color: 'black',
                        cursor: 'pointer',
                        textDecorationColor: 'gray',
                        '&:hover': {          
                            textDecorationColor: 'black'
                        }
                    }} onClick={() => setShowRegister(true)} >
                        <Typography component='span' variant="body2">Sign up</Typography>
                    </Link>
            </Typography>}
        </Box>
    );
}

export default ButtonPart;