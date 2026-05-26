export interface VideoInfo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  viewCount: string | number;
  likeCount: string | number;
  publishedAt: string;
  duration: string;
  tags: string[];
  category: string;
  channel: {
    id: string;
    name: string;
    thumbnail: string;
    subscriberCount: string;
    isVerified: boolean;
  };
}

export interface SearchResult {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  viewCount: string;
  publishedAt: string;
  duration: string;
  channel: {
    id: string;
    name: string;
    thumbnail: string;
  };
}

export interface ChannelInfo {
  id: string;
  handle: string;
  name: string;
  description: string;
  thumbnail: string;
  banner: string;
  subscriberCount: string;
  videoCount: string;
  viewCount: string;
  joinedDate: string;
  isVerified: boolean;
  keywords: string[];
}

export interface PlaylistInfo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoCount: number;
  author: string;
  videos: PlaylistVideo[];
}

export interface PlaylistVideo {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  channel: string;
  index: number;
}

export interface TranscriptSegment {
  text: string;
  duration: number;
  offset: number;
}

export interface TrendingVideo {
  id: string;
  title: string;
  thumbnail: string;
  viewCount: string;
  publishedAt: string;
  channel: {
    id: string;
    name: string;
  };
  duration: string;
}

export interface VideoCategory {
  id: string;
  title: string;
}
