import DrawerContent from "./drawercontent.js";
import { Drawer, Toolbar } from "@mui/material";

function Sidebar ({ isMobile, drawerOpen, handleDrawer }) {

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
            <DrawerContent />
        </Drawer>
    );
}

export default Sidebar;