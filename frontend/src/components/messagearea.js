import { Box, Fab, Zoom } from "@mui/material";
import { KeyboardDoubleArrowDown } from '@mui/icons-material';
import React, { useEffect, useState, useRef, useContext, useMemo } from "react";
import { v4 as uuidv4 } from 'uuid';
import Message from "./message.js";
import { UserContext } from "./contexts/usercontext.js";
import { SocketContext } from "./contexts/socketcontext.js";
import { UserClickedContext } from "./contexts/userclickedcontext.js";
import { UserDeletedContext } from "./contexts/userdeletedcontext.js";

const MessageArea = React.memo(({ message, setMessage}) => {

    const { userDeleted }  = useContext(UserDeletedContext);
    const { user } = useContext(UserContext);
    const { socket } = useContext(SocketContext);
    const { userClicked } = useContext(UserClickedContext);
    const [messages, setMessages] = useState([]);
    const containerRef = useRef(null);
    const [showButton, setShowButton] = useState(false);
    const bottomRef = useRef(null);
    const groupMembers = useRef([]);
    const shouldScroll = useRef(false);

    useEffect(() => {
        if(userClicked.tab !== 2) { // for personal messages
            socket.emit('get-personal-messages', user.id, userClicked.id);
        } else { // for group messages
            socket.emit('get-group-messages', user.id, userClicked.id);
            socket.emit('get-group-members', userClicked.id);
        }
        function handleGroupMembers(members) {
            groupMembers.current = members.map(member => member.userid);
        }
        function handleMessages(messageArray) {
            shouldScroll.current = true;
            setMessages(messageArray.map(element => ({...element, messagetime: new Date(element.messagetime)})));
        }
        function handleNewMessage(newMessage) {
            if(newMessage.senderid === userClicked.id || newMessage.receiverid === userClicked.id) {
                setMessages(prevValue => [...prevValue, newMessage]);
                shouldScroll.current = true;
            } else
            socket.emit('unread-message', newMessage);
        }
        function handleNewGroupMessage(newMessage) {
            if(userClicked.tab === 2 && newMessage.groupid === userClicked.id) {
                setMessages(prevValue => [...prevValue, newMessage]);
                shouldScroll.current = true;
            } else
            socket.emit('unread-group-message', newMessage, user.id);
        }
        function handleDelete(messageid, everyone) {
            if(everyone)
            setMessages(prevValue => prevValue.map(message => message.id === messageid ? {...message, textmessage: 'This message was deleted.', everyone: everyone} : message));
            else 
            setMessages(prevValue => prevValue.filter(message => message.id !== messageid));
            shouldScroll.current = false;
        }
        function handleChatCleared() {
            shouldScroll.current = false;
            setMessages([]);
        }
        socket.on('deleted', handleDelete);
        socket.on('chat-cleared', handleChatCleared);
        socket.on('messages', handleMessages);
        socket.on('receive-personal-message', handleNewMessage);
        socket.on('receive-group-message', handleNewGroupMessage);
        socket.on('group-members', handleGroupMembers);
        return () => {
            socket.off('chat-cleared', handleChatCleared);
            socket.off('deleted', handleDelete);
            socket.off('personal-messages', handleMessages);
            socket.off('receive-personal-message', handleNewMessage);
            socket.off('receive-group-message', handleNewGroupMessage);
            socket.off('group-members', handleGroupMembers);
        };
    }, [socket, userClicked, user, userDeleted]);

    useEffect(() => {
        if(message !== ''){
            let newMessage;
            if(userClicked.tab !== 2) {
                newMessage = {id: uuidv4(), senderid: user.id, sendername: user.username, senderemail: user.email, receiverid: userClicked.id, textmessage: message, messagetime: new Date()};
                socket.emit('send-personal-message', newMessage);
            } else {
                newMessage = {id: uuidv4(), senderid: user.id, sendername: user.username, senderemail: user.email, groupid: userClicked.id, textmessage: message, messagetime: new Date()};
                socket.emit('send-group-message', newMessage, groupMembers.current.filter(member => member !== user.id));
            }
            setMessages(prevValue => [...prevValue, newMessage]);
            shouldScroll.current = true;
            setMessage('');
        }
    }, [message, setMessage, socket, user, userClicked]);

    useEffect(() => {
        if(shouldScroll.current) {
            scrollToBottom();
            shouldScroll.current = false;
        }
        const container = containerRef.current;
        container.addEventListener('scroll', handleScroll);
        return () => {
            container.removeEventListener('scroll', handleScroll);
        }
    }, [messages, containerRef]);

    function handleScroll() {
        if(containerRef.current) {
            setTimeout(() => {
                const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
                setShowButton(scrollTop + clientHeight < scrollHeight);
            }, 150);            
        }
    }

    function scrollToBottom() {
        if(bottomRef.current)
        bottomRef.current.scrollIntoView({behavior: 'smooth'});
    }

    function isSameDay(date1, date2) {
        if(typeof date1 !== 'object')
        date1 = new Date(date1);
        if(typeof date2 !== 'object')
        date2 = new Date(date2);
        return (date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate());
    }

    const memoizedMessages = useMemo(() => messages.map((message, index) => {
        const showdate = (index === 0 || !isSameDay(message.messagetime, messages[index-1].messagetime));
        const showsender = (showdate || message.senderid !== messages[index-1].senderid);
        if((userClicked.tab === 2 && message.groupid !== undefined) || (userClicked.tab !== 2 && message.groupid === undefined))
        return <Message showDate={showdate} showSender={showsender} members={groupMembers.current} key={message.id} messageDetails={message} isGroupMessage={userClicked.tab === 2}/>;
        return null;             
    }), [messages, userClicked]);
    
    return (
        <Box ref={containerRef} sx={{overflow: 'auto', height: '100%'}}>
            <Zoom in={showButton} onClick={scrollToBottom}><Fab size="small" sx={{position: 'fixed', backgroundColor: 'rgb(206, 206, 206)', bottom: {xs: 74, sm: 82}, right: 25}}><KeyboardDoubleArrowDown/></Fab></Zoom>
            {memoizedMessages}
            <Box ref={bottomRef} sx={{height: '3px'}} />
        </Box>
    );
});

export default MessageArea;