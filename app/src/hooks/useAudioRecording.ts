import { useState, useRef, useCallback, useEffect } from 'react';
import { Audio } from 'expo-av';
import { useRecordingStore } from '@/stores/useRecordingStore';

interface UseAudioRecordingReturn {
  isRecording: boolean;
  isPaused: boolean;
  duration: number;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<string | null>;
  pauseRecording: () => Promise<void>;
  resumeRecording: () => Promise<void>;
  cancelRecording: () => Promise<void>;
}

export function useAudioRecording(): UseAudioRecordingReturn {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(0);

  const recordingRef = useRef<Audio.Recording | null>(null);
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const { setRecording, setRecordingStatus } = useRecordingStore();

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
      if (recordingRef.current) {
        recordingRef.current.stopAndUnloadAsync();
      }
    };
  }, []);

  const startDurationTimer = useCallback(() => {
    durationIntervalRef.current = setInterval(() => {
      setDuration((prev) => prev + 1);
    }, 1000);
  }, []);

  const stopDurationTimer = useCallback(() => {
    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current);
      durationIntervalRef.current = null;
    }
  }, []);

  const startRecording = useCallback(async () => {
    try {
      // Request permissions
      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) {
        throw new Error('Microphone permission not granted');
      }

      // Configure audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      // Create and start recording
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      recordingRef.current = recording;
      setIsRecording(true);
      setIsPaused(false);
      setDuration(0);
      setRecordingStatus(true, false);
      startDurationTimer();
    } catch (error) {
      console.error('Failed to start recording:', error);
      throw error;
    }
  }, [setRecordingStatus, startDurationTimer]);

  const stopRecording = useCallback(async (): Promise<string | null> => {
    try {
      if (!recordingRef.current) {
        return null;
      }

      stopDurationTimer();

      await recordingRef.current.stopAndUnloadAsync();
      const uri = recordingRef.current.getURI();

      // Reset audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });

      // Save to store
      if (uri) {
        setRecording(uri, duration, 'm4a');
      }

      recordingRef.current = null;
      setIsRecording(false);
      setIsPaused(false);
      setRecordingStatus(false, false);

      return uri;
    } catch (error) {
      console.error('Failed to stop recording:', error);
      throw error;
    }
  }, [duration, setRecording, setRecordingStatus, stopDurationTimer]);

  const pauseRecording = useCallback(async () => {
    try {
      if (!recordingRef.current || !isRecording || isPaused) {
        return;
      }

      await recordingRef.current.pauseAsync();
      stopDurationTimer();
      setIsPaused(true);
      setRecordingStatus(true, true);
    } catch (error) {
      console.error('Failed to pause recording:', error);
      throw error;
    }
  }, [isRecording, isPaused, setRecordingStatus, stopDurationTimer]);

  const resumeRecording = useCallback(async () => {
    try {
      if (!recordingRef.current || !isRecording || !isPaused) {
        return;
      }

      await recordingRef.current.startAsync();
      startDurationTimer();
      setIsPaused(false);
      setRecordingStatus(true, false);
    } catch (error) {
      console.error('Failed to resume recording:', error);
      throw error;
    }
  }, [isRecording, isPaused, setRecordingStatus, startDurationTimer]);

  const cancelRecording = useCallback(async () => {
    try {
      stopDurationTimer();

      if (recordingRef.current) {
        await recordingRef.current.stopAndUnloadAsync();
        recordingRef.current = null;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });

      setIsRecording(false);
      setIsPaused(false);
      setDuration(0);
      setRecordingStatus(false, false);
    } catch (error) {
      console.error('Failed to cancel recording:', error);
      throw error;
    }
  }, [setRecordingStatus, stopDurationTimer]);

  return {
    isRecording,
    isPaused,
    duration,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    cancelRecording,
  };
}
