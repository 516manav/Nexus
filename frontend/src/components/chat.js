import { useState } from "react";
import Navbar from "./navbar.js";
import { useTheme, useMediaQuery, Box } from "@mui/material";
import Sidebar from "./sidebar.js";
import ContentArea from "./contentarea.js";

function Chat() {

  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  function handleDrawer(){
    setDrawerOpen( prevValue => !prevValue);
  }

  return (
    <Box>
      <Navbar theme={theme} isMobile={isMobile} drawerOpen={drawerOpen} handleDrawer={handleDrawer} />
      <Sidebar isMobile={isMobile} drawerOpen={drawerOpen} handleDrawer={handleDrawer}/>
      <ContentArea isMobile={isMobile}/>
    </Box>
  );
}

export default Chat;