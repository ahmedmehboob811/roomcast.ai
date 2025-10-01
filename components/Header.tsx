
import React from 'react';
import { CameraIcon } from './Icons';

const Header: React.FC = () => {
  return (
    <header className="bg-brand-secondary/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CameraIcon className="w-8 h-8 text-brand-accent" />
          <h1 className="text-2xl font-bold text-white tracking-tight">
            RoomCast AI
          </h1>
        </div>
        <a 
          href="https://github.com/google/genai-projects/tree/main/web/react-room-cast" 
          target="_blank" 
          rel="noopener noreferrer"
          className="px-4 py-2 text-sm font-medium bg-brand-accent text-brand-primary rounded-md hover:bg-indigo-400 transition-colors"
        >
          View on GitHub
        </a>
      </div>
    </header>
  );
};

export default Header;
