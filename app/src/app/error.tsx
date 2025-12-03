import { View, Text } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AlertCircle, RefreshCw, Home } from 'lucide-react-native';
import { Button, Card } from '@/components/ui';

export default function ErrorScreen() {
  const router = useRouter();
  const { message } = useLocalSearchParams<{ message: string }>();

  const handleRetry = () => {
    router.back();
  };

  const handleGoHome = () => {
    router.replace('/');
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 justify-center items-center px-6">
        {/* Error Icon */}
        <View className="w-32 h-32 bg-recording/20 rounded-full items-center justify-center mb-8">
          <AlertCircle size={64} color="#F56565" />
        </View>

        {/* Error Message */}
        <Text className="text-2xl font-bold text-primary text-center mb-2">
          Something went wrong
        </Text>
        <Text className="text-base text-muted text-center mb-8 px-4">
          We couldn't process your recording. Please try again.
        </Text>

        {/* Error Details Card */}
        {message && (
          <Card variant="bordered" className="w-full mb-8 bg-recording/5">
            <View className="flex-row items-start">
              <AlertCircle size={20} color="#F56565" />
              <Text className="text-sm text-recording ml-3 flex-1">
                {message}
              </Text>
            </View>
          </Card>
        )}

        {/* Troubleshooting Tips */}
        <Card variant="bordered" className="w-full mb-8">
          <Text className="text-base font-semibold text-primary mb-3">
            Troubleshooting tips:
          </Text>
          <View className="space-y-2">
            <Text className="text-sm text-muted">
              • Check your internet connection
            </Text>
            <Text className="text-sm text-muted mt-1">
              • Make sure your file is a supported format
            </Text>
            <Text className="text-sm text-muted mt-1">
              • Try recording again if the file is corrupted
            </Text>
            <Text className="text-sm text-muted mt-1">
              • Wait a moment and try again
            </Text>
          </View>
        </Card>
      </View>

      {/* Bottom Buttons */}
      <View className="px-6 pb-8 space-y-3">
        <Button
          onPress={handleRetry}
          size="lg"
          className="w-full"
          icon={<RefreshCw size={20} color="#FFFFFF" />}
        >
          Try Again
        </Button>
        <Button
          variant="outline"
          onPress={handleGoHome}
          size="lg"
          className="w-full mt-3"
          icon={<Home size={20} color="#2D3A6E" />}
        >
          Back to Home
        </Button>
      </View>
    </SafeAreaView>
  );
}
