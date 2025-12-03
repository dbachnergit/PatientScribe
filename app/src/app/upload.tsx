import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, FileAudio, FileText, Upload } from 'lucide-react-native';
import * as DocumentPicker from 'expo-document-picker';
import { useRecordingStore } from '@/stores/useRecordingStore';
import { Button, Card } from '@/components/ui';
import { getFileExtension, isAudioFile, isTextFile } from '@/lib/utils';
import { SUPPORTED_EXTENSIONS } from '@/types';

export default function UploadScreen() {
  const router = useRouter();
  const { setRecording } = useRecordingStore();

  const handlePickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['audio/*', 'text/plain', 'application/pdf'],
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        return;
      }

      const file = result.assets[0];
      const extension = getFileExtension(file.name || file.uri);

      if (!SUPPORTED_EXTENSIONS.includes(extension)) {
        Alert.alert(
          'Unsupported File',
          `Please select a supported file type: ${SUPPORTED_EXTENSIONS.join(', ').toUpperCase()}`,
          [{ text: 'OK' }]
        );
        return;
      }

      // Store the file info
      setRecording(file.uri, 0, extension);

      // Navigate to details
      router.push('/details');
    } catch (error) {
      console.error('Error picking file:', error);
      Alert.alert('Error', 'Failed to pick file. Please try again.');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="flex-row items-center px-4 py-2">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <ArrowLeft size={24} color="#2D3A6E" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-primary ml-2">
          Upload File
        </Text>
      </View>

      {/* Content */}
      <View className="flex-1 px-6 pt-8">
        {/* Upload Area */}
        <TouchableOpacity onPress={handlePickFile} activeOpacity={0.7}>
          <Card
            variant="bordered"
            className="items-center justify-center py-16 border-dashed border-2"
          >
            <View className="w-20 h-20 bg-accent/10 rounded-full items-center justify-center mb-4">
              <Upload size={40} color="#5B7FE1" />
            </View>
            <Text className="text-lg font-semibold text-primary mb-2">
              Tap to select a file
            </Text>
            <Text className="text-sm text-muted text-center">
              Choose an audio recording or transcript
            </Text>
          </Card>
        </TouchableOpacity>

        {/* Supported Formats */}
        <View className="mt-8">
          <Text className="text-base font-semibold text-primary mb-4">
            Supported Formats
          </Text>

          <Card variant="bordered" className="mb-3">
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-accent/10 rounded-lg items-center justify-center mr-3">
                <FileAudio size={20} color="#5B7FE1" />
              </View>
              <View className="flex-1">
                <Text className="text-base font-medium text-primary">
                  Audio Files
                </Text>
                <Text className="text-sm text-muted">
                  M4A, MP3, WAV, WEBM, OGG, FLAC
                </Text>
              </View>
            </View>
          </Card>

          <Card variant="bordered">
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-success/10 rounded-lg items-center justify-center mr-3">
                <FileText size={20} color="#4FD1C5" />
              </View>
              <View className="flex-1">
                <Text className="text-base font-medium text-primary">
                  Text Files
                </Text>
                <Text className="text-sm text-muted">
                  TXT, PDF (transcript files)
                </Text>
              </View>
            </View>
          </Card>
        </View>
      </View>

      {/* Bottom Button */}
      <View className="px-6 pb-8">
        <Button onPress={handlePickFile} size="lg" className="w-full">
          Choose File
        </Button>
      </View>
    </SafeAreaView>
  );
}
