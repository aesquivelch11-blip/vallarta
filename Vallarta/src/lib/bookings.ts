// src/lib/bookings.ts
import { supabase } from './supabase';
import {
  Booking,
  DbBooking,
  mapDbBooking,
  mapToDbBooking,
} from '../components/calendar/bookingUtils';

export async function fetchBookings(propertyId: string): Promise<Booking[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('property_id', propertyId)
    .order('check_in', { ascending: true });
  if (error) throw error;
  return (data as DbBooking[]).map(mapDbBooking);
}

export async function createBooking(booking: Omit<Booking, 'id'>): Promise<Booking> {
  const { data, error } = await supabase
    .from('bookings')
    .insert(mapToDbBooking(booking))
    .select()
    .single();
  if (error) throw error;
  return mapDbBooking(data as DbBooking);
}

export async function updateBooking(booking: Booking): Promise<Booking> {
  const { id, ...rest } = booking;
  const { data, error } = await supabase
    .from('bookings')
    .update(mapToDbBooking(rest))
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return mapDbBooking(data as DbBooking);
}

export async function cancelBooking(id: string): Promise<void> {
  const { error } = await supabase
    .from('bookings')
    .update({ status: 'Cancelled' })
    .eq('id', id);
  if (error) throw error;
}
