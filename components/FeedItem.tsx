
import React from 'react';
import { FeedItemType } from '../types';

interface FeedItemProps {
  item: FeedItemType;
}

const FeedItem: React.FC<FeedItemProps> = ({ item }) => {
  return (
    <div className="bg-brand-primary rounded-lg overflow-hidden shadow-lg animate-fade-in">
      <img src={item.imageUrl} alt="Room" className="w-full h-64 object-cover" />
      <div className="p-4">
        <p className="text-xs text-gray-400 mb-2">
          {item.timestamp.toLocaleString()}
        </p>
        <p className="text-brand-light text-sm leading-relaxed">{item.description}</p>
      </div>
    </div>
  );
};

export default FeedItem;
