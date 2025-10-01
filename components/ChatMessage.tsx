
import React from 'react';
import { ChatMessageType, MessageAuthor } from '../types';
import { UserIcon, BotIcon } from './Icons';

interface ChatMessageProps {
  message: ChatMessageType;
  isTyping?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isTyping = false }) => {
  const isUser = message.author === MessageAuthor.USER;

  const wrapperClasses = `flex items-start gap-3 ${isUser ? 'justify-end' : 'justify-start'}`;
  const bubbleClasses = `max-w-xs md:max-w-md lg:max-w-xs xl:max-w-md p-3 rounded-2xl ${isUser ? 'bg-brand-accent text-brand-primary rounded-br-none' : 'bg-brand-secondary text-brand-light rounded-bl-none'}`;
  const iconClasses = `w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${isUser ? 'bg-indigo-200 text-indigo-700' : 'bg-slate-700 text-slate-300'}`;

  return (
    <div className={wrapperClasses}>
      {!isUser && (
        <div className={iconClasses}>
          <BotIcon className="w-5 h-5" />
        </div>
      )}
      <div className={bubbleClasses}>
        {isTyping ? (
          <div className="flex items-center space-x-1">
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.3s]"></span>
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.15s]"></span>
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></span>
          </div>
        ) : (
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
        )}
      </div>
       {isUser && (
        <div className={iconClasses}>
          <UserIcon className="w-5 h-5" />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
