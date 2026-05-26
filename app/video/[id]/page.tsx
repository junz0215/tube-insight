'use client';

import { useEffect, useState } from 'react';
import { use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Eye, ThumbsUp, Clock, Tag, Users, ArrowLeft, ExternalLink, FileText } from 'lucide-react';
import Header from '@/components/Header';
import StatsCard from '@/components/StatsCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import { formatCount, formatDuration } from '@/lib/utils';
import type { VideoInfo, TranscriptSegment } from '@/lib/types';

interface Props {
  params: Promise<{ id: string }>;
}

export default function VideoPage({ params }: Props) {
  const { id } = use(params);
  const [video, setVideo] = useState<VideoInfo | null>(null);
  const [transcript, setTranscript] = useState<TranscriptSegment[] | null>(null);
  const [transcriptLoading, setTranscriptLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/video/${id}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) setError(data.error);
        else setVideo(data);
      })
      .catch(() => setError('비디오 정보를 불러올 수 없습니다.'))
      .finally(() => setLoading(false));
  }, [id]);

  function loadTranscript() {
    setTranscriptLoading(true);
    fetch(`/api/transcript?id=${id}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) alert(data.error);
        else setTranscript(data.transcript || []);
      })
      .catch(() => alert('자막을 불러올 수 없습니다.'))
      .finally(() => setTranscriptLoading(false));
  }

  const durationFormatted = video?.duration
    ? formatDuration(Number(video.duration))
    : '';

  return (
    <>
      <Header />
      <main style={{ backgroundColor: '#e2e2df', minHeight: '100vh' }}>
        <div className="mx-auto px-6 py-10" style={{ maxWidth: '1200px' }}>
          <Link
            href="/search"
            className="inline-flex items-center gap-2 mb-8 text-sm font-medium"
            style={{ color: '#070607', fontFamily: 'var(--font-dm-sans)', textDecoration: 'none' }}
          >
            <ArrowLeft className="w-4 h-4" />
            뒤로가기
          </Link>

          {loading && <LoadingSpinner label="비디오 정보 불러오는 중..." />}
          {error && <ErrorMessage message={error} />}

          {video && (
            <div className="space-y-6">
              {/* Top section */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Thumbnail */}
                <div className="lg:col-span-3">
                  <div
                    className="relative aspect-video overflow-hidden"
                    style={{ borderRadius: '40px' }}
                  >
                    <Image
                      src={video.thumbnail || `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`}
                      alt={video.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 60vw"
                    />
                    <a
                      href={`https://www.youtube.com/watch?v=${id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute inset-0 flex items-center justify-center"
                      style={{ backgroundColor: 'rgba(7,6,7,0.3)' }}
                    >
                      <div
                        className="w-16 h-16 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: '#fc5000' }}
                      >
                        <svg viewBox="0 0 24 24" className="w-7 h-7 ml-1" fill="white">
                          <polygon points="5,3 19,12 5,21" />
                        </svg>
                      </div>
                    </a>
                  </div>
                </div>

                {/* Info */}
                <div
                  className="lg:col-span-2 flex flex-col"
                  style={{ backgroundColor: '#f7f6f2', borderRadius: '40px', padding: '32px' }}
                >
                  <h1
                    className="mb-4"
                    style={{
                      fontFamily: 'var(--font-bebas)',
                      fontSize: '32px',
                      letterSpacing: '0.02em',
                      color: '#070607',
                      lineHeight: '1.1',
                    }}
                  >
                    {video.title}
                  </h1>

                  {video.channel.name && (
                    <Link
                      href={`/channel/${encodeURIComponent(video.channel.id || video.channel.name)}`}
                      className="flex items-center gap-3 mb-6 p-3 rounded-[20px] transition-colors"
                      style={{
                        backgroundColor: '#e2e2df',
                        textDecoration: 'none',
                        color: '#070607',
                      }}
                    >
                      <Users className="w-5 h-5 flex-shrink-0" style={{ color: '#fc5000' }} />
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                          {video.channel.name}
                        </p>
                        {video.channel.subscriberCount && (
                          <p className="text-xs" style={{ color: '#717171', fontFamily: 'var(--font-dm-sans)' }}>
                            구독자 {video.channel.subscriberCount}
                          </p>
                        )}
                      </div>
                    </Link>
                  )}

                  <div className="space-y-3 flex-1">
                    {video.publishedAt && (
                      <div className="flex items-center gap-2 text-sm" style={{ color: '#717171', fontFamily: 'var(--font-dm-sans)' }}>
                        <Clock className="w-4 h-4 flex-shrink-0" />
                        업로드: {video.publishedAt}
                      </div>
                    )}
                    {video.category && (
                      <div className="flex items-center gap-2 text-sm" style={{ color: '#717171', fontFamily: 'var(--font-dm-sans)' }}>
                        <Tag className="w-4 h-4 flex-shrink-0" />
                        카테고리: {video.category}
                      </div>
                    )}
                    {durationFormatted && (
                      <div className="flex items-center gap-2 text-sm" style={{ color: '#717171', fontFamily: 'var(--font-dm-sans)' }}>
                        <Clock className="w-4 h-4 flex-shrink-0" />
                        재생 시간: {durationFormatted}
                      </div>
                    )}
                  </div>

                  <div className="mt-6 flex gap-3 flex-wrap">
                    <a
                      href={`https://www.youtube.com/watch?v=${id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary inline-flex items-center gap-2 text-sm"
                      style={{ padding: '10px 20px' }}
                    >
                      <ExternalLink className="w-4 h-4" />
                      YouTube에서 보기
                    </a>
                    <button
                      className="btn-ghost inline-flex items-center gap-2 text-sm"
                      style={{ height: '40px', padding: '0 16px' }}
                      onClick={loadTranscript}
                      disabled={transcriptLoading}
                    >
                      <FileText className="w-4 h-4" />
                      {transcriptLoading ? '불러오는 중...' : '자막 보기'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <StatsCard
                  label="조회수"
                  value={formatCount(video.viewCount)}
                  variant="orange"
                  icon={<Eye className="w-5 h-5" />}
                />
                <StatsCard
                  label="좋아요"
                  value={formatCount(video.likeCount)}
                  variant="ash"
                  icon={<ThumbsUp className="w-5 h-5" />}
                />
                {video.tags.length > 0 && (
                  <StatsCard
                    label="태그 수"
                    value={String(video.tags.length)}
                    variant="ash"
                    icon={<Tag className="w-5 h-5" />}
                  />
                )}
              </div>

              {/* Description */}
              {video.description && (
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
                    설명
                  </h2>
                  <p
                    className="whitespace-pre-line text-sm leading-relaxed"
                    style={{ color: '#444', fontFamily: 'var(--font-dm-sans)' }}
                  >
                    {video.description.slice(0, 1500)}
                    {video.description.length > 1500 && '...'}
                  </p>
                </div>
              )}

              {/* Tags */}
              {video.tags.length > 0 && (
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
                    태그
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {video.tags.map(tag => (
                      <span
                        key={tag}
                        className="text-sm font-medium px-4 py-2"
                        style={{
                          backgroundColor: '#e2e2df',
                          borderRadius: '800px',
                          color: '#070607',
                          fontFamily: 'var(--font-dm-sans)',
                        }}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Transcript */}
              {transcript && (
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
                    자막 / 스크립트
                  </h2>
                  <div
                    className="max-h-96 overflow-y-auto space-y-2 pr-2"
                    style={{ fontFamily: 'var(--font-dm-sans)' }}
                  >
                    {transcript.map((seg, i) => (
                      <div key={i} className="flex gap-3 text-sm">
                        <span
                          className="flex-shrink-0 text-xs font-medium pt-0.5"
                          style={{ color: '#fc5000', minWidth: '50px' }}
                        >
                          {Math.floor(seg.offset / 1000 / 60)}:{String(Math.floor((seg.offset / 1000) % 60)).padStart(2, '0')}
                        </span>
                        <span style={{ color: '#444', lineHeight: '1.5' }}>{seg.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
