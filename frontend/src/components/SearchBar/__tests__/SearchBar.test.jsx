import { render, screen, fireEvent } from '@testing-library/react';
import { SearchBar } from '../SearchBar';

describe('SearchBar', () => {
  it('renders the current value', () => {
    render(<SearchBar value="rick" onChange={() => {}} isSearching={false} />);
    expect(screen.getByRole('textbox')).toHaveValue('rick');
  });

  it('calls onChange with the new text as the user types', () => {
    const handleChange = vi.fn();
    render(<SearchBar value="" onChange={handleChange} isSearching={false} />);

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'morty' } });

    expect(handleChange).toHaveBeenCalledWith('morty');
  });
});
