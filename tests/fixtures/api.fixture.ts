import { test as base } from '@playwright/test';

const BASE_URL = 'https://restful-booker.herokuapp.com';

export const bookingPayload = {
  firstname: 'Ana',
  lastname: 'Garcia',
  totalprice: 150,
  depositpaid: true,
  bookingdates: {
    checkin: '2026-07-01',
    checkout: '2026-07-07',
  },
  additionalneeds: 'Breakfast',
};

type ApiFixtures = {
  authToken: string;
  preparedBookingId: number;
};

export const test = base.extend<ApiFixtures>({
  authToken: async ({ request }, use) => {
    const response = await request.post(`${BASE_URL}/auth`, {
      data: { username: 'admin', password: 'password123' },
    });
    const { token } = await response.json();
    await use(token);
  },

  preparedBookingId: async ({ request }, use) => {
    const response = await request.post(`${BASE_URL}/booking`, {
      data: bookingPayload,
    });
    const { bookingid } = await response.json();
    await use(bookingid);
  },
});

export { expect } from '@playwright/test';
