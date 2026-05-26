'use client';

import { useEffect, useState } from 'react';
import { TrendingUp } from 'lucide-react';
import Header from '@/components/Header';
import VideoCard from '@/components/VideoCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import type { TrendingVideo } from '@/lib/types';

export default function TrendingPage() {
  const [videos, setVideos] = useState<TrendingVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/trending')
      .then(r => r.json())
      .then(data => {
        if (data.error) setError(data.error);
        else setVideos(data.videos || []);
      })
      .catch(() => setError('트렌드 정보를 불러올 수 없습니다.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Header />
      <main style={{ backgroundColor: '#e2e2df', minHeight: '100vh' }}>
        <div className="mx-auto px-6 py-10" style={{ maxWidth: '1200px' }}>
          {/* Header section */}
          <div
            className="mb-10 relative overflow-hidden"
            style={{ backgroundColor: '#fc5000', borderRadius: '40px', padding: '48px 40px' }}
          >
            <div
              className="blob-violet"
              style={{ width: 300, height: 250, top: -80, right: -40, opacity: 0.3 }}
            />
            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-12 h-12 rounded-[16px] flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
                >
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <span
                  className="text-sm font-medium px-4 py-1.5 rounded-full"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    color: '#ffffff',
                    fontFamily: 'var(--font-dm-sans)',
                  }}
                >
                  실시간 업데이트
                </span>
              </div>
              <h1
                style={{
                  fontFamily: 'var(--font-bebas)',
                  fontSize: 'clamp(48px, 6vw, 80px)',
                  letterSpacing: '0.02em',
                  color: '#ffffff',
                  lineHeight: '1',
                }}
              >
                인기 급상승
                <br />
                비디오
              </h1>
              <p
                className="mt-4 max-w-md"
                style={{
                  fontFamily: 'var(--font-dm-sans)',
                  fontSize: '16px',
                  color: 'rgba(255,255,255,0.8)',
                  lineHeight: '1.55',
                }}
              >
                지금 YouTube에서 가장 인기 있는 비디오를 실시간으로 확인하세요.
              </p>
            </div>
          </div>

          {loading && <LoadingSpinner label="트렌드 불러오는 중..." />}
          {error && <ErrorMessage message={error} />}

          {!loading && !error && videos.length > 0 && (
            <>
              <p
                className="mb-6 text-sm font-medium"
                style={{ color: '#717171', fontFamily: 'var(--font-dm-sans)' }}
              >
                인기 급상승 비디오 {videos.length}개
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {videos.map((video, i) => (
                  <div key={video.id} className="relative">
                    {i < 3 && (
                      <div
                        className="absolute top-3 left-3 z-10 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium"
                        style={{
                          backgroundColor: '#fc5000',
                          color: '#ffffff',
                          fontFamily: 'var(--font-bebas)',
                          fontSize: '18px',
                          letterSpacing: '0.02em',
                        }}
                      >
                        {i + 1}
                      </div>
                    )}
                    <VideoCard
                      video={{
                        ...video,
                        description: '',
                        channel: { ...video.channel, thumbnail: '' },
                      }}
                    />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}
