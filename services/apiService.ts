import { PoetryExampleResponse, SanchoQuoteResponse } from '../types';

export const findPoetryExample = async (topic: string): Promise<PoetryExampleResponse> => {
  try {
    const response = await fetch('/api/poetry-example', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ topic }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Server error: ${response.status}`);
    }

    const data = await response.json();
    return data as PoetryExampleResponse;

  } catch (error) {
    console.error("Error fetching poetry example from backend:", error);
    throw new Error("Failed to generate example. Please try again.");
  }
};

export const fetchSanchoQuote = async (): Promise<SanchoQuoteResponse> => {
  try {
    const response = await fetch('/api/sancho-quote');

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Server error: ${response.status}`);
    }

    const data = await response.json();
    return data as SanchoQuoteResponse;

  } catch (error) {
    console.error("Error fetching Sancho quote from backend:", error);
    throw new Error("Failed to fetch quote. Please try again.");
  }
};
