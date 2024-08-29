import { useState, useRef, useEffect } from "react";
import { Chip, Box, TextField, InputAdornment } from "@mui/material";
import { Search } from '@mui/icons-material';
import ContactList from './contactlist.js';

function DrawerContent ({ details, socket, user, handleListClick, handleDrawer }) {

    const [activeChip, setActiveChip] = useState(1);
    const currentChip = useRef(1);
    const search = useRef('');
    const [content, setContent] = useState(null);

    useEffect(() => {
      if(currentChip.current === 1)
      setContent({array: details.users.filter(element => element.id !== user.id), favourites: details.favourites.map(element => element.id)});
      else if(currentChip.current === 2)
      setContent({array: details.groups});
      else
      setContent({array: details.favourites});      
    }, [details, user]);

    function handleSearch() {
      setActiveChip(currentChip.current);
      if(currentChip.current === 1){
        if(search.current !== '')
        setContent({array: details.users.filter(element => element.email.slice(0, Math.min(search.current.length, element.email.length)) === search.current && element.id !== user.id), favourites: details.favourites.map(element => element.id)});
        else
        setContent({array: details.users.filter(element => element.id !== user.id), favourites: details.favourites.map(element => element.id)});
      }else if(currentChip.current === 2){
        if(search.current !== '')
        setContent({array: details.groups.filter(element => element.name.slice(0, Math.min(search.current.length, element.name.length)) === search.current)});
        else
        setContent({array: details.groups});
      }else{
        if(search.current !== '')
        setContent({array: details.favourites.filter(element => element.email.slice(0, Math.min(search.current.length, element.email.length)) === search.current && element.id !== user.id)});
        else
        setContent({array: details.favourites});
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
            {content === null ? "" : <ContactList users={details.users.map(element => element.email).filter(element => element !== user.email)} content={content} user={user} socket={socket} tab={currentChip.current} handleDrawer={handleDrawer} handleListClick={handleListClick}/>}
        </Box>
    );
}

export default DrawerContent;