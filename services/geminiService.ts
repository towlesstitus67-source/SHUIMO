
import { GoogleGenAI, Type } from "@google/genai";
import { ZenMode } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateZenContent = async (prompt: string, mode: ZenMode = ZenMode.POETRY): Promise<string> => {
  const model = 'gemini-3-flash-preview';
  
  const systemInstructions = `
    You are a Zen Master, a master of Shuimo (ink-wash) aesthetics and Eastern philosophy.
    Your task is to provide short, profound Zen insights, poems, or koans.
    Keep the responses concise (under 30 words) so they can be rendered as flowing ink characters.
    Response should be primarily in beautiful Literary Chinese (Classical Chinese) with a brief modern translation or reflection if needed, or pure elegant modern Chinese.
    Focus on themes of nature, emptiness, presence, and the "one flower, one world" philosophy.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt || "Generate a new Zen poem about the current moment.",
      config: {
        systemInstruction: systemInstructions,
        temperature: 0.8,
        topP: 0.9,
      },
    });

    return response.text || "一花一世界，一叶一菩提。";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "心若无尘，花开自香。";
  }
};
