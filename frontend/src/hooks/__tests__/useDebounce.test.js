import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '../useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns the initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('rick', 300));
    expect(result.current).toBe('rick');
  });

  it('does not update the value before the delay has passed', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
      initialProps: { value: 'rick' },
    });

    rerender({ value: 'morty' });
    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(result.current).toBe('rick');
  });

  it('updates the value once the delay has passed', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
      initialProps: { value: 'rick' },
    });

    rerender({ value: 'morty' });
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current).toBe('morty');
  });

  it('resets the timer on rapid consecutive changes (only the last value wins)', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
      initialProps: { value: 'r' },
    });

    rerender({ value: 'ri' });
    act(() => {
      vi.advanceTimersByTime(150);
    });
    rerender({ value: 'ric' });
    act(() => {
      vi.advanceTimersByTime(150);
    });
    rerender({ value: 'rick' });
    act(() => {
      vi.advanceTimersByTime(150);
    });

    // Todavía no pasaron 300ms desde el último cambio ("rick")
    expect(result.current).toBe('r');

    act(() => {
      vi.advanceTimersByTime(150);
    });

    expect(result.current).toBe('rick');
  });
});
