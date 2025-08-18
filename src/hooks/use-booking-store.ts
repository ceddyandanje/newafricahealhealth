
'use client';

import { create } from 'zustand';
import { type ServiceCategory } from '@/lib/serviceCategories';

interface BookingState {
  isDialogOpen: boolean;
  specialty: ServiceCategory | null;
  setSpecialty: (specialty: ServiceCategory | null) => void;
  openDialog: () => void;
  closeDialog: () => void;
}

export const useBookingStore = create<BookingState>((set) => ({
  isDialogOpen: false,
  specialty: null,
  setSpecialty: (specialty) => set({ specialty }),
  openDialog: () => set({ isDialogOpen: true }),
  closeDialog: () => set({ isDialogOpen: false, specialty: null }), // Clear specialty on close
}));
