import { Box, Fab, Zoom } from "@mui/material";
import { KeyboardDoubleArrowDown } from '@mui/icons-material';
import { useEffect, useState, useRef } from "react";
import { v1 as uuidv1 } from 'uuid';
import Message from "./message.js";

function MessageArea ({ message, setMessage, socket, userClicked, user }) {

    const [messages, setMessages] = useState([]);
    const containerRef = useRef(null);
    const [showButton, setShowButton] = useState(false);
    const bottomRef = useRef(null);

    useEffect(() => {
        socket.emit('get-personal-messages', user.id, userClicked.id);
        function handleMessages(messageArray) {
            setMessages(messageArray);
        }
        function handleNewMessage(newMessage) {
            if(newMessage.senderid === userClicked.id || newMessage.receiverid === userClicked.id) {
                setMessages(prevValue => [...prevValue, newMessage]);
                scrollToBottom();
            } else
            socket.emit('unread-message', newMessage);
        }
        function handleDelete(messageid) {
            setMessages(prevValue => prevValue.filter(message => message.id !== messageid));
        }
        function handleChatCleared() {
            setMessages([]);
        }
        socket.on('deleted', handleDelete);
        socket.on('chat-cleared', handleChatCleared);
        socket.on('personal-messages', handleMessages);
        socket.on('receive-personal-message', handleNewMessage);
        return () => {
            socket.off('chat-cleared', handleChatCleared);
            socket.off('deleted', handleDelete);
            socket.off('personal-messages', handleMessages);
            socket.off('receive-personal-message', handleNewMessage);
        };
    }, [socket, userClicked, user]);

    useEffect(() => {
        if(message !== ''){
            const newMessage = {id: uuidv1(), senderid: user.id, sendername: user.username, senderemail: user.email, receiverid: userClicked.id, textmessage: message, messagetime: new Date()};
            socket.emit('send-personal-message', newMessage);
            setMessages(prevValue => [...prevValue, newMessage]);
            setMessage('');
        }
    }, [message, setMessage, socket, user, userClicked]);

    useEffect(() => {
        scrollToBottom();
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
    
    return (
        <Box ref={containerRef} sx={{overflow: 'auto', height: '100%'}}>
            <Zoom in={showButton} onClick={scrollToBottom}><Fab size="small" sx={{position: 'fixed', backgroundColor: 'rgb(206, 206, 206)', bottom: {xs: 74, sm: 82}, right: 25}}><KeyboardDoubleArrowDown/></Fab></Zoom>
            <Box sx={{height: '4px'}} />
            {messages.map(message => <Message key={message.id} messageid={message.id} sender={message.senderid} user={user.id} userClicked={userClicked.id} socket={socket} message={message.textmessage} time={message.messagetime}/>)}
            <Box ref={bottomRef} sx={{height: '3px'}} />
        </Box>
    );
}

export default MessageArea;