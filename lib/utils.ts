export type InputType = 'video' | 'channel' | 'playlist' | 'search';

export interface ParsedInput {
  type: InputType;
  id: string;
}

export function extractVideoId(input: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?(?:.*&)?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([^&?/\s]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];
  for (const pattern of patterns) {
    const match = input.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export function extractChannelIdentifier(input: string): string | null {
  const patterns = [
    /youtube\.com\/@([^/?&\s]+)/,
    /youtube\.com\/channel\/(UC[^/?&\s]+)/,
    /youtube\.com\/c\/([^/?&\s]+)/,
    /youtube\.com\/user\/([^/?&\s]+)/,
    /^@([^/?&\s]+)$/,
    /^(UC[a-zA-Z0-9_-]{22})$/,
  ];
  for (const pattern of patterns) {
    const match = input.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export function extractPlaylistId(input: string): string | null {
  const match = input.match(/[?&]list=([^&\s]+)/);
  return match ? match[1] : null;
}

export function parseYouTubeInput(input: string): ParsedInput {
  const trimmed = input.trim();

  const playlistId = extractPlaylistId(trimmed);
  if (playlistId) return { type: 'playlist', id: playlistId };

  const videoId = extractVideoId(trimmed);
  if (videoId) return { type: 'video', id: videoId };

  const channelId = extractChannelIdentifier(trimmed);
  if (channelId) return { type: 'channel', id: channelId };

  return { type: 'search', id: trimmed };
}

export function formatCount(n: string | number): string {
  const num = typeof n === 'string' ? parseInt(n.replace(/,/g, ''), 10) : n;
  if (isNaN(num) || num === 0) return typeof n === 'string' ? n : '0';
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + 'B';
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
  if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
  return num.toLocaleString('ko-KR');
}

export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function timeAgo(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return `${diff}초 전`;
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)}일 전`;
  if (diff < 31536000) return `${Math.floor(diff / 2592000)}개월 전`;
  return `${Math.floor(diff / 31536000)}년 전`;
}
