import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CheckCircle, Mail, Home } from 'lucide-react-native';
import { Button, Card } from '@/components/ui';

export default function SuccessScreen() {
  const router = useRouter();

  const handleGoHome = () => {
    router.replace('/');
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 justify-center items-center px-6">
        {/* Success Icon */}
        <View className="w-32 h-32 bg-success/20 rounded-full items-center justify-center mb-8">
          <CheckCircle size={64} color="#4FD1C5" />
        </View>

        {/* Success Message */}
        <Text className="text-2xl font-bold text-primary text-center mb-2">
          Recording Submitted!
        </Text>
        <Text className="text-base text-muted text-center mb-8 px-4">
          Your appointment recording is being processed. This usually takes 3-5
          minutes.
        </Text>

        {/* Info Card */}
        <Card variant="bordered" className="w-full mb-8">
          <View className="flex-row items-start">
            <View className="w-12 h-12 bg-accent/10 rounded-full items-center justify-center mr-4">
              <Mail size={24} color="#5B7FE1" />
            </View>
            <View className="flex-1">
              <Text className="text-base font-semibold text-primary mb-1">
                Check your email
              </Text>
              <Text className="text-sm text-muted">
                You'll receive an email with a link to your beautifully
                formatted appointment summary once it's ready.
              </Text>
            </View>
          </View>
        </Card>

        {/* What's Next */}
        <View className="w-full mb-8">
          <Text className="text-base font-semibold text-primary mb-3">
            What happens next?
          </Text>
          <View className="space-y-2">
            <View className="flex-row items-center">
              <View className="w-6 h-6 bg-success rounded-full items-center justify-center mr-3">
                <Text className="text-white text-xs font-bold">1</Text>
              </View>
              <Text className="text-sm text-muted flex-1">
                AI transcribes your recording with medical accuracy
              </Text>
            </View>
            <View className="flex-row items-center mt-2">
              <View className="w-6 h-6 bg-success rounded-full items-center justify-center mr-3">
                <Text className="text-white text-xs font-bold">2</Text>
              </View>
              <Text className="text-sm text-muted flex-1">
                Key information is extracted and simplified
              </Text>
            </View>
            <View className="flex-row items-center mt-2">
              <View className="w-6 h-6 bg-success rounded-full items-center justify-center mr-3">
                <Text className="text-white text-xs font-bold">3</Text>
              </View>
              <Text className="text-sm text-muted flex-1">
                A shareable PDF summary is created and emailed to you
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Bottom Button */}
      <View className="px-6 pb-8">
        <Button
          onPress={handleGoHome}
          size="lg"
          className="w-full"
          icon={<Home size={20} color="#FFFFFF" />}
        >
          Back to Home
        </Button>
      </View>
    </SafeAreaView>
  );
}
