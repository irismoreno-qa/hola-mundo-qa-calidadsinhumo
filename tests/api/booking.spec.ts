import { z } from 'zod';
import { test, expect, bookingPayload } from '../fixtures/api.fixture';

const BASE_URL = 'https://restful-booker.herokuapp.com';

const BookingDatesSchema = z.object({
  checkin: z.string(),
  checkout: z.string(),
});

const BookingSchema = z.object({
  firstname: z.string(),
  lastname: z.string(),
  totalprice: z.number(),
  depositpaid: z.boolean(),
  bookingdates: BookingDatesSchema,
  additionalneeds: z.string().optional(),
});

const CreateBookingResponseSchema = z.object({
  bookingid: z.number().positive(),
  booking: BookingSchema,
});

const AuthResponseSchema = z.object({
  token: z.string().min(1),
});

test.describe('Restful Booker API - Booking flow', () => {
  test('POST /auth with valid credentials - returns 200 and a valid token', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/auth`, {
      data: { username: 'admin', password: 'password123' },
    });

    expect(response.ok()).toBeTruthy();

    const body = await response.json();
    const parsed = AuthResponseSchema.parse(body);
    expect(parsed.token).not.toBe('Bad credentials');
  });

  test('POST /auth with invalid credentials - returns 200 with Bad credentials reason', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/auth`, {
      data: { username: 'wrong', password: 'wrong' },
    });

    expect(response.ok()).toBeTruthy();

    const body = await response.json();
    expect(body.reason).toBe('Bad credentials');
  });

  test('POST /booking - returns 200 and response reflects all submitted data', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/booking`, {
      data: bookingPayload,
    });

    expect(response.ok()).toBeTruthy();

    const body = await response.json();
    const parsed = CreateBookingResponseSchema.parse(body);

    expect(parsed.booking).toMatchObject({
      firstname: bookingPayload.firstname,
      lastname: bookingPayload.lastname,
      totalprice: bookingPayload.totalprice,
      depositpaid: bookingPayload.depositpaid,
      additionalneeds: bookingPayload.additionalneeds,
      bookingdates: {
        checkin: bookingPayload.bookingdates.checkin,
        checkout: bookingPayload.bookingdates.checkout,
      },
    });
  });

  test('PUT /booking/:id without token - returns 403 Forbidden', async ({ request, preparedBookingId }) => {
    const response = await request.put(`${BASE_URL}/booking/${preparedBookingId}`, {
      headers: { 'Content-Type': 'application/json' },
      data: { ...bookingPayload, firstname: 'Unauthorized' },
    });

    expect(response.status()).toBe(403);
  });

  test('PUT /booking/:id with valid token - returns 200 and updated data', async ({ request, authToken, preparedBookingId }) => {
    const updatedPayload = { ...bookingPayload, firstname: 'Updated' };

    const response = await request.put(`${BASE_URL}/booking/${preparedBookingId}`, {
      headers: {
        'Content-Type': 'application/json',
        Cookie: `token=${authToken}`,
      },
      data: updatedPayload,
    });

    expect(response.ok()).toBeTruthy();

    const body = await response.json();
    const parsed = BookingSchema.parse(body);
    expect(parsed.firstname).toBe('Updated');
  });

  test('GET /booking/:id with non-existent id - returns 404 Not Found', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/booking/999999999`);

    expect(response.status()).toBe(404);
  });

  test.describe('Idempotency', () => {
    test('PUT /booking/:id called twice with same payload - both return 200 and identical data', async ({ request, authToken, preparedBookingId }) => {
      const headers = {
        'Content-Type': 'application/json',
        Cookie: `token=${authToken}`,
      };

      const first = await request.put(`${BASE_URL}/booking/${preparedBookingId}`, {
        headers,
        data: bookingPayload,
      });
      const second = await request.put(`${BASE_URL}/booking/${preparedBookingId}`, {
        headers,
        data: bookingPayload,
      });

      expect(first.ok()).toBeTruthy();
      expect(second.ok()).toBeTruthy();

      const firstBody = await first.json();
      const secondBody = await second.json();
      expect(secondBody).toEqual(firstBody);
    });
  });

  test.describe('Edge cases', () => {
    test('POST /booking with empty body - returns 500 due to missing required fields', async ({ request }) => {
      const response = await request.post(`${BASE_URL}/booking`, {
        data: {},
      });

      // restful-booker returns 500 instead of 400 — documents missing backend validation
      expect(response.status()).toBe(500);
    });

    test('POST /booking with missing lastname - returns 500 due to missing required field', async ({ request }) => {
      const response = await request.post(`${BASE_URL}/booking`, {
        data: {
          firstname: 'Ana',
          totalprice: 150,
          depositpaid: true,
          bookingdates: { checkin: '2026-07-01', checkout: '2026-07-07' },
        },
      });

      // restful-booker returns 500 instead of 400 — documents missing backend validation
      expect(response.status()).toBe(500);
    });

    test('POST /booking with totalprice as string - returns 200 and coerces the value', async ({ request }) => {
      const response = await request.post(`${BASE_URL}/booking`, {
        data: { ...bookingPayload, totalprice: 'not-a-number' },
      });

      // restful-booker accepts invalid types without rejection — documents lack of type validation
      expect(response.ok()).toBeTruthy();
    });

    test('POST /auth with empty credentials - returns 200 with Bad credentials reason', async ({ request }) => {
      const response = await request.post(`${BASE_URL}/auth`, {
        data: {},
      });

      expect(response.ok()).toBeTruthy();
      const body = await response.json();
      expect(body.reason).toBe('Bad credentials');
    });
  });
});
