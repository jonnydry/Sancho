import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { SanchoQuote } from '../SanchoQuote';

// Mock the data import
jest.mock('../../data/sanchoQuotes', () => ({
  getRandomSanchoQuote: () => ({
    quote: "Fallback quote for testing purposes",
    context: "Fallback context"
  })
}));

const mockFetchSanchoQuote = jest.fn();
jest.mock('../../services/apiService', () => ({
  fetchSanchoQuote: mockFetchSanchoQuote
}));

describe('SanchoQuote', () => {
  beforeEach(() => {
    mockFetchSanchoQuote.mockClear();
  });

  it('renders a quote with proper structure', async () => {
    mockFetchSanchoQuote.mockResolvedValue({
      quote: 'Remote quote for testing purposes',
      context: 'Remote context'
    });

    render(<SanchoQuote />);

    // Check that the quote text is rendered from the API
    await waitFor(() => {
      expect(screen.getByText('Remote quote for testing purposes')).toBeInTheDocument();
    });

    // Check that the context is rendered with proper format
    expect(screen.getByText('— Sancho Panza | Remote context')).toBeInTheDocument();

    // Check that quote marks are present (opening and closing quotes)
    expect(screen.getByText('"')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', async () => {
    mockFetchSanchoQuote.mockResolvedValue({
      quote: 'Test quote',
      context: 'Test context'
    });

    render(<SanchoQuote />);

    await waitFor(() => {
      expect(screen.getByText('Test quote')).toBeInTheDocument();
    });

    // Check for semantic structure - main container
    const container = screen.getByText('Test quote').closest('div');
    expect(container).toHaveClass('relative', 'w-full', 'py-6');
  });

  it('shows loading state initially', () => {
    mockFetchSanchoQuote.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(<SanchoQuote />);

    expect(screen.getByText('AWAITING WISDOM...')).toBeInTheDocument();
  });

  it('handles API errors gracefully with fallback', async () => {
    mockFetchSanchoQuote.mockRejectedValue(new Error('API Error'));

    render(<SanchoQuote />);

    // Should show fallback quote after error
    await waitFor(() => {
      expect(screen.getByText('Fallback quote for testing purposes')).toBeInTheDocument();
    });

    expect(screen.getByText('— Sancho Panza | Fallback context')).toBeInTheDocument();
  });

  it('allows refreshing quotes', async () => {
    mockFetchSanchoQuote.mockResolvedValueOnce({
      quote: 'First quote',
      context: 'First context'
    }).mockResolvedValueOnce({
      quote: 'Second quote',
      context: 'Second context'
    });

    render(<SanchoQuote />);

    // Wait for first quote
    await waitFor(() => {
      expect(screen.getByText('First quote')).toBeInTheDocument();
    });

    // Hover to show refresh button and click it
    const container = screen.getByText('First quote').closest('div');
    fireEvent.mouseEnter(container!);

    const refreshButton = screen.getByRole('button', { name: 'New Wisdom' });
    fireEvent.click(refreshButton);

    // Should load second quote
    await waitFor(() => {
      expect(screen.getByText('Second quote')).toBeInTheDocument();
    });

    expect(screen.getByText('— Sancho Panza | Second context')).toBeInTheDocument();
  });

  it('renders quotes without context', async () => {
    mockFetchSanchoQuote.mockResolvedValue({
      quote: 'Quote without context'
    });

    render(<SanchoQuote />);

    await waitFor(() => {
      expect(screen.getByText('Quote without context')).toBeInTheDocument();
    });

    // Should not show context line
    expect(screen.queryByText('— Sancho Panza')).not.toBeInTheDocument();
  });

  it('handles empty quote response', async () => {
    mockFetchSanchoQuote.mockResolvedValue({
      quote: '',
      context: 'Some context'
    });

    render(<SanchoQuote />);

    // Should fallback to error state
    await waitFor(() => {
      expect(screen.getByText('Fallback quote for testing purposes')).toBeInTheDocument();
    });
  });
});
