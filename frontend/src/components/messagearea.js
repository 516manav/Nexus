import { Box } from "@mui/material";
import Message from './message.js';

function MessageArea () {
    return (
        <Box sx={{ marginLeft: 3}}>
            <Message />
            <Box sx={{
              height: '80px',
              backgroundColor: 'white',
              }} />
        </Box>
    );
}

export default MessageArea;