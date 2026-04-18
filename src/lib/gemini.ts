import { GoogleGenAI, Type } from "@google/genai";
import { CardData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateCardsFromText(text: string): Promise<CardData[]> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Transform the following text into a series of 5-8 news cards.
    Each card should have a short catchy title and 1-2 sentences of body content.
    The response must be in JSON format.
    
    TEXT:
    ${text}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            title: { type: Type.STRING },
            content: { type: Type.STRING },
          },
          required: ["id", "title", "content"],
        },
      },
    },
  });

  try {
    const data = JSON.parse(response.text || "[]");
    return data;
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    return [];
  }
}
