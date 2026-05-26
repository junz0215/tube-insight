'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Tv2, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import { extractChannelIdentifier } from '@/lib/utils';

export default function ChannelInputPage() {
  const router = useRouter();
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  function handleAnalyze() {
    const trimmed = input.trim();
    if (!trimmed) return;

    const channelId = extractChannelIdentifier(trimmed);
    if (channelId) {
      router.push(`/channel/${encodeURIComponent(channelId)}`);
    } else if (trimmed.startsWith('UC')) {
      router.push(`/channel/${encodeURIComponent(trimmed)}`);
    } else {
      setError('올바른 YouTube 채널 URL을 입력해 주세요.');
    }
  }

  const examples = [
    'https://www.youtube.com/@MrBeast',
    'https://www.youtube.com/channel/UCxxxxxxx',
    '@채널핸들',
  ];

  return (
    <>
      <Header />
      <main style={{ backgroundColor: '#e2e2df', minHeight: '100vh' }}>
        <div className="mx-auto px-6 py-10" style={{ maxWidth: '800px' }}>
          <div
            className="relative overflow-hidden mb-8"
            style={{ backgroundColor: '#070607', borderRadius: '40px', padding: '56px 48px' }}
          >
            <div
              className="blob-violet"
              style={{ width: 300, height: 250, top: -60, right: -40, opacity: 0.4 }}
            />
            <div className="relative">
              <div
                className="w-14 h-14 rounded-[18px] flex items-center justify-center mb-6"
                style={{ backgroundColor: '#fc5000' }}
              >
                <Tv2 className="w-7 h-7 text-white" />
              </div>
              <h1
                style={{
                  fontFamily: 'var(--font-bebas)',
                  fontSize: '64px',
                  letterSpacing: '0.02em',
                  color: '#ffffff',
                  lineHeight: '1',
                }}
              >
                채널 분석
              </h1>
              <p
                className="mt-3"
                style={{
                  fontFamily: 'var(--font-dm-sans)',
                  fontSize: '16px',
                  color: 'rgba(255,255,255,0.65)',
                  lineHeight: '1.55',
                }}
              >
                채널 URL 또는 핸들(@)을 입력하면 구독자 수, 비디오 수, 채널 설명 등을 분석합니다.
              </p>
            </div>
          </div>

          <div style={{ backgroundColor: '#f7f6f2', borderRadius: '40px', padding: '40px' }}>
            <label
              className="block text-sm font-medium mb-3"
              style={{ color: '#070607', fontFamily: 'var(--font-dm-sans)' }}
            >
              채널 URL 또는 핸들
            </label>
            <div className="flex gap-3 mb-4">
              <input
                className="search-input flex-1"
                type="text"
                placeholder="https://www.youtube.com/@채널명"
                value={input}
                onChange={e => { setInput(e.target.value); setError(''); }}
                onKeyDown={e => e.key === 'Enter' && handleAnalyze()}
              />
              <button
                className="btn-primary flex items-center gap-2 whitespace-nowrap"
                style={{ padding: '16px 24px' }}
                onClick={handleAnalyze}
              >
                분석
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {error && (
              <p className="text-sm mb-4" style={{ color: '#fc5000', fontFamily: 'var(--font-dm-sans)' }}>
                {error}
              </p>
            )}

            <p className="text-xs mb-2" style={{ color: '#888', fontFamily: 'var(--font-dm-sans)' }}>
              예시:
            </p>
            <div className="flex flex-wrap gap-2">
              {examples.map(ex => (
                <button
                  key={ex}
                  className="text-xs px-3 py-1.5 font-medium"
                  style={{
                    backgroundColor: '#e2e2df',
                    borderRadius: '800px',
                    color: '#444',
                    fontFamily: 'var(--font-dm-sans)',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                  onClick={() => setInput(ex)}
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
