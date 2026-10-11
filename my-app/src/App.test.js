import { fireEvent, render, screen, within } from '@testing-library/react';
import App from './App';
import axios from 'axios';

jest.mock('axios');

test('saves and removes a favorite artifact', () => {
  axios.get.mockReturnValue(new Promise(() => {}));
  localStorage.clear();
  render(<App />);

  fireEvent.click(screen.getAllByRole('button', { name: 'Yêu thích hiện vật' })[0]);

  expect(localStorage.getItem('favorite-artifacts')).toContain('https://i.pinimg.com/736x/4b/91/59/4b9159fd1b7d8851b72e8af5653b37fc.jpg');
  fireEvent.click(screen.getByRole('button', { name: 'Mở danh sách yêu thích (1)' }));
  expect(screen.getByText('Danh sách yêu thích (1)')).toBeInTheDocument();

  fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Bỏ yêu thích hiện vật' }));

  expect(screen.getByText('Bạn chưa lưu hiện vật nào.')).toBeInTheDocument();
  expect(JSON.parse(localStorage.getItem('favorite-artifacts'))).toEqual([]);
});

test('opens a saved profile from the separate favorites section', async () => {
  const user = {
      id: 7,
      name: 'Casey Dietrich',
      username: 'casey',
      email: 'casey@example.test',
      phone: '555-0100',
      website: 'casey.example.test',
      company: { name: 'Example Co.' },
      address: { street: 'Main St', city: 'Example City' },
  };
  axios.get.mockImplementation((url) => Promise.resolve({
    data: url.endsWith('/profiles') ? [] : [user],
  }));
  localStorage.clear();
  render(<App />);

  fireEvent.click(await screen.findByRole('button', { name: 'Yêu thích profile Casey Dietrich' }));

  expect(JSON.parse(localStorage.getItem('favorite-profiles'))).toEqual([7]);
  fireEvent.click(screen.getByRole('button', { name: 'Mở danh sách yêu thích (1)' }));
  expect(screen.getByText('Hồ sơ người dùng (1)')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: /Casey Dietrich Example Co\./ }));

  expect(await screen.findByText(/User Profile/)).toBeInTheDocument();
  expect(screen.getByText('casey@example.test')).toBeInTheDocument();
});
