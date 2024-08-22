import { useState } from "react";
import { Send } from '@mui/icons-material';
import { Box, TextField, Fab, Zoom } from "@mui/material";
import MessageArea from "./messagearea.js";

function ContentArea ({ isMobile }) {

    const [message, setMessage] = useState("");

    return (
        <Box component='main' sx={{
            marginLeft: isMobile ? 0 : '250px',
            position: "relative"
          }}>
            <MessageArea />
            <Box sx={{position: "fixed",
              height: '80px',
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: 'white',
              }} />
            <Box sx={{position: "fixed",
              bottom: 16,
              left: isMobile ? 16 : 266,
              right: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 1
              }}>
              <TextField variant="outlined" value={message} sx={{flexGrow: 1}} InputProps={{sx: {borderRadius: 5}}} placeholder="Message" multiline maxRows={3} onChange={e => setMessage(e.target.value)}/>
              <Zoom in={Boolean(message)} timeout={250} mountOnEnter unmountOnExit>
                <Fab aria-label="send" onClick={() => {
                  setMessage(""); 
                }}>
                  <Send />
                </Fab>
              </Zoom>
            </Box>
        </Box>
    );
}

export default ContentArea;