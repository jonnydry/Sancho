
import { GoogleGenAI, Type } from "@google/genai";
import { GeminiExampleResponse } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    example: {
      type: Type.STRING,
      description: 'A famous, concise poetic excerpt demonstrating the form or meter. Include line breaks as \\n.',
    },
    author: {
      type: Type.STRING,
      description: 'The author of the poetic excerpt.',
    },
    title: {
      type: Type.STRING,
      description: 'The title of the work from which the excerpt is taken.',
    },
    explanation: {
      type: Type.STRING,
      description: 'A brief explanation of how the example fits the specified form or meter.',
    },
  },
  required: ['example', 'author', 'title', 'explanation'],
};


export const findPoetryExample = async (topic: string): Promise<GeminiExampleResponse> => {
  if (!API_KEY) {
    throw new Error("API Key is not configured.");
  }

  try {
    const prompt = `Please provide a famous, concise example of a ${topic} in poetry. Include the author, the title, and a brief explanation of how it fits the conventions.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
        temperature: 0.5,
      },
    });

    const jsonText = response.text.trim();
    const parsedJson = JSON.parse(jsonText);
    return parsedJson as GeminiExampleResponse;

  } catch (error) {
    console.error("Error fetching poetry example from Gemini:", error);
    throw new Error("Failed to generate example. The model may be unavailable or the request could not be fulfilled.");
  }
};
