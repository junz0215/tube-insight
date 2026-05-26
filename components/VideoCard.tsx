import Link from 'next/link';
import Image from 'next/image';
import { Clock, Eye } from 'lucide-react';
import type { SearchResult } from '@/lib/types';

interface Props {
  video: SearchResult;
}

export default function VideoCard({ video }: Props) {
  return (
    <Link href={`/video/${video.id}`} className="group block">
      <div
        className="overflow-hidden transition-transform duration-200 group-hover:scale-[1.02]"
        style={{ backgroundColor: '#f7f6f2', borderRadius: '40px' }}
      >
        <div className="relative aspect-video overflow-hidden" style={{ borderRadius: '32px 32px 0 0' }}>
          <Image
            src={video.thumbnail || `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
            alt={video.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {video.duration && (
            <span
              className="absolute bottom-2 right-2 text-xs font-medium px-2 py-1"
              style={{
                backgroundColor: 'rgba(7,6,7,0.85)',
                color: '#ffffff',
                borderRadius: '8px',
                fontFamily: 'var(--font-dm-sans)',
              }}
            >
              {video.duration}
            </span>
          )}
        </div>

        <div className="p-5">
          {video.channel.thumbnail && (
            <div className="flex items-start gap-3 mb-3">
              <Image
                src={video.channel.thumbnail}
                alt={video.channel.name}
                width={32}
                height={32}
                className="rounded-full flex-shrink-0 mt-0.5"
              />
              <div className="min-w-0">
                <h3
                  className="font-medium text-sm line-clamp-2 leading-snug mb-1"
                  style={{ color: '#070607', fontFamily: 'var(--font-dm-sans)' }}
                >
                  {video.title}
                </h3>
                <p className="text-xs truncate" style={{ color: '#717171', fontFamily: 'var(--font-dm-sans)' }}>
                  {video.channel.name}
                </p>
              </div>
            </div>
          )}

          {!video.channel.thumbnail && (
            <h3
              className="font-medium text-sm line-clamp-2 leading-snug mb-2"
              style={{ color: '#070607', fontFamily: 'var(--font-dm-sans)' }}
            >
              {video.title}
            </h3>
          )}

          <div className="flex items-center gap-3 text-xs" style={{ color: '#717171', fontFamily: 'var(--font-dm-sans)' }}>
            {video.viewCount && (
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {video.viewCount}
              </span>
            )}
            {video.publishedAt && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {video.publishedAt}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
