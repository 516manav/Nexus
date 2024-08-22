import DrawerContent from "./drawercontent.js";
import { Drawer, Toolbar } from "@mui/material";

function Sidebar ({ isMobile, drawerOpen, handleDrawer, details, user }) {

    return (
        <Drawer variant={isMobile ? 'temporary' : 'permanent'}
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
            <DrawerContent details={details} user={user}/>
        </Drawer>
    );
}

export default Sidebar;