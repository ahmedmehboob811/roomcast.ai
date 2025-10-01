
import React from 'react';
import { FeedItemType } from '../types';
import FeedItem from './FeedItem';
import { ImageIcon } from './Icons';
import Spinner from './Spinner';


interface FeedProps {
  items: FeedItemType[];
  isLoading: boolean;
}

const Feed: React.FC<FeedProps> = ({ items, isLoading }) => {
  return (
    <div className="bg-brand-secondary/50 rounded-xl p-4 md:p-6 flex-grow flex flex-col h-[75vh] md:h-auto">
      <h2 className="text-xl font-semibold mb-4 text-white">Room Timeline</h2>
      <div className="flex-grow overflow-y-auto pr-2 space-y-6">
        {isLoading && items.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <Spinner />
            <p className="mt-2">Waiting for first image...</p>
          </div>
        )}
        {!isLoading && items.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <ImageIcon className="w-16 h-16 mb-4" />
            <h3 className="text-lg font-medium">Your feed is empty</h3>
            <p>Upload an image to start your timeline.</p>
          </div>
        )}
        {items.map((item) => (
          <FeedItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default Feed;
