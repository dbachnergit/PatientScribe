// API Configuration
export const WEBHOOK_URL = process.env.EXPO_PUBLIC_WEBHOOK_URL ||
  'https://db6.app.n8n.cloud/webhook/d233c70b-11cd-4ee8-ade0-f943033281c0';

// Timeouts
export const UPLOAD_TIMEOUT_MS = 120000; // 2 minutes for large files

// Storage Keys
export const STORAGE_KEYS = {
  LAST_EMAIL: 'patientscribe_last_email',
  HAS_SEEN_TIPS: 'patientscribe_has_seen_tips',
} as const;

// Recording settings
export const RECORDING_OPTIONS = {
  HIGH_QUALITY: {
    android: {
      extension: '.m4a',
      outputFormat: 2, // MPEG_4
      audioEncoder: 3, // AAC
      sampleRate: 44100,
      numberOfChannels: 2,
      bitRate: 128000,
    },
    ios: {
      extension: '.m4a',
      outputFormat: 'aac',
      audioQuality: 127, // MAX
      sampleRate: 44100,
      numberOfChannels: 2,
      bitRate: 128000,
    },
    web: {
      mimeType: 'audio/webm',
      bitsPerSecond: 128000,
    },
  },
} as const;
