import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
  Modal,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Calendar, Play, Pause } from 'lucide-react-native';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';

import { useRecordingStore } from '@/stores/useRecordingStore';
import { useAppointmentStore } from '@/stores/useAppointmentStore';
import { Button, Input, Card, Select } from '@/components/ui';
import { SPECIALTIES, type Specialty } from '@/types';
import { formatDate, formatDuration, validateEmail, isAudioFile } from '@/lib/utils';
import { STORAGE_KEYS } from '@/lib/constants';

export default function DetailsScreen() {
  const router = useRouter();
  const { uri, duration, format } = useRecordingStore();
  const {
    appointmentDate,
    providerName,
    specialty,
    email,
    setAppointmentDate,
    setProviderName,
    setSpecialty,
    setEmail,
  } = useAppointmentStore();

  // Date picker state
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Audio playback state
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackPosition, setPlaybackPosition] = useState(0);

  // Form validation
  const [emailError, setEmailError] = useState('');

  // Load saved email on mount
  useEffect(() => {
    const loadSavedEmail = async () => {
      try {
        const savedEmail = await AsyncStorage.getItem(STORAGE_KEYS.LAST_EMAIL);
        if (savedEmail && !email) {
          setEmail(savedEmail);
        }
      } catch (error) {
        console.error('Failed to load saved email:', error);
      }
    };
    loadSavedEmail();
  }, []);

  // Cleanup sound on unmount
  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  // Handle date change
  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      setAppointmentDate(selectedDate);
    }
  };

  // Handle audio playback
  const handlePlayPause = async () => {
    if (!uri || !isAudioFile(format)) return;

    try {
      if (sound) {
        if (isPlaying) {
          await sound.pauseAsync();
          setIsPlaying(false);
        } else {
          await sound.playAsync();
          setIsPlaying(true);
        }
      } else {
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri },
          { shouldPlay: true },
          (status) => {
            if (status.isLoaded) {
              setPlaybackPosition(status.positionMillis / 1000);
              if (status.didJustFinish) {
                setIsPlaying(false);
                setPlaybackPosition(0);
              }
            }
          }
        );
        setSound(newSound);
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Playback error:', error);
      Alert.alert('Error', 'Failed to play audio.');
    }
  };

  // Form submission
  const handleSubmit = async () => {
    // Validate email
    if (!email.trim()) {
      setEmailError('Email is required');
      return;
    }
    if (!validateEmail(email.trim())) {
      setEmailError('Please enter a valid email address');
      return;
    }
    setEmailError('');

    // Save email for future use
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.LAST_EMAIL, email.trim());
    } catch (error) {
      console.error('Failed to save email:', error);
    }

    // Navigate to processing
    router.push('/processing');
  };

  // Specialty options for Select
  const specialtyOptions = SPECIALTIES.map((s) => ({
    label: s || 'Select specialty (optional)',
    value: s,
  }));

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="flex-row items-center px-4 py-2">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <ArrowLeft size={24} color="#2D3A6E" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-primary ml-2">
          Appointment Details
        </Text>
      </View>

      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        {/* Audio Preview */}
        {uri && isAudioFile(format) && (
          <Card variant="bordered" className="mb-6 mt-4">
            <View className="flex-row items-center">
              <TouchableOpacity
                onPress={handlePlayPause}
                className="w-14 h-14 bg-accent rounded-full items-center justify-center mr-4"
                activeOpacity={0.7}
              >
                {isPlaying ? (
                  <Pause size={24} color="#FFFFFF" />
                ) : (
                  <Play size={24} color="#FFFFFF" />
                )}
              </TouchableOpacity>
              <View className="flex-1">
                <Text className="text-sm text-muted">Recording</Text>
                <Text className="text-base font-semibold text-primary">
                  {formatDuration(isPlaying ? playbackPosition : duration)}
                  {duration > 0 && ` / ${formatDuration(duration)}`}
                </Text>
              </View>
            </View>
          </Card>
        )}

        {/* Date Picker */}
        <View className="mb-4">
          <Text className="text-primary font-semibold mb-2 text-base">
            Appointment Date
          </Text>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            className="bg-card border border-input rounded-xl px-4 py-4 flex-row items-center justify-between"
            activeOpacity={0.7}
          >
            <Text className="text-base text-primary">
              {formatDate(appointmentDate)}
            </Text>
            <Calendar size={20} color="#6B6966" />
          </TouchableOpacity>
        </View>

        {/* iOS Date Picker Modal */}
        {Platform.OS === 'ios' && showDatePicker && (
          <Modal
            transparent
            animationType="slide"
            visible={showDatePicker}
            onRequestClose={() => setShowDatePicker(false)}
          >
            <View className="flex-1 justify-end bg-black/50">
              <View className="bg-card rounded-t-3xl">
                <View className="flex-row justify-between items-center px-4 py-3 border-b border-border">
                  <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                    <Text className="text-muted text-base">Cancel</Text>
                  </TouchableOpacity>
                  <Text className="text-primary font-semibold text-base">
                    Select Date
                  </Text>
                  <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                    <Text className="text-accent font-semibold text-base">
                      Done
                    </Text>
                  </TouchableOpacity>
                </View>
                <DateTimePicker
                  value={appointmentDate}
                  mode="date"
                  display="spinner"
                  maximumDate={new Date()}
                  onChange={handleDateChange}
                />
              </View>
            </View>
          </Modal>
        )}

        {/* Android Date Picker */}
        {Platform.OS === 'android' && showDatePicker && (
          <DateTimePicker
            value={appointmentDate}
            mode="date"
            display="default"
            maximumDate={new Date()}
            onChange={handleDateChange}
          />
        )}

        {/* Provider Name */}
        <Input
          label="Provider Name"
          placeholder="Dr. Smith"
          value={providerName}
          onChangeText={setProviderName}
          containerClassName="mb-4"
        />

        {/* Specialty */}
        <Select
          label="Specialty"
          placeholder="Select specialty (optional)"
          value={specialty}
          options={specialtyOptions}
          onValueChange={(value) => setSpecialty(value as Specialty)}
          containerClassName="mb-4"
        />
        <Text className="text-sm text-muted -mt-2 mb-4">
          AI will auto-detect if left blank
        </Text>

        {/* Email */}
        <Input
          label="Email for PDF Delivery"
          placeholder="patient@email.com"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            if (emailError) setEmailError('');
          }}
          error={emailError}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          containerClassName="mb-6"
        />
      </ScrollView>

      {/* Submit Button */}
      <View className="px-6 pb-8">
        <Button onPress={handleSubmit} size="lg" className="w-full">
          Process My Recording
        </Button>
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-4 items-center"
        >
          <Text className="text-accent font-medium">Back to re-record</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
