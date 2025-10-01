
import { GoogleGenAI } from "@google/genai";
import type { FeedItemType, ChatMessageType } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

/**
 * Generates a detailed description for a given room image.
 * @param base64Image - The base64 encoded image string.
 * @param mimeType - The MIME type of the image.
 * @returns A promise that resolves to the AI-generated description string.
 */
export const generateDescriptionForImage = async (base64Image: string, mimeType: string): Promise<string> => {
  try {
    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: mimeType,
      },
    };

    const textPart = {
      text: "You are an expert interior designer. Describe this room in vivid detail. Focus on the style, key furniture pieces, color palette, lighting, and overall mood. Be descriptive and engaging. Start with a captivating summary sentence.",
    };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [imagePart, textPart] },
    });
    
    return response.text;
  } catch (error) {
    console.error("Error generating image description:", error);
    throw new Error("Failed to communicate with the Gemini API for image description.");
  }
};

/**
 * Gets a response from the chatbot based on the user's message and context.
 * @param message - The user's latest message.
 * @param feedContext - The current feed of room images and descriptions.
 * @param chatHistory - The existing chat history.
 * @returns A promise that resolves to the chatbot's response string.
 */
export const getChatbotResponse = async (
  message: string,
  feedContext: FeedItemType[],
  chatHistory: ChatMessageType[]
): Promise<string> => {
  try {
    const formattedFeedContext = feedContext.map(item => 
      `Timestamp: ${item.timestamp.toISOString()}\nDescription: ${item.description}`
    ).join('\n---\n');

    const formattedChatHistory = chatHistory.map(msg => `${msg.author}: ${msg.text}`).join('\n');

    const systemInstruction = `You are RoomCast AI, a helpful assistant specializing in analyzing changes in rooms over time. 
You have access to a timeline of room images with descriptions. 
Your primary goal is to answer user questions about these rooms based on the provided context.
When asked 'what changed since X', compare the most recent entry with the one closest to time X and summarize the differences.
Be concise and helpful.`;

    const fullPrompt = `
CONTEXT: ROOM FEED TIMELINE
Here are the latest room snapshots, from newest to oldest:
${formattedFeedContext || 'No room images have been uploaded yet.'}

CONTEXT: CHAT HISTORY
${formattedChatHistory}

USER'S NEW MESSAGE:
user: ${message}

bot:
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      }
    });

    return response.text;
  } catch (error) {
    console.error("Error getting chatbot response:", error);
    throw new Error("Failed to communicate with the Gemini API for chat response.");
  }
};
