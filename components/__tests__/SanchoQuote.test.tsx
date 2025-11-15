import React from 'react';
import { render, screen } from '@testing-library/react';
import { SanchoQuote } from '../SanchoQuote';

// Mock the data import
jest.mock('../../data/sanchoQuotes', () => ({
  getRandomSanchoQuote: () => ({
    quote: "Test quote for testing purposes",
    context: "Test context"
  })
}));

describe('SanchoQuote', () => {
  it('renders a quote with proper structure', () => {
    render(<SanchoQuote />);

    // Check that the quote text is rendered
    expect(screen.getByText('Test quote for testing purposes')).toBeInTheDocument();

    // Check that the context is rendered
    expect(screen.getByText('— Sancho Panza, Don Quixote (Test context)')).toBeInTheDocument();

    // Check that quote marks are present
    const quoteMarks = screen.getAllByText('"');
    expect(quoteMarks).toHaveLength(2);
  });

  it('has proper accessibility attributes', () => {
    render(<SanchoQuote />);

    // Check for semantic structure
    const container = screen.getByText('Test quote for testing purposes').closest('div');
    expect(container).toHaveClass('max-w-2xl', 'mx-auto', 'my-8');
  });
});
