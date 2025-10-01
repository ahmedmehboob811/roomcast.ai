
import React, { useState, useCallback } from 'react';
import { FeedItemType, ChatMessageType, MessageAuthor } from './types';
import { generateDescriptionForImage, getChatbotResponse } from './services/geminiService';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import Feed from './components/Feed';
import Chatbot from './components/Chatbot';

const App: React.FC = () => {
  const [feedItems, setFeedItems] = useState<FeedItemType[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessageType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = useCallback(async (file: File) => {
    setIsLoading(true);
    setError(null);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64Image = (reader.result as string).split(',')[1];
        const mimeType = file.type;
        
        const newImageItem: Omit<FeedItemType, 'description'> = {
          id: Date.now(),
          timestamp: new Date(),
          imageUrl: URL.createObjectURL(file),
        };

        const description = await generateDescriptionForImage(base64Image, mimeType);
        
        const newFeedItem: FeedItemType = {
          ...newImageItem,
          description: description,
        };
        
        setFeedItems(prev => [newFeedItem, ...prev]);
      };
      reader.onerror = (error) => {
        console.error("FileReader error:", error);
        setError('Failed to read the image file.');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to get AI description. Please check the console for more details.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSendMessage = useCallback(async (messageText: string) => {
    if (!messageText.trim()) return;

    const userMessage: ChatMessageType = {
      id: Date.now(),
      text: messageText,
      author: MessageAuthor.USER,
    };
    setChatMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const botResponseText = await getChatbotResponse(messageText, feedItems, chatMessages);
      const botMessage: ChatMessageType = {
        id: Date.now() + 1,
        text: botResponseText,
        author: MessageAuthor.BOT,
      };
      setChatMessages(prev => [...prev, botMessage]);
    } catch (err) {
      console.error(err);
      const errorMessage: ChatMessageType = {
        id: Date.now() + 1,
        text: "Sorry, I couldn't process that. Please try again.",
        author: MessageAuthor.BOT,
      };
      setChatMessages(prev => [...prev, errorMessage]);
      setError('Failed to get chatbot response.');
    } finally {
      setIsLoading(false);
    }
  }, [feedItems, chatMessages]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <ImageUploader onImageUpload={handleImageUpload} isLoading={isLoading} />
          <Feed items={feedItems} isLoading={isLoading && feedItems.length === 0} />
        </div>
        <div className="lg:col-span-1 flex flex-col">
          <Chatbot 
            messages={chatMessages} 
            onSendMessage={handleSendMessage} 
            isLoading={isLoading} 
          />
        </div>
      </main>
       {error && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white py-2 px-4 rounded-lg shadow-lg">
          {error}
        </div>
      )}
    </div>
  );
};

export default App;
