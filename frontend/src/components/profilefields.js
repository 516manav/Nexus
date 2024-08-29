import { Edit } from "@mui/icons-material";
import { useRef } from "react";
import { TextField, InputAdornment, IconButton, Fade } from "@mui/material";

function ProfileFields({ setHover, hover, edit, value, label, setProfile, handleTransition, isAdmin }) {
    const textfieldRef = useRef(null);
    return (<TextField fullWidth inputRef={textfieldRef} onMouseEnter={() => setHover(label)} onMouseLeave={() => setHover('')} label={label} value={value} size="small" sx={{marginY: 1}} 
    onChange={e => setProfile(prevValue => {
            if(label !== 'Status')
            return ({
                ...prevValue,
                [label.toLowerCase()]: e.target.value 
            });
            else
            return ({
                ...prevValue,
                status: e.target.value.slice(0, 140) 
            });
        })}
    InputProps={{ readOnly: !edit, sx: {borderRadius: 2}, endAdornment: (<Fade in={!edit && hover === label && isAdmin} timeout={125}><InputAdornment position="end">
        <IconButton onClick={() => {
            handleTransition(true);
            if(textfieldRef.current)
            textfieldRef.current.focus();
    }} edge='end'><Edit /></IconButton></InputAdornment></Fade>)}}
    helperText={label === 'Status' && edit ? <em>{value.length+'/140'}</em> : ''} />);
}

export default ProfileFields;