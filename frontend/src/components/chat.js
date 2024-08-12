import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { v4 } from "uuid";

const userName = 'Manav';
const socket = io("http://localhost:8080", { autoConnect: false });

function Chat() {

  useEffect(() => {
    socket.connect();
    socket.emit("new-user", userName);
    return () => {
      socket.disconnect();
    };
  }, []);

  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const hasJoined = useRef(false);

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
  }, [message]);

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
    </div>
  );
}

export default Chat;