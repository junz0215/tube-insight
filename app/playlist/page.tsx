'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { List, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import { extractPlaylistId } from '@/lib/utils';

export default function PlaylistInputPage() {
  const router = useRouter();
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  function handleAnalyze() {
    const trimmed = input.trim();
    if (!trimmed) return;
    const listId = extractPlaylistId(trimmed) || trimmed;
    if (listId.startsWith('PL') || listId.startsWith('RD') || listId.startsWith('LL')) {
      router.push(`/playlist/${listId}`);
    } else {
      setError('올바른 YouTube 플레이리스트 URL을 입력해 주세요.');
    }
  }

  return (
    <>
      <Header />
      <main style={{ backgroundColor: '#e2e2df', minHeight: '100vh' }}>
        <div className="mx-auto px-6 py-10" style={{ maxWidth: '800px' }}>
          <div
            className="relative overflow-hidden mb-8"
            style={{ backgroundColor: '#fc5000', borderRadius: '40px', padding: '56px 48px' }}
          >
            <div
              className="blob-violet"
              style={{ width: 280, height: 220, top: -50, right: -30, opacity: 0.35 }}
            />
            <div className="relative">
              <div
                className="w-14 h-14 rounded-[18px] flex items-center justify-center mb-6"
                style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
              >
                <List className="w-7 h-7 text-white" />
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
                플레이리스트
              </h1>
              <p
                className="mt-3"
                style={{
                  fontFamily: 'var(--font-dm-sans)',
                  fontSize: '16px',
                  color: 'rgba(255,255,255,0.8)',
                  lineHeight: '1.55',
                }}
              >
                플레이리스트 URL을 입력하면 포함된 모든 비디오 목록을 조회합니다.
              </p>
            </div>
          </div>

          <div style={{ backgroundColor: '#f7f6f2', borderRadius: '40px', padding: '40px' }}>
            <label
              className="block text-sm font-medium mb-3"
              style={{ color: '#070607', fontFamily: 'var(--font-dm-sans)' }}
            >
              플레이리스트 URL
            </label>
            <div className="flex gap-3 mb-3">
              <input
                className="search-input flex-1"
                type="text"
                placeholder="https://www.youtube.com/playlist?list=PL..."
                value={input}
                onChange={e => { setInput(e.target.value); setError(''); }}
                onKeyDown={e => e.key === 'Enter' && handleAnalyze()}
              />
              <button
                className="btn-primary flex items-center gap-2 whitespace-nowrap"
                style={{ padding: '16px 24px' }}
                onClick={handleAnalyze}
              >
                조회
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            {error && (
              <p className="text-sm" style={{ color: '#fc5000', fontFamily: 'var(--font-dm-sans)' }}>
                {error}
              </p>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
