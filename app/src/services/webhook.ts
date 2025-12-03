import { Platform } from 'react-native';
import { WEBHOOK_URL, UPLOAD_TIMEOUT_MS } from '@/lib/constants';
import { getMimeType, getFileExtension, formatDateISO } from '@/lib/utils';
import type { WebhookResponse, Specialty } from '@/types';

export interface SubmitRecordingParams {
  uri: string;
  format: string;
  appointmentDate: Date;
  providerName: string;
  specialty: Specialty;
  email: string;
}

/**
 * Submit recording to n8n webhook using multipart/form-data
 * Handles platform-specific file handling (web vs native)
 */
export async function submitRecording(params: SubmitRecordingParams): Promise<WebhookResponse> {
  const { uri, format, appointmentDate, providerName, specialty, email } = params;

  const fileExtension = format || getFileExtension(uri);
  const mimeType = getMimeType(fileExtension);
  const fileName = `recording.${fileExtension}`;

  // Create FormData
  const formData = new FormData();

  // Platform-specific file handling
  if (Platform.OS === 'web') {
    // Web: fetch file as Blob
    const response = await fetch(uri);
    const blob = await response.blob();
    formData.append('file', blob, fileName);
  } else {
    // Native (iOS/Android): use URI directly
    formData.append('file', {
      uri: uri,
      type: mimeType,
      name: fileName,
    } as unknown as Blob);
  }

  // Append metadata fields
  formData.append('appointmentDate', formatDateISO(appointmentDate));
  formData.append('providerName', providerName);
  formData.append('specialty', specialty);
  formData.append('recipientEmail', email);
  formData.append('fileFormat', fileExtension);

  // Create abort controller for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), UPLOAD_TIMEOUT_MS);

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      body: formData,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server error: ${response.status} - ${errorText}`);
    }

    // n8n webhook returns minimal response on success
    return {
      status: 'accepted',
      message: 'Recording submitted successfully. You will receive an email with your summary.',
    };
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error) {
      // Handle specific error types
      if (error.name === 'AbortError') {
        throw new Error('Upload timed out. Please check your connection and try again.');
      }

      // CORS error detection
      if (error.message.includes('Failed to fetch') || error.message.includes('Network request failed')) {
        throw new Error('Unable to connect to server. Please check your internet connection.');
      }

      throw error;
    }

    throw new Error('An unexpected error occurred during upload.');
  }
}
