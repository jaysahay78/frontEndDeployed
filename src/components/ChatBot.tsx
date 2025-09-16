"use client";

import React, { useRef, useEffect, useState } from 'react';
import ChatForm from '@/components/ChatForm';
import ChatbotIcon from '@/components/Icon';
import ChatMessage from '@/components/ChatMessage';
import { 
  GoogleGenerativeAI,
} from '@google/generative-ai';
import { companyInfo } from '@/companyInfo';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

const model = genAI.getGenerativeModel({
  model: 'gemini-2.0-flash-exp',
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: 'text/plain',
};

interface ChatEntry {
  role: 'user' | 'model';
  text: string;
  hideInChat?: boolean;
}

type BotProps = {
    showChatbot: boolean;
    setShowChatbot: React.Dispatch<React.SetStateAction<boolean>>;
  };

  const Bot = ({ showChatbot, setShowChatbot }: BotProps) => {
  const [history, setHistory] = useState<ChatEntry[]>([
    { role: 'user', text: companyInfo, hideInChat: true },
  ]);
  const chatBodyRef = useRef<HTMLDivElement | null>(null);

  const generateBotResponse = async (updatedHistory: ChatEntry[]) => {
    const formattedHistory = updatedHistory.map(({ role, text }) => ({
      role,
      parts: [{ text }],
    }));

    try {
      const chatSession = model.startChat({
        generationConfig,
        history: formattedHistory,
      });

      const lastUserMessage = updatedHistory[updatedHistory.length - 1]?.text || '';
      const result = await chatSession.sendMessage(lastUserMessage);

      const cleanedResponse = result.response.text().replace(/\*+/g, '');

      setHistory(prev => {
        const updated = [...prev];
        const idx = updated.findIndex(msg => msg.text === 'thinking...');
        if (idx !== -1) updated[idx] = { role: 'model', text: cleanedResponse };
        else updated.push({ role: 'model', text: cleanedResponse });
        return updated;
      });
    } catch (error) {
      console.error('Error generating bot response:', error);
    }
  };

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTo({ top: chatBodyRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [history]);

  return (
    <div className={`container ${showChatbot ? 'show-chatbot' : ''}`}>
      <button onClick={() => setShowChatbot(prev => !prev)} id="chatbot-toggler">
        <span className="material-symbols-outlined">mode_comment</span>
        <span className="material-symbols-outlined">close</span>
      </button>
      <div className="chatbot-popup">
        <div className="chat-header">
          <div className="header-info">
            <ChatbotIcon />
            <h2 className="logo-text">Chatbot</h2>
          </div>
          <button onClick={() => setShowChatbot(prev => !prev)} className="material-symbols-outlined">
            keyboard_arrow_down
          </button>
        </div>

        <div ref={chatBodyRef} className="chat-body">
          <div className="message bot-message">
            <ChatbotIcon />
            <p className="message-text">Hey there! <br />How can I help you today?</p>
          </div>
          {history.map((chat, index) => (
            <ChatMessage key={index} chat={chat} />
          ))}
        </div>

        <div className="chat-footer">
          <ChatForm history={history} setHistory={setHistory} generateBotResponse={generateBotResponse} />
        </div>
      </div>
    </div>
  );
};

export default Bot;