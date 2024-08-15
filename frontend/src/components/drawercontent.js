import { useState } from "react";
import { Chip, Box } from "@mui/material";

function DrawerContent () {

    const [activeChip, setActiveChip] = useState({
        chip1: "outlined",
        chip2: "",
        chip3: ""
    });  

    return (
        <Box>
          <Box sx={{display: 'flex', justifyContent: 'space-between', p: 1}}>
            <Chip label="All users" variant={activeChip.chip1} onClick={() => setActiveChip({chip1: "", chip2: "outlined", chip3: "outlined"})}/>
            <Chip label="Groups" variant={activeChip.chip2} onClick={() => setActiveChip({chip1: "outlined", chip2: "", chip3: "outlined"})}/>
            <Chip label="Favourites" variant={activeChip.chip3} onClick={() => setActiveChip({chip1: "outlined", chip2: "outlined", chip3: ""})}/>
          </Box>
        </Box>
    );
}

export default DrawerContent;