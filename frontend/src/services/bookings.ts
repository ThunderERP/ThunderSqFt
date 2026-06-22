import { bookingsDb, Booking, delay } from './db'

export async function getBookings(): Promise<Booking[]> {
  await delay(150);
  return [...bookingsDb];
}

export async function createBooking(input: Omit<Booking, 'id'>): Promise<Booking> {
  await delay(150);
  const newBooking: Booking = {
    ...input,
    id: bookingsDb.length > 0 ? Math.max(...bookingsDb.map(b => b.id)) + 1 : 1
  };
  bookingsDb.unshift(newBooking);
  return newBooking;
}
