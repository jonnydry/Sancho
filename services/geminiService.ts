import OpenAI from "openai";
import { GeminiExampleResponse } from '../types';

const API_KEY = process.env.XAI_API_KEY;

if (!API_KEY) {
  console.warn("XAI_API_KEY environment variable not set. AI features will not work.");
}

const openai = new OpenAI({ baseURL: "https://api.x.ai/v1", apiKey: API_KEY });

export const findPoetryExample = async (topic: string): Promise<GeminiExampleResponse> => {
  if (!API_KEY) {
    throw new Error("API Key is not configured.");
  }

  try {
    const prompt = `Please provide a famous, concise example of a ${topic} in poetry. Include the author, the title, and a brief explanation of how it fits the conventions. Respond with JSON in this format: { "example": "string", "author": "string", "title": "string", "explanation": "string" }`;

    const response = await openai.chat.completions.create({
      model: "grok-2-1212",
      messages: [
        {
          role: "system",
          content: "You are a poetry expert. Provide famous poetic examples with detailed explanations."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.5,
    });

    const jsonText = response.choices[0].message.content || "{}";
    const parsedJson = JSON.parse(jsonText);
    return parsedJson as GeminiExampleResponse;

  } catch (error) {
    console.error("Error fetching poetry example from XAI:", error);
    throw new Error("Failed to generate example. The model may be unavailable or the request could not be fulfilled.");
  }
};
