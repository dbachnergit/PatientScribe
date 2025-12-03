import { create } from 'zustand';

interface RecordingState {
  // Recording data
  uri: string | null;
  duration: number;
  format: string;

  // Recording status
  isRecording: boolean;
  isPaused: boolean;

  // Actions
  setRecording: (uri: string, duration: number, format: string) => void;
  setRecordingStatus: (isRecording: boolean, isPaused?: boolean) => void;
  clearRecording: () => void;
}

export const useRecordingStore = create<RecordingState>((set) => ({
  // Initial state
  uri: null,
  duration: 0,
  format: 'm4a',
  isRecording: false,
  isPaused: false,

  // Actions
  setRecording: (uri, duration, format) =>
    set({ uri, duration, format, isRecording: false, isPaused: false }),

  setRecordingStatus: (isRecording, isPaused = false) =>
    set({ isRecording, isPaused }),

  clearRecording: () =>
    set({ uri: null, duration: 0, format: 'm4a', isRecording: false, isPaused: false }),
}));
