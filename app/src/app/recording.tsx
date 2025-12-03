import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Mic, Square, Pause, Play } from 'lucide-react-native';
import { useAudioRecording } from '@/hooks/useAudioRecording';
import { Button } from '@/components/ui';
import { formatDuration } from '@/lib/utils';

export default function RecordingScreen() {
  const router = useRouter();
  const {
    isRecording,
    isPaused,
    duration,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    cancelRecording,
  } = useAudioRecording();

  const handleStartRecording = async () => {
    try {
      await startRecording();
    } catch (error) {
      Alert.alert(
        'Permission Required',
        'Please enable microphone access in your device settings to record audio.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleStopRecording = async () => {
    try {
      const uri = await stopRecording();
      if (uri) {
        router.push('/details');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to stop recording. Please try again.');
    }
  };

  const handlePauseResume = async () => {
    try {
      if (isPaused) {
        await resumeRecording();
      } else {
        await pauseRecording();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pause/resume recording.');
    }
  };

  const handleBack = async () => {
    if (isRecording) {
      Alert.alert(
        'Cancel Recording?',
        'Your recording will be lost. Are you sure?',
        [
          { text: 'Keep Recording', style: 'cancel' },
          {
            text: 'Cancel',
            style: 'destructive',
            onPress: async () => {
              await cancelRecording();
              router.back();
            },
          },
        ]
      );
    } else {
      router.back();
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="flex-row items-center px-4 py-2">
        <TouchableOpacity onPress={handleBack} className="p-2">
          <ArrowLeft size={24} color="#2D3A6E" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-primary ml-2">
          Record Appointment
        </Text>
      </View>

      {/* Recording Area */}
      <View className="flex-1 justify-center items-center px-6">
        {/* Duration Display */}
        <Text className="text-6xl font-bold text-primary mb-8">
          {formatDuration(duration)}
        </Text>

        {/* Recording Status */}
        <Text className="text-lg text-muted mb-12">
          {!isRecording
            ? 'Tap to start recording'
            : isPaused
            ? 'Recording paused'
            : 'Recording...'}
        </Text>

        {/* Record Button */}
        {!isRecording ? (
          <TouchableOpacity
            onPress={handleStartRecording}
            className="w-32 h-32 bg-recording rounded-full items-center justify-center shadow-lg"
            activeOpacity={0.8}
          >
            <Mic size={48} color="#FFFFFF" />
          </TouchableOpacity>
        ) : (
          <View className="items-center">
            {/* Animated Recording Indicator */}
            <View
              className={`w-32 h-32 rounded-full items-center justify-center mb-8 ${
                isPaused ? 'bg-warning' : 'bg-recording'
              }`}
            >
              {isPaused ? (
                <Pause size={48} color="#FFFFFF" />
              ) : (
                <View className="w-8 h-8 bg-white rounded-sm" />
              )}
            </View>

            {/* Control Buttons */}
            <View className="flex-row space-x-6">
              <TouchableOpacity
                onPress={handlePauseResume}
                className="w-16 h-16 bg-card border-2 border-border rounded-full items-center justify-center"
                activeOpacity={0.7}
              >
                {isPaused ? (
                  <Play size={24} color="#2D3A6E" />
                ) : (
                  <Pause size={24} color="#2D3A6E" />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleStopRecording}
                className="w-16 h-16 bg-primary rounded-full items-center justify-center ml-6"
                activeOpacity={0.7}
              >
                <Square size={24} color="#FFFFFF" fill="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* Tips */}
      <View className="px-6 pb-8">
        <Text className="text-sm text-muted text-center">
          {isRecording
            ? 'Tap the square button when your appointment is finished'
            : 'Position your phone where it can clearly hear the conversation'}
        </Text>
      </View>
    </SafeAreaView>
  );
}
