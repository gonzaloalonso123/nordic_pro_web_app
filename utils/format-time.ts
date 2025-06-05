import { formatDistanceToNow, format, isToday, isYesterday, isThisWeek } from 'date-fns';

/**
 * Format a timestamp for chat sidebar display
 * - "now", "5min ago" for recent messages
 * - "10:30 AM" for today's messages
 * - "Yesterday" for yesterday's messages
 * - "Mon" for this week's messages
 * - "Dec 25" for older messages
 */
export function formatChatTime(timestamp: string | Date): string {
  const date = new Date(timestamp);
  const now = new Date();

  // Handle invalid dates
  if (isNaN(date.getTime())) {
    return '';
  }

  // If within the last minute, show "now"
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  if (diffInMinutes < 1) {
    return 'now';
  }

  // If within the last hour, show "5min ago"
  if (diffInMinutes < 60) {
    return `${diffInMinutes}min ago`;
  }

  // If today, show time like "10:30 AM"
  if (isToday(date)) {
    return format(date, 'h:mm a');
  }

  // If yesterday, show "Yesterday"
  if (isYesterday(date)) {
    return 'Yesterday';
  }

  // If this week, show day name like "Mon"
  if (isThisWeek(date)) {
    return format(date, 'EEE');
  }

  // For older messages, show "Dec 25"
  return format(date, 'MMM d');
}

/**
 * Format message preview text
 * Truncate long messages and handle special content types
 */
export function formatMessagePreview(content: string, maxLength: number = 50): string {
  if (!content) return 'No recent messages';

  // Remove extra whitespace and newlines
  const cleaned = content.replace(/\s+/g, ' ').trim();

  if (cleaned.length <= maxLength) {
    return cleaned;
  }

  return cleaned.substring(0, maxLength - 3) + '...';
}

/**
 * Format message preview with sender name
 */
export function formatMessagePreviewWithSender(
  content: string,
  senderFirstName: string | null,
  senderLastName: string | null,
  currentUserId: string,
  messageSenderId: string | null,
  maxLength: number = 50
): string {
  const preview = formatMessagePreview(content, maxLength - 10); // Leave room for sender name

  if (!messageSenderId) {
    return preview;
  }

  // If the current user sent the message, prefix with "You:"
  if (messageSenderId === currentUserId) {
    return `You: ${preview}`;
  }

  // Otherwise, use the sender's first name
  const senderName = senderFirstName || 'Someone';
  return `${senderName}: ${preview}`;
}

