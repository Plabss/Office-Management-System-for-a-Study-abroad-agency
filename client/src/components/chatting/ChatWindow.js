import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io('http://localhost:5000'); // Connect to your backend server

const fakeMessages = {
  "1": [
    {
      "messageId": "101",
      "sender": "Alice",
      "content": "Hey team, are we all set for the presentation tomorrow?",
      "timestamp": "2024-08-21T13:45:00Z"
    },
    {
      "messageId": "102",
      "sender": "Bob",
      "content": "I just need to finalize a few slides.",
      "timestamp": "2024-08-21T13:50:00Z"
    },
    {
      "messageId": "103",
      "sender": "Charlie",
      "content": "Sure, I'll send the files by EOD.",
      "timestamp": "2024-08-21T14:30:00Z"
    }
  ]
};

const ChatWindow = () => {
  const { conversationId } = useParams();
  const [messages, setMessages] = useState(fakeMessages[conversationId] || []);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    socket.emit('joinConversation', conversationId);

    socket.on('newMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off('newMessage');
    };
  }, [conversationId]);

  const handleSendMessage = () => {
    const senderId = 'You'; // Replace with actual sender ID or name
    socket.emit('sendMessage', { conversationId, senderId, content: newMessage });
    setNewMessage('');
  };

  return (
    <div className="chat-window">
      <div className="messages-list">
        {messages.map((message) => (
          <div key={message.messageId}>
            <strong>{message.sender}</strong>: {message.content}
            <small>{new Date(message.timestamp).toLocaleString()}</small>
          </div>
        ))}
      </div>
      <div className="message-input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatWindow;
