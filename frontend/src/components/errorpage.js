import Error from './animation.js';
import { Box, Typography } from '@mui/material';

function ErrorPage({message, title}) {
    return (
        <Box sx={{height: '100vh', display: 'flex', flexDirection: 'column', alignContent: 'center', justifyContent: 'center', marginX: 5}}>
            <Box sx={{maxWidth: '400px', marginX: 'auto'}}><Error /></Box>
            <Box sx={{marginY: 3}}>
                <Typography textAlign='center' variant='h6' sx={{fontWeight: 'bold'}}> {title} </Typography>
                <Typography textAlign='center' variant='body1'> {message} </Typography>
            </Box>           
        </Box>
    );
}

export default ErrorPage;