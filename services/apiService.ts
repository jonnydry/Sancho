import { PoetryExampleResponse, SanchoQuoteResponse, LearnMoreResponse } from '../types';

export const findPoetryExample = async (topic: string, previousExample?: string): Promise<PoetryExampleResponse> => {
  try {
    const response = await fetch('/api/poetry-example', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ topic, previousExample }),
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

interface SanchoQuoteError {
  error: string;
  retryAfter?: number;
  fallbackAvailable?: boolean;
}

export const fetchSanchoQuote = async (): Promise<SanchoQuoteResponse> => {
  try {
    const response = await fetch('/api/sancho-quote');

    if (!response.ok) {
      const errorData: SanchoQuoteError = await response.json().catch(() => ({
        error: `Server error: ${response.status}`,
        fallbackAvailable: true
      }));

      // Add response status to the error for client handling
      const error = new Error(errorData.error);
      (error as any).status = response.status;
      (error as any).retryAfter = errorData.retryAfter;
      (error as any).fallbackAvailable = errorData.fallbackAvailable;
      throw error;
    }

    const data = await response.json();

    // Validate response structure
    if (!data || typeof data.quote !== 'string') {
      throw new Error('Invalid quote response structure');
    }

    return data as SanchoQuoteResponse;

  } catch (error) {
    console.error("Error fetching Sancho quote from backend:", error);
    throw error; // Re-throw with enhanced error info
  }
};

export const fetchLearnMoreContext = async (topic: string): Promise<LearnMoreResponse> => {
  try {
    const response = await fetch('/api/poetry-learn-more', {
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
    return data as LearnMoreResponse;

  } catch (error) {
    console.error("Error fetching learn more context from backend:", error);
    throw new Error("Failed to generate context. Please try again.");
  }
};
