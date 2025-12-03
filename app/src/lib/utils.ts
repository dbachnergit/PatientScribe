import { MIME_TYPES } from '@/types';

/**
 * Format duration in seconds to MM:SS
 */
export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Format date for display
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format date to ISO string (YYYY-MM-DD)
 */
export function formatDateISO(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Get file extension from URI
 */
export function getFileExtension(uri: string): string {
  const parts = uri.split('.');
  return parts.length > 1 ? parts.pop()?.toLowerCase() || 'm4a' : 'm4a';
}

/**
 * Get MIME type for file extension
 */
export function getMimeType(extension: string): string {
  return MIME_TYPES[extension.toLowerCase()] || 'audio/m4a';
}

/**
 * Generate filename for recording
 */
export function generateFilename(format: string): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  return `recording-${timestamp}.${format}`;
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Check if file is audio type
 */
export function isAudioFile(extension: string): boolean {
  const audioExtensions = ['m4a', 'mp3', 'wav', 'webm', 'ogg', 'flac'];
  return audioExtensions.includes(extension.toLowerCase());
}

/**
 * Check if file is text/document type
 */
export function isTextFile(extension: string): boolean {
  const textExtensions = ['txt', 'pdf'];
  return textExtensions.includes(extension.toLowerCase());
}

/**
 * Clamp number between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Merge class names (simple cn utility)
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
