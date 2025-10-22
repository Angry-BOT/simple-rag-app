/**
 * Formatting utility functions
 * Helper functions for formatting data display
 */

/**
 * Format file size from bytes to human-readable format
 * @param bytes File size in bytes
 * @returns Formatted file size string
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Format date to relative time string
 * @param date Date to format
 * @returns Relative time string (e.g., "2 hours ago")
 */
export const formatRelativeTime = (date: Date | string): string => {
  const now = new Date();
  const then = typeof date === 'string' ? new Date(date) : date;
  const diffMs = now.getTime() - then.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return 'just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

  return then.toLocaleDateString();
};

/**
 * Format date to time string
 * @param date Date to format
 * @returns Time string (e.g., "2:30 PM")
 */
export const formatTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });
};

/**
 * Truncate text to specified length
 * @param text Text to truncate
 * @param maxLength Maximum length
 * @returns Truncated text with ellipsis if needed
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Get file icon name based on file type
 * @param fileType File extension or type
 * @returns Icon name for lucide-react
 */
export const getFileIcon = (fileType: string): string => {
  const type = fileType.toLowerCase().replace('.', '');
  const iconMap: Record<string, string> = {
    pdf: 'file-text',
    txt: 'file-text',
    html: 'code',
    htm: 'code',
  };
  return iconMap[type] || 'file';
};

