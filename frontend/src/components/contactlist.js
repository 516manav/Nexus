import { useEffect } from "react";
import { List, ListItemButton, ListItemAvatar, Avatar, ListItemText, Typography, Grow } from "@mui/material";
import ErrorIcon from '@mui/icons-material/PriorityHighOutlined';

function ContactList({ content, setIsLoading }) {

    function contentGenerator() {
        if(content && content.length !== 0)
        return content.map((element, index) => (
            <Grow in={true} timeout={250}>
                <ListItemButton key={index} 
                // onClick={() => handleListClick(element.id)}
                >
                    <ListItemAvatar>
                        <Avatar>
                            {element.name.split(' ').map(word => word.charAt(0).toUpperCase()).join('')}
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={element.name} secondary={element.email} />
                </ListItemButton>
            </Grow>
        ));
        else
        return (<Grow in={true} timeout={250}><Typography variant='body1' sx={{textAlign: 'center', fontSize: '1rem', paddingY: 2}}><ErrorIcon sx={{verticalAlign: 'sub', fontSize: '1.2rem'}} />No data found</Typography></Grow>)
    }        

    useEffect(() => {
        setIsLoading(false);
    });

    return(
        <List>
            {contentGenerator()}
        </List>
    );
}

export default ContactList;