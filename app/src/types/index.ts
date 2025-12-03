// Recording types
export interface RecordingData {
  uri: string;
  duration: number;
  format: string;
}

// Appointment types
export interface AppointmentDetails {
  appointmentDate: Date;
  providerName: string;
  specialty: Specialty;
  recipientEmail: string;
}

// Submission types
export interface SubmissionPayload {
  file: {
    uri: string;
    type: string;
    name: string;
  };
  appointmentDate: string;
  providerName: string;
  specialty: string;
  recipientEmail: string;
  fileFormat: string;
}

export interface WebhookResponse {
  status: 'accepted' | 'error';
  message: string;
}

// Specialty options matching n8n workflow
export type Specialty =
  | ''
  | 'Primary Care'
  | 'Cardiology'
  | 'Dental'
  | 'Physical Therapy'
  | 'Mental Health'
  | 'Urology'
  | 'Oncology'
  | 'Endocrinology'
  | 'Dermatology'
  | 'Orthopedics'
  | 'Other';

export const SPECIALTIES: Specialty[] = [
  '',
  'Primary Care',
  'Cardiology',
  'Dental',
  'Physical Therapy',
  'Mental Health',
  'Urology',
  'Oncology',
  'Endocrinology',
  'Dermatology',
  'Orthopedics',
  'Other',
];

// File type mapping
export const MIME_TYPES: Record<string, string> = {
  'm4a': 'audio/m4a',
  'mp3': 'audio/mpeg',
  'wav': 'audio/wav',
  'webm': 'audio/webm',
  'ogg': 'audio/ogg',
  'flac': 'audio/flac',
  'txt': 'text/plain',
  'pdf': 'application/pdf',
};

// Supported file extensions
export const SUPPORTED_AUDIO_EXTENSIONS = ['m4a', 'mp3', 'wav', 'webm', 'ogg', 'flac'];
export const SUPPORTED_TEXT_EXTENSIONS = ['txt', 'pdf'];
export const SUPPORTED_EXTENSIONS = [...SUPPORTED_AUDIO_EXTENSIONS, ...SUPPORTED_TEXT_EXTENSIONS];
