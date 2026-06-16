// src/hooks/useBookings.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Booking } from '../components/calendar/bookingUtils';
import {
  fetchBookings,
  createBooking,
  updateBooking,
  cancelBooking,
} from '../lib/bookings';

export function useBookings(propertyId: string) {
  return useQuery({
    queryKey: ['bookings', propertyId],
    queryFn: () => fetchBookings(propertyId),
    enabled: !!propertyId,
  });
}

export function useCreateBooking(propertyId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (booking: Omit<Booking, 'id'>) => createBooking(booking),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['bookings', propertyId] }),
  });
}

export function useUpdateBooking(propertyId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (booking: Booking) => updateBooking(booking),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['bookings', propertyId] }),
  });
}

export function useCancelBooking(propertyId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => cancelBooking(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['bookings', propertyId] }),
  });
}
