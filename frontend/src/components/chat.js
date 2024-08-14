import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { v4 } from "uuid";
import { Tooltip, IconButton } from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

function Chat() {

  const userName = 'Manav';
  const socket = io("http://localhost:8080", { autoConnect: false });
  const navigate = useNavigate();

  useEffect(() => {
    socket.connect();
    socket.emit("new-user", userName);
    return () => {
      socket.disconnect();
    };
  }, [socket]);

  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const hasJoined = useRef(false);

  async function handleLogout() {
    try{
      const response = await axios.get('http://localhost:8080/logout', { withCredentials: true });
      if(response.data.result)
      navigate('/');
      else 
      alert('Logout Failed. Please try again!');
    }catch(err){
      console.log(err);
    }
  }

  function addMessages(message) {
    setChatMessages( prevChatMessages => [...prevChatMessages, message]);
  }
  
  function handleKeydown(event) {
    if(event.key==='Enter' && message){
      sendMessage();
    }
  }

  function sendMessage() {
    socket.emit("send-chat-message", message);
    addMessages("You: "+message);
    setMessage("");
  }

  useEffect(() => {
    socket.on("receive-chat-message", addMessages);
    socket.on("user-connected", addMessages);
    socket.on("user-disconnected", addMessages);
    if(!hasJoined.current){
      addMessages("You joined.");
      hasJoined.current = true;
    }

    return (() => {
      socket.off("user-connected", addMessages);
      socket.off("receive-chat-message", addMessages);
      socket.off("user-disconnected", addMessages);
    });
  }, [message, socket]);

  return (
    <div className="chat-container">
      {
      chatMessages.map( chatMessage => {
        return (
          <div key={v4()}>
          <em>{chatMessage}</em>
          <br />
          </div>
        )
        }
      )
      }
      <input type="text" value={message} placeholder='Message' onKeyDown={handleKeydown} onChange={ event => {
        setMessage(event.target.value);
      }} />
      <button type="submit" onClick={() => {
        if(message){
          sendMessage();
        }
      }} >Send</button>
      <Tooltip title='Logout'>
        <IconButton aria-label="logout" onClick={handleLogout}>
          <LogoutIcon />
        </IconButton>
      </Tooltip>
    </div>
  );
}

export default Chat;