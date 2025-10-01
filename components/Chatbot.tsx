
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessageType, MessageAuthor } from '../types';
import ChatMessage from './ChatMessage';
import { SendIcon, BotIcon } from './Icons';

interface ChatbotProps {
  messages: ChatMessageType[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const Chatbot: React.FC<ChatbotProps> = ({ messages, onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="bg-brand-secondary/50 rounded-xl flex flex-col h-full max-h-[calc(100vh-12rem)]">
      <div className="p-4 border-b border-brand-secondary">
        <h2 className="text-xl font-semibold text-white">Chat with Room AI</h2>
      </div>
      <div className="flex-grow p-4 overflow-y-auto space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
            <BotIcon className="w-16 h-16 mb-4" />
            <h3 className="font-semibold">Welcome!</h3>
            <p className="text-sm">Upload a room image and then ask me anything about it.</p>
          </div>
        ) : (
          messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)
        )}
        {/* FIX: Use MessageAuthor enum members instead of string literals to match the defined types. */}
        {isLoading && messages.length > 0 && messages[messages.length-1].author === MessageAuthor.USER && (
           <ChatMessage message={{id: -1, author: MessageAuthor.BOT, text: '...'}} isTyping={true} />
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-brand-secondary">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about the rooms..."
            className="w-full bg-brand-primary border border-brand-secondary text-brand-light rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-accent"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-brand-accent text-brand-primary p-2 rounded-lg disabled:bg-gray-500 disabled:cursor-not-allowed hover:bg-indigo-400 transition-colors"
          >
            <SendIcon className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chatbot;
