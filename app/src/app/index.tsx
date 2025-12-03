import { View, Text, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mic, Upload } from 'lucide-react-native';
import { Button } from '@/components/ui';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 px-6 justify-center items-center">
        {/* Logo/Header */}
        <View className="items-center mb-12">
          <View className="w-24 h-24 bg-primary rounded-full items-center justify-center mb-6">
            <Mic size={48} color="#FFFFFF" />
          </View>
          <Text className="text-3xl font-bold text-primary text-center">
            PatientScribe
          </Text>
          <Text className="text-base text-muted text-center mt-2 px-8">
            Transform your medical appointments into clear, shareable summaries
          </Text>
        </View>

        {/* Action Buttons */}
        <View className="w-full space-y-4">
          <Button
            onPress={() => router.push('/recording')}
            size="lg"
            className="w-full"
            icon={<Mic size={24} color="#FFFFFF" />}
          >
            Record Appointment
          </Button>

          <Button
            variant="outline"
            onPress={() => router.push('/upload')}
            size="lg"
            className="w-full mt-4"
            icon={<Upload size={24} color="#2D3A6E" />}
          >
            Upload Recording
          </Button>
        </View>

        {/* Info Text */}
        <View className="mt-12 px-4">
          <Text className="text-sm text-muted text-center">
            Record your medical appointment or upload an existing recording.
            We'll create a beautiful summary you can share with family.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
