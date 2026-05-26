'use client';

import { useEffect, useState } from 'react';
import { use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, List, Clock, ExternalLink } from 'lucide-react';
import Header from '@/components/Header';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import type { PlaylistInfo } from '@/lib/types';

interface Props {
  params: Promise<{ id: string }>;
}

export default function PlaylistPage({ params }: Props) {
  const { id } = use(params);
  const [playlist, setPlaylist] = useState<PlaylistInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/playlist/${id}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) setError(data.error);
        else setPlaylist(data);
      })
      .catch(() => setError('플레이리스트를 불러올 수 없습니다.'))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <>
      <Header />
      <main style={{ backgroundColor: '#e2e2df', minHeight: '100vh' }}>
        <div className="mx-auto px-6 py-10" style={{ maxWidth: '1200px' }}>
          <Link
            href="/"
            className="inline-flex items-center gap-2 mb-8 text-sm font-medium"
            style={{ color: '#070607', fontFamily: 'var(--font-dm-sans)', textDecoration: 'none' }}
          >
            <ArrowLeft className="w-4 h-4" />
            홈으로
          </Link>

          {loading && <LoadingSpinner label="플레이리스트 불러오는 중..." />}
          {error && <ErrorMessage message={error} />}

          {playlist && (
            <div className="space-y-6">
              {/* Header */}
              <div
                className="flex flex-col md:flex-row gap-6"
                style={{ backgroundColor: '#f7f6f2', borderRadius: '40px', padding: '40px' }}
              >
                {playlist.thumbnail && (
                  <div
                    className="relative flex-shrink-0 overflow-hidden"
                    style={{ width: 200, height: 130, borderRadius: '20px' }}
                  >
                    <Image
                      src={playlist.thumbnail}
                      alt={playlist.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <List className="w-5 h-5" style={{ color: '#fc5000' }} />
                    <span
                      className="text-xs font-medium uppercase tracking-wider"
                      style={{ color: '#fc5000', fontFamily: 'var(--font-dm-sans)' }}
                    >
                      플레이리스트
                    </span>
                  </div>
                  <h1
                    className="mb-2"
                    style={{
                      fontFamily: 'var(--font-bebas)',
                      fontSize: '40px',
                      letterSpacing: '0.02em',
                      color: '#070607',
                      lineHeight: '1',
                    }}
                  >
                    {playlist.title}
                  </h1>
                  {playlist.author && (
                    <p className="text-sm mb-3" style={{ color: '#717171', fontFamily: 'var(--font-dm-sans)' }}>
                      제작: {playlist.author}
                    </p>
                  )}
                  <div
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium"
                    style={{
                      backgroundColor: '#e2e2df',
                      borderRadius: '800px',
                      color: '#070607',
                      fontFamily: 'var(--font-dm-sans)',
                    }}
                  >
                    <Clock className="w-4 h-4" />
                    비디오 {playlist.videoCount}개
                  </div>
                  <div className="mt-4">
                    <a
                      href={`https://www.youtube.com/playlist?list=${id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary inline-flex items-center gap-2 text-sm"
                      style={{ padding: '10px 20px' }}
                    >
                      <ExternalLink className="w-4 h-4" />
                      YouTube에서 보기
                    </a>
                  </div>
                </div>
              </div>

              {/* Video list */}
              <div style={{ backgroundColor: '#f7f6f2', borderRadius: '40px', padding: '40px' }}>
                <h2
                  className="mb-6"
                  style={{
                    fontFamily: 'var(--font-bebas)',
                    fontSize: '28px',
                    letterSpacing: '0.02em',
                    color: '#070607',
                  }}
                >
                  비디오 목록
                </h2>
                <div className="space-y-3">
                  {playlist.videos.map(video => (
                    <Link
                      key={video.id}
                      href={`/video/${video.id}`}
                      className="flex items-center gap-4 p-3 rounded-[20px] transition-colors group"
                      style={{
                        backgroundColor: '#e2e2df',
                        textDecoration: 'none',
                      }}
                    >
                      <span
                        className="flex-shrink-0 text-sm font-medium w-7 text-center"
                        style={{ color: '#717171', fontFamily: 'var(--font-dm-sans)' }}
                      >
                        {video.index}
                      </span>
                      {video.thumbnail && (
                        <div
                          className="relative flex-shrink-0 overflow-hidden"
                          style={{ width: 80, height: 52, borderRadius: '12px' }}
                        >
                          <Image
                            src={video.thumbnail}
                            alt={video.title}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-sm font-medium truncate group-hover:text-[#fc5000] transition-colors"
                          style={{ color: '#070607', fontFamily: 'var(--font-dm-sans)' }}
                        >
                          {video.title}
                        </p>
                        {video.channel && (
                          <p className="text-xs mt-0.5 truncate" style={{ color: '#717171', fontFamily: 'var(--font-dm-sans)' }}>
                            {video.channel}
                          </p>
                        )}
                      </div>
                      {video.duration && (
                        <span
                          className="flex-shrink-0 text-xs font-medium"
                          style={{ color: '#717171', fontFamily: 'var(--font-dm-sans)' }}
                        >
                          {video.duration}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
