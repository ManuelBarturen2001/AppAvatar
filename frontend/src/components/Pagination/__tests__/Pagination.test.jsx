import { render, screen, fireEvent } from '@testing-library/react';
import { Pagination } from '../Pagination';

describe('Pagination', () => {
  it('renders nothing when there is only one page', () => {
    const { container } = render(
      <Pagination currentPage={1} totalPages={1} hasNextPage={false} hasPrevPage={false} onPageChange={() => {}} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('disables "Anterior" on the first page and "Siguiente" on the last page', () => {
    render(
      <Pagination currentPage={1} totalPages={5} hasNextPage={true} hasPrevPage={false} onPageChange={() => {}} />
    );

    expect(screen.getByText(/Anterior/)).toBeDisabled();
    expect(screen.getByText(/Siguiente/)).not.toBeDisabled();
  });

  it('calls onPageChange with the next page number', () => {
    const handlePageChange = vi.fn();
    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        hasNextPage={true}
        hasPrevPage={true}
        onPageChange={handlePageChange}
      />
    );

    fireEvent.click(screen.getByText(/Siguiente/));
    expect(handlePageChange).toHaveBeenCalledWith(3);

    fireEvent.click(screen.getByText(/Anterior/));
    expect(handlePageChange).toHaveBeenCalledWith(1);
  });
});
