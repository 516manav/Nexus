import { Box, Typography, Grow } from "@mui/material";
import { Diversity2 } from "@mui/icons-material";
import { useEffect } from "react";

function InitialContentPage({ socket, userId }) {

    useEffect(() => {
        function handleNewMessage(newMessage) {
            socket.emit('unread-message', newMessage);
        }
        function handleNewGroupMessage(newMessage) {
            socket.emit('unread-group-message', newMessage, userId);
        }
        if(socket) {
            socket.on('receive-personal-message', handleNewMessage);
            socket.on('receive-group-message', handleNewGroupMessage);
        }

        return () => {
            if(socket) {
                socket.off('receive-personal-message', handleNewMessage);
                socket.off('receive-group-message', handleNewGroupMessage);
            }
        }
    }, [socket, userId]);

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