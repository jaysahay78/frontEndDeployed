"use client";

import React from 'react';
import ChatbotIcon from '@/components/Icon';

interface ChatEntry {
  role: 'user' | 'model';
  text: string;
  hideInChat?: boolean;
}

const ChatMessage: React.FC<{ chat: ChatEntry }> = ({ chat }) => {
  if (chat.hideInChat) return null;

  return (
    <div className={`message ${chat.role === 'model' ? 'bot' : 'user'}-message`}>
      {chat.role === 'model' && <ChatbotIcon />}
      <p className="message-text">{chat.text}</p>
    </div>
  );
};

export default ChatMessage;