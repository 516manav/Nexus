import Error from './animation.js';
import { Box, Typography } from '@mui/material';

function ErrorPage() {
    return (
        <Box sx={{height: '100vh', display: 'flex', flexDirection: 'column', alignContent: 'center', justifyContent: 'center', marginX: 5}}>
            <Box sx={{maxWidth: '400px', marginX: 'auto'}}><Error /></Box>
            <Box sx={{marginY: 3}}>
                <Typography textAlign='center' variant='h6' sx={{ color: 'rgb(37, 86, 155)', fontWeight: 'bold'}}>Page Not Found</Typography>
                <Typography textAlign='center' variant='body1'>The resource that you're looking for is not available. Please check the url of the resource that you're looking for and try again.</Typography>
            </Box>           
        </Box>
    );
}

export default ErrorPage;