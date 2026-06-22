import { useState, useEffect, useCallback } from 'react'
import { Booking } from '../services/db'
import { getBookings, createBooking } from '../services/bookings'

export function useBookings() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true)
      const data = await getBookings()
      setBookings(data)
      setError(null)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch bookings')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchBookings()
  }, [fetchBookings])

  const addBooking = async (input: Omit<Booking, 'id'>) => {
    const newBooking = await createBooking(input);
    setBookings(prev => [newBooking, ...prev]);
    return newBooking;
  }

  return { bookings, loading, error, refetch: fetchBookings, addBooking }
}
