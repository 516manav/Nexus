import React, { useContext, useEffect, useState } from "react";
import { Send } from '@mui/icons-material';
import { Box, TextField, Fab, Zoom, Grow } from "@mui/material";
import MessageArea from "./messagearea.js";
import ContactBar from "./contactbar.js";
import InitialContentPage from "./initialcontentpage.js";
import { UserClickedContext } from "./contexts/userclickedcontext.js";
import { TransitionContext } from "./contexts/transitioncontext.js";

const ContentArea = React.memo(({ isMobile }) => {

    const { userClicked } = useContext(UserClickedContext);
    const { transition } = useContext(TransitionContext);
    const [message, setMessage] = useState("");
    const [send, setSend] = useState('');

    useEffect(() => {
      setMessage('');
    }, [transition]);

    function handleClick() {
      setSend(message);
      setMessage("");
    }

    return (
        <Box component='main' sx={{
            marginLeft: isMobile ? 0 : '250px',
            flexGrow: 1,
            display: userClicked === null && 'flex',
            justifyContent: userClicked === null && 'center',
            alignItems: userClicked === null && 'center',
            height: 'calc(100vh - 67px)'
          }}>
            {userClicked !== null ?
            (<Box sx={{minWidth: 0, display: 'flex', flexDirection: 'column', height: '100%'}}>
                <Box sx={{display: 'flex', flexDirection: 'column', height: '100%'}}>
                  <ContactBar />
                  <Box sx={{flexGrow: 1, overflowY: 'auto'}}><MessageArea setMessage={setSend} message={send}/></Box>
                  <Grow in={transition} timeout={200} sx={{
                    width: 'calc(100%-32px)',
                    marginTop: '5px',
                    marginBottom: '8px',
                    marginLeft: '16px',
                    marginRight: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}>
                    <Box sx={{display: 'flex', width: '100%'}}>
                      <TextField variant="outlined" value={message} sx={{flexGrow: 1}} InputProps={{sx: {borderRadius: 5}}} placeholder="Message" multiline maxRows={3} onChange={e => setMessage(e.target.value)}/>
                      <Zoom in={Boolean(message)} timeout={250} mountOnEnter unmountOnExit>
                        <Fab aria-label="send" color="primary" onClick={handleClick}>
                          <Send />
                        </Fab>              
                      </Zoom>
                    </Box>
                  </Grow>
                </Box>
            </Box>)           
            : <InitialContentPage />}
        </Box>
    );
});

export default ContentArea;