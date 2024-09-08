import DrawerContent from "./drawercontent.js";
import { Drawer, Toolbar } from "@mui/material";
import React from "react";

const Sidebar = React.memo(({ isMobile, drawerOpen, handleDrawer }) => {

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
            <DrawerContent handleDrawer={handleDrawer}/>
        </Drawer>
    );
});

export default Sidebar;