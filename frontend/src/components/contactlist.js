import { useContext, useEffect, useState } from "react";
import { List, ListItem, ListItemButton, ListItemAvatar, Avatar, ListItemText, Typography, Grow, IconButton, Tooltip, Fab, Zoom, Box, Badge } from "@mui/material";
import { PriorityHighOutlined, Favorite, FavoriteBorder, GroupRemove, Add } from '@mui/icons-material';
import CreateGroup from "./creategroup.js";
import isEqual from 'lodash/isEqual.js';
import { UserContext } from "./contexts/usercontext.js";
import { SocketContext } from "./contexts/socketcontext.js";
import { UserClickedContext } from "./contexts/userclickedcontext.js";
import { ListClickContext } from "./contexts/listclickcontext.js";

function ContactList({ content, tab, handleDrawer }) {

    const { handleListClick } = useContext(ListClickContext);
    const { userClicked } = useContext(UserClickedContext);
    const { user } = useContext(UserContext);
    const { socket } = useContext(SocketContext);
    const [hover, setHover] = useState(-1);
    const [array, setArray] = useState(null);
    const [favourites, setFavourites] = useState(null);
    const [buttons, setButtons] = useState(null);
    const [showCreateGroup, setShowCreateGroup] = useState(false);
    const [transition, setTransition] = useState(true);
    const [selected, setSelected] = useState(-1);

    useEffect(() => {
        if(content && array && isEqual(content.array.map(element => ({...element, messagecount: 0})), array.map(element => ({...element, messagecount: 0}))))
        setArray(content.array);
        else if(!isEqual(content.array, array)){
            setTransition(false);
            setTimeout(() => {
                setTransition(true);
            }, 25);
            setArray(content.array);
        }
        setFavourites(content.favourites);
    }, [content, array]);

    useEffect(() => {
        if(tab === 1)
        setButtons({
            filled: <Favorite />,
            outline: <FavoriteBorder />,
            filledTip: 'Remove from Favourites',
            outlineTip: 'Add to Favourites'
            
        });
        else if(tab === 3)
        setButtons({
            filled: <Favorite />,
            outline: <Favorite />,
            filledTip: 'Remove from Favourites',
            outlineTip: 'Remove from Favourites'                
        });
        else
        setButtons({
            filled: <GroupRemove />,
            outline: <GroupRemove />,
            filledTip: 'Leave Group',
            outlineTip: 'Leave Group' 
        })
    }, [tab]);

    function handleClick(element) {
        setSelected(element.id);
        if(element.messagecount > 0)
        socket.emit('remove-unread', user.id, element.id, !Boolean(element.email));
        handleListClick({...element, tab: tab});
        handleDrawer();
    }

    function isFavourite(favouriteId) {
        return favourites.includes(favouriteId);
    }

    function handleFavourites(id) {
        if(tab === 1){
            if(!favourites.includes(id))
            socket.emit('add-favourite', user.id, id);
            else
            socket.emit('delete-favourite', user.id, id);
        }else if(tab === 3) {
            socket.emit('delete-favourite', user.id, id);
        }else{
            socket.emit('leave-group', user, id);
            if( userClicked && userClicked.id === id && tab === 2)
            handleListClick(null);
        }
    }

    function contentGenerator() {
        if(transition) {
        if(array && array.length !== 0)
        return array.map(element => (
            <Grow in={transition} timeout={250} key={element.id}>
                <ListItem disablePadding onMouseEnter={() => setHover(element.id)} onMouseLeave={() => setHover(-1)}>
                    <ListItemButton  selected={selected === element.id} >
                        <ListItemAvatar onClick={() => handleClick(element)}>
                            <Badge badgeContent={element.messagecount} color="primary">
                                <Avatar>
                                    {element.name.split(' ').slice(0, 2).map(word => word.charAt(0).toUpperCase()).join('')}
                                </Avatar>
                            </Badge>
                        </ListItemAvatar>
                        <ListItemText onClick={() => handleClick(element)} primary={element.name} secondary={element.email} 
                        sx={{'& .MuiListItemText-primary': {
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                            },
                            '& .MuiListItemText-secondary': {
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                            }}}/>
                        <Grow in={element.id === hover} timeout={250}>
                            <Tooltip title={favourites && isFavourite(element.id) ? buttons.filledTip : buttons.outlineTip}>
                                <IconButton edge='end' onClick={() => handleFavourites(element.id)}>
                                    {favourites && isFavourite(element.id) ? buttons.filled : buttons.outline}
                                </IconButton>
                            </Tooltip>
                        </Grow>
                    </ListItemButton>
                </ListItem>
            </Grow>
        ));
        else
        return (<Grow in={true} timeout={250}><Typography variant='body1' sx={{textAlign: 'center', fontSize: '1rem', paddingY: 2}}><PriorityHighOutlined sx={{verticalAlign: 'sub', fontSize: '1.2rem'}} />No data found</Typography></Grow>)
    }}

    return(
        <Box>
            <List>
                {contentGenerator()}
            </List>
            <br />
            <br />
            <Zoom in={tab === 2} >
                <Tooltip title='Create Group'>
                    <Fab color="primary" size="large" sx={{
                        position: 'fixed',
                        bottom: 8,
                        left: 179
                    }} onClick={() => setShowCreateGroup(true)}>
                        <Add />
                    </Fab>
                </Tooltip>        
            </Zoom>
            <CreateGroup open={showCreateGroup} setOpen={setShowCreateGroup}/>
        </Box>
    );
}

export default ContactList;