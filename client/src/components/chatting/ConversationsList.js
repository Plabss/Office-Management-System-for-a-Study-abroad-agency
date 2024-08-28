import React from 'react';
import { Link } from 'react-router-dom';

const fakeConversations = [
  {
    "conversationId": "1",
    "title": "Project Alpha Discussion",
    "lastMessage": "Sure, I'll send the files by EOD.",
    "lastMessageTime": "2024-08-21T14:30:00Z",
    "participants": ["Alice", "Bob", "Charlie"]
  },
  {
    "conversationId": "2",
    "title": "HR Meeting",
    "lastMessage": "The meeting is scheduled for next Monday.",
    "lastMessageTime": "2024-08-20T09:15:00Z",
    "participants": ["David", "Eve", "Frank"]
  },
  {
    "conversationId": "3",
    "title": "Sales Team Strategy",
    "lastMessage": "Let's finalize the strategy tomorrow.",
    "lastMessageTime": "2024-08-19T16:45:00Z",
    "participants": ["Grace", "Heidi", "Ivan"]
  }
];

const ConversationsList = () => {
  return (
    <div className="conversations-list">
      <h2>Conversations</h2>
      <ul>
        {fakeConversations.map((conversation) => (
          <li key={conversation.conversationId}>
            <Link to={`/conversation/${conversation.conversationId}`}>
              <h3>{conversation.title}</h3>
              <p>{conversation.lastMessage}</p>
              <small>{new Date(conversation.lastMessageTime).toLocaleString()}</small>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ConversationsList;
