import React from 'react';    
import { render, screen, waitFor } from '@testing-library/react';
import { SanchoQuote } from '../SanchoQuote';

// Mock the data import
jest.mock('../../data/sanchoQuotes', () => ({
  getRandomSanchoQuote: () => ({
    quote: "Test quote for testing purposes",
    context: "Test context"
  })
}));

jest.mock('../../services/apiService', () => ({
  fetchSanchoQuote: jest.fn().mockResolvedValue({
    quote: 'Remote quote for testing purposes',
    context: 'Remote context'
  })
}));

describe('SanchoQuote', () => {
  it('renders a quote with proper structure', async () => {
    render(<SanchoQuote />);

    // Check that the quote text is rendered from the API
    await waitFor(() => {
      expect(screen.getByText('Remote quote for testing purposes')).toBeInTheDocument();
    });

    // Check that the context is rendered
    expect(screen.getByText('— Sancho Panza, Don Quixote (Remote context)')).toBeInTheDocument();

    // Check that quote marks are present
    const quoteMarks = screen.getAllByText('"');
    expect(quoteMarks).toHaveLength(2);
  });

  it('has proper accessibility attributes', async () => {
    render(<SanchoQuote />);

    // Check for semantic structure
    const container = await waitFor(() =>
      screen.getByText('Remote quote for testing purposes').closest('div')
    );
    expect(container).toHaveClass('max-w-2xl', 'mx-auto', 'my-8');
  });
});
