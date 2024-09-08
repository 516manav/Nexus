import React, { useState, useRef, useEffect, useContext } from "react";
import { Chip, Box, TextField, InputAdornment } from "@mui/material";
import { Search } from '@mui/icons-material';
import ContactList from './contactlist.js';
import { UserContext } from "./contexts/usercontext.js";
import { UserDetailsContext } from "./contexts/userdetails.js";

const DrawerContent = React.memo(({ handleDrawer }) => {

    const { userDetails } = useContext(UserDetailsContext);
    const { user } = useContext(UserContext);
    const [activeChip, setActiveChip] = useState(1);
    const currentChip = useRef(1);
    const search = useRef('');
    const [content, setContent] = useState(null);

    useEffect(() => {
      if(currentChip.current === 1)
      setContent({array: userDetails.users.filter(element => element.id !== user.id), favourites: userDetails.favourites.map(element => element.id)});
      else if(currentChip.current === 2)
      setContent({array: userDetails.groups});
      else
      setContent({array: userDetails.favourites});
    }, [userDetails, user]);

    function handleSearch() {
      setActiveChip(currentChip.current);
      if(currentChip.current === 1){
        if(search.current !== '')
        setContent({array: userDetails.users.filter(element => element.email.slice(0, Math.min(search.current.length, element.email.length)) === search.current && element.id !== user.id), favourites: userDetails.favourites.map(element => element.id)});
        else
        setContent({array: userDetails.users.filter(element => element.id !== user.id), favourites: userDetails.favourites.map(element => element.id)});
      }else if(currentChip.current === 2){
        if(search.current !== '')
        setContent({array: userDetails.groups.filter(element => element.name.slice(0, Math.min(search.current.length, element.name.length)) === search.current)});
        else
        setContent({array: userDetails.groups});
      }else{
        if(search.current !== '')
        setContent({array: userDetails.favourites.filter(element => element.email.slice(0, Math.min(search.current.length, element.email.length)) === search.current && element.id !== user.id)});
        else
        setContent({array: userDetails.favourites});
      } 
    }

    return (
        <Box>
          <Box sx={{display: 'flex', justifyContent: 'space-between', p: 1}}>
            <Chip label="All users" variant={activeChip === 1 ? "" : "outlined"} onClick={() => {currentChip.current = 1; handleSearch();}} />
            <Chip label="Groups" variant={activeChip === 2 ? "" : "outlined"} onClick={() => {currentChip.current = 2; handleSearch();}} />
            <Chip label="Favourites" variant={activeChip === 3 ? "" : "outlined"} onClick={() => {currentChip.current = 3; handleSearch();}} />
          </Box>
          <TextField variant="outlined" value={search.current} onChange={(event) => {
            search.current = event.target.value;
            handleSearch();
          }} placeholder="Search" sx={{paddingX: 1, width: '100%', boxSizing: 'border-box', '& .MuiInputBase-root':{paddingRight: '8px'}}} 
          InputProps={
            {sx: {borderRadius: 10, '& .MuiInputBase-input': { paddingY: '5px', paddingLeft: '10px' }},
            endAdornment: (
              <InputAdornment position='end'>
                <Search />
              </InputAdornment>
            )}} />
            {content === null ? "" : <ContactList content={content} tab={activeChip} handleDrawer={handleDrawer}/>}
        </Box>
    );
});

export default DrawerContent;