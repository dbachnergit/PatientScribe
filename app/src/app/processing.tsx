import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMutation } from '@tanstack/react-query';
import { Upload, FileCheck, Sparkles, Mail } from 'lucide-react-native';

import { useRecordingStore } from '@/stores/useRecordingStore';
import { useAppointmentStore } from '@/stores/useAppointmentStore';
import { submitRecording } from '@/services/webhook';
import { Card } from '@/components/ui';

type ProcessingStep = 'uploading' | 'transcribing' | 'analyzing' | 'sending';

interface StepConfig {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const STEPS: Record<ProcessingStep, StepConfig> = {
  uploading: {
    icon: <Upload size={32} color="#5B7FE1" />,
    title: 'Uploading Recording',
    description: 'Securely transferring your file...',
  },
  transcribing: {
    icon: <FileCheck size={32} color="#5B7FE1" />,
    title: 'Transcribing Audio',
    description: 'Converting speech to text with medical accuracy...',
  },
  analyzing: {
    icon: <Sparkles size={32} color="#5B7FE1" />,
    title: 'Analyzing Content',
    description: 'Creating your personalized summary...',
  },
  sending: {
    icon: <Mail size={32} color="#5B7FE1" />,
    title: 'Preparing Delivery',
    description: 'Getting your summary ready to send...',
  },
};

export default function ProcessingScreen() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<ProcessingStep>('uploading');

  const { uri, format, clearRecording } = useRecordingStore();
  const { appointmentDate, providerName, specialty, email, reset: resetAppointment } = useAppointmentStore();

  const mutation = useMutation({
    mutationFn: submitRecording,
    onSuccess: () => {
      // Clear stores
      clearRecording();
      resetAppointment();
      // Navigate to success
      router.replace('/success');
    },
    onError: (error: Error) => {
      // Navigate to error screen with message
      router.replace({
        pathname: '/error',
        params: { message: error.message },
      });
    },
  });

  // Start submission on mount
  useEffect(() => {
    if (!uri) {
      router.replace('/');
      return;
    }

    // Simulate step progression for UX
    const stepTimers = [
      setTimeout(() => setCurrentStep('transcribing'), 2000),
      setTimeout(() => setCurrentStep('analyzing'), 5000),
      setTimeout(() => setCurrentStep('sending'), 8000),
    ];

    // Start actual submission
    mutation.mutate({
      uri,
      format,
      appointmentDate,
      providerName,
      specialty,
      email,
    });

    return () => {
      stepTimers.forEach(clearTimeout);
    };
  }, []);

  const step = STEPS[currentStep];

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 justify-center items-center px-6">
        {/* Processing Card */}
        <Card variant="bordered" className="w-full items-center py-12">
          {/* Animated Icon Container */}
          <View className="w-24 h-24 bg-accent/10 rounded-full items-center justify-center mb-6">
            {step.icon}
          </View>

          {/* Step Title */}
          <Text className="text-xl font-bold text-primary mb-2 text-center">
            {step.title}
          </Text>

          {/* Step Description */}
          <Text className="text-base text-muted text-center mb-6">
            {step.description}
          </Text>

          {/* Loading Indicator */}
          <ActivityIndicator size="large" color="#5B7FE1" />
        </Card>

        {/* Progress Steps */}
        <View className="flex-row justify-center mt-8 space-x-2">
          {(Object.keys(STEPS) as ProcessingStep[]).map((stepKey, index) => {
            const stepIndex = (Object.keys(STEPS) as ProcessingStep[]).indexOf(currentStep);
            const isActive = index <= stepIndex;
            return (
              <View
                key={stepKey}
                className={`w-3 h-3 rounded-full ml-2 ${
                  isActive ? 'bg-accent' : 'bg-border'
                }`}
              />
            );
          })}
        </View>

        {/* Info Text */}
        <Text className="text-sm text-muted text-center mt-8 px-4">
          This may take a few minutes. You'll receive an email at{' '}
          <Text className="font-semibold text-primary">{email}</Text> when your
          summary is ready.
        </Text>
      </View>
    </SafeAreaView>
  );
}
