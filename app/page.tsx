'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, TrendingUp, Tv2, List, FileText, Tag, BarChart3, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import { parseYouTubeInput } from '@/lib/utils';

const features = [
  {
    icon: Search,
    title: '비디오 검색',
    desc: '키워드로 YouTube 비디오를 검색하고 결과를 분석합니다.',
    href: '/search',
  },
  {
    icon: Tv2,
    title: '채널 분석',
    desc: '구독자 수, 총 비디오 수, 채널 설명 등 상세 채널 정보를 확인합니다.',
    href: '/channel',
  },
  {
    icon: TrendingUp,
    title: '트렌드 분석',
    desc: '인기 급상승 비디오를 실시간으로 확인하고 트렌드를 파악합니다.',
    href: '/trending',
  },
  {
    icon: List,
    title: '플레이리스트',
    desc: '플레이리스트 정보와 포함된 전체 비디오 목록을 조회합니다.',
    href: '/playlist',
  },
  {
    icon: FileText,
    title: '자막 추출',
    desc: '비디오 URL로 자막과 스크립트를 텍스트로 추출합니다.',
    href: '/transcript',
  },
  {
    icon: Tag,
    title: '카테고리 조회',
    desc: 'YouTube 비디오 카테고리 목록을 확인하고 분류합니다.',
    href: '/categories',
  },
];

const stats = [
  { label: '분석 기능', value: '7+', variant: 'orange' as const },
  { label: 'API 키 불필요', value: '0', variant: 'ash' as const },
  { label: '무료 사용', value: '100%', variant: 'ash' as const },
  { label: '실시간 데이터', value: '24/7', variant: 'orange' as const },
];

export default function HomePage() {
  const router = useRouter();
  const [input, setInput] = useState('');

  function handleAnalyze() {
    const trimmed = input.trim();
    if (!trimmed) return;
    const parsed = parseYouTubeInput(trimmed);
    if (parsed.type === 'video') router.push(`/video/${parsed.id}`);
    else if (parsed.type === 'channel') router.push(`/channel/${encodeURIComponent(parsed.id)}`);
    else if (parsed.type === 'playlist') router.push(`/playlist/${parsed.id}`);
    else router.push(`/search?q=${encodeURIComponent(parsed.id)}`);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleAnalyze();
  }

  return (
    <>
      <Header />
      <main style={{ backgroundColor: '#e2e2df', minHeight: '100vh' }}>
        {/* Hero */}
        <section className="relative overflow-hidden py-20 px-6">
          {/* Decorative blobs */}
          <div
            className="blob-violet"
            style={{ width: 500, height: 400, top: -100, right: -80 }}
          />
          <div
            className="blob-orange"
            style={{ width: 350, height: 300, bottom: -50, left: -60 }}
          />

          <div className="relative mx-auto text-center" style={{ maxWidth: '900px' }}>
            <div
              className="inline-flex items-center gap-2 px-4 py-2 mb-8 text-sm font-medium"
              style={{
                backgroundColor: '#f7f6f2',
                borderRadius: '800px',
                color: '#070607',
                fontFamily: 'var(--font-dm-sans)',
              }}
            >
              <span
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: '#fc5000' }}
              />
              API 키 없이 바로 사용 가능
            </div>

            <h1
              className="font-display mb-6"
              style={{
                fontFamily: 'var(--font-bebas)',
                fontSize: 'clamp(64px, 10vw, 96px)',
                lineHeight: '0.94',
                letterSpacing: '0.02em',
                color: '#070607',
              }}
            >
              YOUTUBE
              <br />
              <span style={{ color: '#fc5000' }}>INSIGHTS</span>
            </h1>

            <p
              className="mb-10 mx-auto"
              style={{
                fontFamily: 'var(--font-dm-sans)',
                fontSize: '18px',
                lineHeight: '1.55',
                color: '#444',
                maxWidth: '560px',
              }}
            >
              채널 URL, 비디오 링크, 검색어를 입력하면<br />
              유튜브 데이터를 즉시 분석해 드립니다.
            </p>

            {/* Search bar */}
            <div className="flex items-center gap-3 mx-auto" style={{ maxWidth: '680px' }}>
              <div className="relative flex-1">
                <Search
                  className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5"
                  style={{ color: '#888' }}
                />
                <input
                  className="search-input"
                  style={{ paddingLeft: '48px' }}
                  type="text"
                  placeholder="YouTube URL 또는 검색어 입력..."
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>
              <button
                className="btn-primary flex items-center gap-2 whitespace-nowrap"
                style={{ padding: '18px 28px', fontSize: '15px' }}
                onClick={handleAnalyze}
              >
                분석하기
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <p
              className="mt-4 text-xs"
              style={{ color: '#888', fontFamily: 'var(--font-dm-sans)' }}
            >
              예: youtube.com/@채널명 · youtube.com/watch?v=... · 검색 키워드
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="px-6 pb-10" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map(s => (
              <div
                key={s.label}
                className="flex flex-col"
                style={{
                  backgroundColor: s.variant === 'orange' ? '#fc5000' : '#f7f6f2',
                  borderRadius: '40px',
                  padding: '32px 24px',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-bebas)',
                    fontSize: '56px',
                    lineHeight: '0.94',
                    letterSpacing: '0.02em',
                    color: s.variant === 'orange' ? '#ffffff' : '#070607',
                  }}
                >
                  {s.value}
                </div>
                <div
                  className="text-sm font-medium mt-2"
                  style={{
                    fontFamily: 'var(--font-dm-sans)',
                    color: s.variant === 'orange' ? 'rgba(255,255,255,0.8)' : '#717171',
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="px-6 pb-20" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="mb-10">
            <h2
              style={{
                fontFamily: 'var(--font-bebas)',
                fontSize: '48px',
                lineHeight: '1',
                letterSpacing: '0.02em',
                color: '#070607',
              }}
            >
              주요 기능
            </h2>
            <p
              className="mt-2"
              style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '16px', color: '#717171' }}
            >
              YouTube 데이터를 다양한 방식으로 분석하세요.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map(f => {
              const Icon = f.icon;
              return (
                <Link
                  key={f.href}
                  href={f.href}
                  className="group block"
                  style={{ textDecoration: 'none' }}
                >
                  <div
                    className="h-full transition-transform duration-200 group-hover:scale-[1.02]"
                    style={{ backgroundColor: '#f7f6f2', borderRadius: '40px', padding: '40px' }}
                  >
                    <div
                      className="w-12 h-12 rounded-[16px] flex items-center justify-center mb-6"
                      style={{ backgroundColor: '#e2e2df' }}
                    >
                      <Icon className="w-6 h-6" style={{ color: '#fc5000' }} />
                    </div>
                    <h3
                      className="mb-3"
                      style={{
                        fontFamily: 'var(--font-bebas)',
                        fontSize: '28px',
                        letterSpacing: '0.02em',
                        color: '#070607',
                        lineHeight: '1',
                      }}
                    >
                      {f.title}
                    </h3>
                    <p
                      className="text-sm"
                      style={{
                        fontFamily: 'var(--font-dm-sans)',
                        color: '#717171',
                        lineHeight: '1.55',
                      }}
                    >
                      {f.desc}
                    </p>
                    <div
                      className="mt-6 flex items-center gap-1 text-sm font-medium"
                      style={{ color: '#fc5000', fontFamily: 'var(--font-dm-sans)' }}
                    >
                      바로가기
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 pb-20">
          <div
            className="mx-auto relative overflow-hidden"
            style={{
              maxWidth: '1200px',
              backgroundColor: '#070607',
              borderRadius: '40px',
              padding: '64px 48px',
              textAlign: 'center',
            }}
          >
            <div
              className="blob-violet"
              style={{ width: 300, height: 250, top: -50, left: '10%', opacity: 0.25 }}
            />
            <div
              className="blob-orange"
              style={{ width: 250, height: 200, bottom: -30, right: '15%', opacity: 0.2 }}
            />
            <h2
              className="relative font-display mb-4"
              style={{
                fontFamily: 'var(--font-bebas)',
                fontSize: 'clamp(40px, 6vw, 64px)',
                letterSpacing: '0.02em',
                color: '#ffffff',
                lineHeight: '1',
              }}
            >
              지금 바로 시작하세요
            </h2>
            <p
              className="relative mb-8 mx-auto"
              style={{
                fontFamily: 'var(--font-dm-sans)',
                fontSize: '16px',
                color: 'rgba(255,255,255,0.65)',
                maxWidth: '480px',
                lineHeight: '1.55',
              }}
            >
              API 키 없이 무료로 YouTube 채널과 비디오를 분석하세요.
            </p>
            <Link
              href="/trending"
              className="relative btn-primary inline-flex items-center gap-2"
              style={{ fontSize: '15px', padding: '14px 28px' }}
            >
              <BarChart3 className="w-4 h-4" />
              트렌드 분석 시작
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
