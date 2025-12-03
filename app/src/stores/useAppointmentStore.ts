import { create } from 'zustand';
import type { Specialty } from '@/types';

interface AppointmentState {
  // Form data
  appointmentDate: Date;
  providerName: string;
  specialty: Specialty;
  email: string;

  // Actions
  setAppointmentDate: (date: Date) => void;
  setProviderName: (name: string) => void;
  setSpecialty: (specialty: Specialty) => void;
  setEmail: (email: string) => void;
  reset: () => void;
}

const initialState = {
  appointmentDate: new Date(),
  providerName: '',
  specialty: '' as Specialty,
  email: '',
};

export const useAppointmentStore = create<AppointmentState>((set) => ({
  ...initialState,

  setAppointmentDate: (date) => set({ appointmentDate: date }),
  setProviderName: (name) => set({ providerName: name }),
  setSpecialty: (specialty) => set({ specialty }),
  setEmail: (email) => set({ email }),
  reset: () => set(initialState),
}));
