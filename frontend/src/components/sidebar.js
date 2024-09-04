import DrawerContent from "./drawercontent.js";
import { Drawer, Toolbar } from "@mui/material";

function Sidebar ({ isMobile, drawerOpen, handleDrawer, details, user, socket, handleListClick }) {

    return (
        <Drawer variant={isMobile ? 'temporary' : 'permanent'}
        {...(isMobile ? {keepMounted: true} : {})}
        anchor="left"
        open={drawerOpen || !isMobile}
        onClose={handleDrawer}
        sx={{
            width: 250,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
            width: 250,
            boxSizing: 'border-box'
            }
        }} >
            <Toolbar />
            <DrawerContent handleListClick={handleListClick} details={details} user={user} socket={socket} handleDrawer={handleDrawer}/>
        </Drawer>
    );
}

export default Sidebar;