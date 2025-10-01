
export interface FeedItemType {
  id: number;
  timestamp: Date;
  imageUrl: string;
  description: string;
}

export enum MessageAuthor {
  USER = 'user',
  BOT = 'bot',
}

export interface ChatMessageType {
  id: number;
  text: string;
  author: MessageAuthor;
}
