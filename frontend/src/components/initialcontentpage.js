import { Box, Typography, Grow } from "@mui/material";
import { Diversity2 } from "@mui/icons-material";
import { useEffect } from "react";

function InitialContentPage({ socket }) {

    useEffect(() => {
        function handleNewMessage(newMessage) {
            socket.emit('unread-message', newMessage);
        }
        if(socket)
        socket.on('receive-personal-message', handleNewMessage);

        return () => {
            if(socket)
            socket.off('receive-personal-message', handleNewMessage);
        }
    }, [socket]);

    return(
        <Box sx={{color: '#bdbdbd', textAlign: 'center'}}>
            <Grow in={true} timeout={475}>
                <Box sx={{m: 1}}>
                    <Diversity2 sx={{fontSize: 40}}/>
                    <Typography variant="h6" sx={{fontWeight: 'bold'}}>Nexus</Typography>
                    <Typography variant="body2">Ignite Conversations: Build Your Nexus.</Typography>
                    <Typography variant="body2">Open a chat to continue.</Typography>
                </Box>
            </Grow>
            
        </Box>
    );
}

export default InitialContentPage;