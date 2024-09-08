import { Box, Typography, Grow } from "@mui/material";
import { Diversity2 } from "@mui/icons-material";
import { useContext, useEffect } from "react";
import { UserContext } from "./contexts/usercontext.js";
import { SocketContext } from "./contexts/socketcontext.js";

function InitialContentPage() {

    const { socket } = useContext(SocketContext);
    const { user } = useContext(UserContext);

    useEffect(() => {
        function handleNewMessage(newMessage) {
            socket.emit('unread-message', newMessage);
        }
        function handleNewGroupMessage(newMessage) {
            socket.emit('unread-group-message', newMessage, user.id);
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
    }, [socket, user]);

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