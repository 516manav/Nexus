import { useState, useRef, useEffect } from "react";
import { Chip, Box, TextField, InputAdornment, CircularProgress } from "@mui/material";
import { Search } from '@mui/icons-material';
import ContactList from './contactlist.js';

function DrawerContent ({ details, user }) {

    const [activeChip, setActiveChip] = useState(1);
    const currentChip = useRef(1);
    const [isLoading, setIsLoading] = useState(false);
    const search = useRef('');
    const [content, setContent] = useState(null);

    useEffect(() => {
      if(details.users)
      setContent(details.users.filter(element => element.id !== user.id));
    }, [details, user]);

    function handleSearch() {
      setIsLoading(true);
      setActiveChip(currentChip.current);
      if(currentChip.current === 1){
        if(search.current !== '')
        setContent(details.users.filter(element => element.email.slice(0, Math.min(search.current.length, element.email.length)) === search.current && element.id !== user.id));
        else
        setContent(details.users.filter(element => element.id !== user.id));
      }else if(currentChip.current === 2){
        if(search.current !== '')
        setContent(details.groups.filter(element => element.name.slice(0, Math.min(search.current.length, element.name.length)) === search.current));
        else
        setContent(details.groups);
      }else{
        if(search.current !== '')
          setContent(details.favourites.filter(element => element.email.slice(0, Math.min(search.current.length, element.email.length)) === search.current && element.id !== user.id));
          else
          setContent(details.favourites);
      }
    }

    return (
        <Box>
          <Box sx={{display: 'flex', justifyContent: 'space-around', p: 1}}>
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
                {isLoading ? <CircularProgress sx={{width: '20px !important', height: '20px !important'}}/> : <Search />}
              </InputAdornment>
            )}} />
            {content === null ? "" : <ContactList content={content} setIsLoading={setIsLoading}/>}
        </Box>
    );
}

export default DrawerContent;