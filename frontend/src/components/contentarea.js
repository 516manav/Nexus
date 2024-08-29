import { useState } from "react";
import { Send } from '@mui/icons-material';
import { Box, TextField, Fab, Zoom, Grow, Divider } from "@mui/material";
import MessageArea from "./messagearea.js";
import ContactBar from "./contactbar.js";
import InitialContentPage from "./initialcontentpage.js";

function ContentArea ({ user, isMobile, socket, userClicked, setUserClicked, transition }) {

    const [message, setMessage] = useState("");

    return (
        <Box component='main' sx={{
            marginLeft: isMobile ? 0 : '250px',
            flexGrow: 1,
            display: userClicked === null && 'flex',
            justifyContent: userClicked === null && 'center',
            alignItems: userClicked === null && 'center'
          }}>
            {userClicked !== null ?
            (<Box>
              <Grow in={transition} timeout={150}>
                <Box>
                  <ContactBar user={user} socket={socket} userClicked={userClicked} setUserClicked={setUserClicked}/>
                  <Divider />
                  <MessageArea />
                </Box>
              </Grow>
              <Box sx={{position: "fixed",
                height: '80px',
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: 'white',
              }} />
              <Grow in={true} sx={{position: "fixed",
                bottom: 16,
                left: isMobile ? 16 : 266,
                right: 16,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <Box>
                  <TextField variant="outlined" value={message} sx={{flexGrow: 1}} InputProps={{sx: {borderRadius: 5}}} placeholder="Message" multiline maxRows={3} onChange={e => setMessage(e.target.value)}/>
                  <Zoom in={Boolean(message)} timeout={250} mountOnEnter unmountOnExit>
                    <Fab aria-label="send" color="primary" onClick={() => {
                      setMessage(""); 
                    }}>
                      <Send />
                    </Fab>              
                  </Zoom>
                </Box>
              </Grow>
            </Box>) 
            : <InitialContentPage />}
        </Box>
    );
}

export default ContentArea;