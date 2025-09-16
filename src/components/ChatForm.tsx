"use client";

import React, { useRef, FormEvent } from 'react';

interface ChatEntry {
  role: 'user' | 'model';
  text: string;
}

interface ChatFormProps {
  history: ChatEntry[];
  setHistory: React.Dispatch<React.SetStateAction<ChatEntry[]>>;
  generateBotResponse: (history: ChatEntry[]) => void;
}

const ChatForm: React.FC<ChatFormProps> = ({ history, setHistory, generateBotResponse }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    const message = inputRef.current?.value.trim();
    if (!message) return;
    if (inputRef.current) inputRef.current.value = '';

    const userMsg: ChatEntry = { role: 'user', text: message };
    const placeholder: ChatEntry = { role: 'model', text: 'thinking...' };

    setHistory(prev => [...prev, userMsg, placeholder]);

    setTimeout(() => {
      generateBotResponse([...history, userMsg]);
    }, 600);
  };

  return (
    <form className="chat-form" onSubmit={handleFormSubmit}>
      <input ref={inputRef} type="text" placeholder="Message..." className="message-input" required />
      <button className="material-symbols-outlined">arrow_upward</button>
    </form>
  );
};

export default ChatForm;