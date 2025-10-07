import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; // Importing jest-dom for additional matchers
import Controls from '@/app/components/Controls';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

describe('Controls', () => {
  it('renders filter dropdowns', () => {
    (usePathname as jest.Mock).mockReturnValue('/');
    (useRouter as jest.Mock).mockReturnValue({ push: jest.fn() });
    (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams());
    render(<Controls />);
    expect(screen.getByRole('toolbar')).toBeInTheDocument();
  });
});
