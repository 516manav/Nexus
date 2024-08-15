import { Button, Fade, Checkbox, FormControlLabel, Link, Typography } from "@mui/material";
import GoogleIcon from '@mui/icons-material/Google';

function ButtonPart ({ checked, user, emailValid, registerData, passwordValid, showRegister, confirmPasswordValid, handleSubmit, setShowRegister, setChecked }) {

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
        <>
        <FormControlLabel control={<Checkbox checked={checked} onChange={() => setChecked(prevChecked => !prevChecked)} size="small"/>} label="Remember me for a month" />
            <Button variant="outlined" color="primary" onClick={ handleSubmit } fullWidth disabled={ handleButtonDisable() }>
                <Typography>{ showRegister ? "Create Your Account" : "Login" }</Typography>
            </Button>
            <Typography>Other log in option</Typography>
            <Button variant="outlined" color="primary" fullWidth onClick={handleGoogle}><Typography>Sign in with Google</Typography> <GoogleIcon /></Button>
            <Fade in={!showRegister}>
                <Typography component='div'>
                    <Typography sx={{fontStyle: 'italic', display: 'inline'}}>Don't have an account?{' '} </Typography>
                    <Link sx={{
                        color: 'black',
                        cursor: 'pointer',
                        textDecorationColor: 'gray',
                        '&:hover': {          
                            textDecorationColor: 'black'
                        }
                    }} onClick={() => setShowRegister(true)} >
                        Sign up
                    </Link>
                </Typography>
            </Fade>
        </>
    );
}

export default ButtonPart;