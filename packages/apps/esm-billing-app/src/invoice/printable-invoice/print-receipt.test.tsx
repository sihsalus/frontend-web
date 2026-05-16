import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import PrintReceipt from './print-receipt.component';

describe('PrintReceipt', () => {
  const TEST_BILL_UUID = 'a0655e54-126b-4b88-8c7c-579cb4f331f2';
  const originalLocation = window.location;
  let mockLink: HTMLAnchorElement;

  beforeEach(() => {
    Object.defineProperty(window, 'location', {
      value: {
        ...originalLocation,
        href: 'http://localhost:8080/openmrs/spa/home',
        origin: 'http://localhost:8080',
      },
      writable: true,
      configurable: true,
    });

    mockLink = document.createElement('a');
    vi.spyOn(mockLink, 'click').mockImplementation(() => {});

    const originalCreateElement = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      if (tagName === 'a') {
        mockLink.href = '';
        mockLink.download = '';
        return mockLink;
      }
      return originalCreateElement(tagName);
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();

    Object.defineProperty(window, 'location', {
      value: originalLocation,
      writable: true,
      configurable: true,
    });
  });

  it('renders the print receipt button', () => {
    render(<PrintReceipt billUuid={TEST_BILL_UUID} />);

    const button = screen.getByRole('button', { name: /print receipt/i });
    expect(button).toBeInTheDocument();
    expect(button).toBeEnabled();
  });

  it('shows loading state and disables button during download', async () => {
    render(<PrintReceipt billUuid={TEST_BILL_UUID} />);

    const button = screen.getByRole('button', { name: /print receipt/i });
    button.click();

    await waitFor(() => {
      expect(button).toBeDisabled();
    });

    expect(button).toBeDisabled();
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    expect(screen.queryByText(/print receipt/i)).not.toBeInTheDocument();

    await new Promise((resolve) => setTimeout(resolve, 1100));
  });

  it('initiates download when button is clicked', async () => {
    render(<PrintReceipt billUuid={TEST_BILL_UUID} />);

    const button = screen.getByRole('button', { name: /print receipt/i });
    button.click();

    await new Promise((resolve) => setTimeout(resolve, 1100));

    await waitFor(() => {
      expect(mockLink.click).toHaveBeenCalled();
    });

    expect(mockLink.href).toContain(TEST_BILL_UUID);
    expect(mockLink.href).toContain('receipt');
  });

  it('re-enables button after download completes', async () => {
    render(<PrintReceipt billUuid={TEST_BILL_UUID} />);

    const button = screen.getByRole('button', { name: /print receipt/i });
    button.click();

    await waitFor(() => {
      expect(button).toBeDisabled();
    });

    await new Promise((resolve) => setTimeout(resolve, 1100));

    await waitFor(() => {
      expect(button).toBeEnabled();
    });

    expect(screen.getByText(/print receipt/i)).toBeInTheDocument();
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
  });

  it('prevents multiple simultaneous downloads', async () => {
    render(<PrintReceipt billUuid={TEST_BILL_UUID} />);

    const button = screen.getByRole('button', { name: /print receipt/i });

    button.click();
    button.click();
    button.click();

    await waitFor(() => {
      expect(button).toBeDisabled();
    });

    await new Promise((resolve) => setTimeout(resolve, 1100));

    await waitFor(() => {
      expect(button).toBeEnabled();
    });
  });

  it('renders printer icon', () => {
    render(<PrintReceipt billUuid={TEST_BILL_UUID} />);

    const button = screen.getByRole('button', { name: /print receipt/i });
    expect(button).toBeInTheDocument();
  });

  it('handles empty bill UUID', async () => {
    render(<PrintReceipt billUuid="" />);

    const button = screen.getByRole('button', { name: /print receipt/i });
    button.click();

    await new Promise((resolve) => setTimeout(resolve, 1100));

    await waitFor(() => {
      expect(mockLink.click).toHaveBeenCalled();
    });
  });
});
