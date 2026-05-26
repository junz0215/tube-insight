'use client';

import { useEffect, useState } from 'react';
import { use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ExternalLink, CheckCircle, Users, Video, Eye, Calendar } from 'lucide-react';
import Header from '@/components/Header';
import StatsCard from '@/components/StatsCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import type { ChannelInfo } from '@/lib/types';

interface Props {
  params: Promise<{ id: string }>;
}

export default function ChannelPage({ params }: Props) {
  const { id } = use(params);
  const [channel, setChannel] = useState<ChannelInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/channel/${encodeURIComponent(id)}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) setError(data.error);
        else setChannel(data);
      })
      .catch(() => setError('채널 정보를 불러올 수 없습니다.'))
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

          {loading && <LoadingSpinner label="채널 분석 중..." />}
          {error && <ErrorMessage message={error} />}

          {channel && (
            <div className="space-y-6">
              {/* Banner */}
              {channel.banner && (
                <div
                  className="relative h-48 overflow-hidden"
                  style={{ borderRadius: '40px' }}
                >
                  <Image
                    src={channel.banner}
                    alt={`${channel.name} 배너`}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              {/* Profile */}
              <div
                className="flex flex-col md:flex-row gap-6 items-start"
                style={{ backgroundColor: '#f7f6f2', borderRadius: '40px', padding: '40px' }}
              >
                {channel.thumbnail && (
                  <Image
                    src={channel.thumbnail}
                    alt={channel.name}
                    width={96}
                    height={96}
                    className="rounded-full flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h1
                      style={{
                        fontFamily: 'var(--font-bebas)',
                        fontSize: '40px',
                        letterSpacing: '0.02em',
                        color: '#070607',
                        lineHeight: '1',
                      }}
                    >
                      {channel.name}
                    </h1>
                    {channel.isVerified && (
                      <CheckCircle className="w-6 h-6 flex-shrink-0" style={{ color: '#fc5000' }} />
                    )}
                  </div>
                  {channel.handle && (
                    <p
                      className="text-sm mb-3"
                      style={{ color: '#717171', fontFamily: 'var(--font-dm-sans)' }}
                    >
                      {channel.handle.startsWith('@') ? channel.handle : `@${channel.handle}`}
                    </p>
                  )}
                  {channel.description && (
                    <p
                      className="text-sm leading-relaxed line-clamp-3"
                      style={{ color: '#444', fontFamily: 'var(--font-dm-sans)' }}
                    >
                      {channel.description}
                    </p>
                  )}
                  <div className="mt-4">
                    <a
                      href={`https://www.youtube.com/${channel.handle || `channel/${channel.id}`}`}
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

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatsCard
                  label="구독자"
                  value={channel.subscriberCount || '—'}
                  variant="orange"
                  icon={<Users className="w-5 h-5" />}
                />
                <StatsCard
                  label="전체 비디오"
                  value={channel.videoCount || '—'}
                  variant="ash"
                  icon={<Video className="w-5 h-5" />}
                />
                <StatsCard
                  label="총 조회수"
                  value={channel.viewCount || '—'}
                  variant="ash"
                  icon={<Eye className="w-5 h-5" />}
                />
                <StatsCard
                  label="채널 개설"
                  value={channel.joinedDate ? channel.joinedDate.slice(0, 4) : '—'}
                  variant="ash"
                  icon={<Calendar className="w-5 h-5" />}
                />
              </div>

              {/* Description full */}
              {channel.description && channel.description.length > 150 && (
                <div style={{ backgroundColor: '#f7f6f2', borderRadius: '40px', padding: '40px' }}>
                  <h2
                    className="mb-4"
                    style={{
                      fontFamily: 'var(--font-bebas)',
                      fontSize: '28px',
                      letterSpacing: '0.02em',
                      color: '#070607',
                    }}
                  >
                    채널 소개
                  </h2>
                  <p
                    className="text-sm whitespace-pre-line leading-relaxed"
                    style={{ color: '#444', fontFamily: 'var(--font-dm-sans)' }}
                  >
                    {channel.description}
                  </p>
                </div>
              )}

              {/* Keywords */}
              {channel.keywords && channel.keywords.length > 0 && (
                <div style={{ backgroundColor: '#f7f6f2', borderRadius: '40px', padding: '40px' }}>
                  <h2
                    className="mb-4"
                    style={{
                      fontFamily: 'var(--font-bebas)',
                      fontSize: '28px',
                      letterSpacing: '0.02em',
                      color: '#070607',
                    }}
                  >
                    채널 키워드
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {channel.keywords.slice(0, 30).map((kw, i) => (
                      <span
                        key={i}
                        className="text-sm font-medium px-4 py-2"
                        style={{
                          backgroundColor: '#e2e2df',
                          borderRadius: '800px',
                          color: '#070607',
                          fontFamily: 'var(--font-dm-sans)',
                        }}
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Search channel videos */}
              <div style={{ backgroundColor: '#070607', borderRadius: '40px', padding: '40px' }}>
                <h2
                  className="mb-2"
                  style={{
                    fontFamily: 'var(--font-bebas)',
                    fontSize: '28px',
                    letterSpacing: '0.02em',
                    color: '#ffffff',
                  }}
                >
                  이 채널 비디오 검색
                </h2>
                <p
                  className="text-sm mb-4"
                  style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'var(--font-dm-sans)' }}
                >
                  채널 이름으로 비디오를 검색해 볼 수 있습니다.
                </p>
                <Link
                  href={`/search?q=${encodeURIComponent(channel.name)}`}
                  className="btn-primary inline-flex items-center gap-2 text-sm"
                  style={{ padding: '12px 24px' }}
                >
                  비디오 검색하기
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
