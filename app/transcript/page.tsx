'use client';

import { useState } from 'react';
import { FileText, Search, Download, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import type { TranscriptSegment } from '@/lib/types';

export default function TranscriptPage() {
  const [input, setInput] = useState('');
  const [lang, setLang] = useState('ko');
  const [transcript, setTranscript] = useState<TranscriptSegment[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleFetch() {
    const trimmed = input.trim();
    if (!trimmed) return;
    setLoading(true);
    setError('');
    setTranscript(null);

    const params = new URLSearchParams({ id: trimmed });
    if (lang) params.set('lang', lang);

    try {
      const res = await fetch(`/api/transcript?${params}`);
      const data = await res.json();
      if (data.error) setError(data.error);
      else setTranscript(data.transcript || []);
    } catch {
      setError('자막을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }

  function handleDownload() {
    if (!transcript) return;
    const text = transcript.map(s => {
      const min = Math.floor(s.offset / 1000 / 60);
      const sec = Math.floor((s.offset / 1000) % 60);
      return `[${min}:${String(sec).padStart(2, '0')}] ${s.text}`;
    }).join('\n');
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transcript.txt';
    a.click();
    URL.revokeObjectURL(url);
  }

  const fullText = transcript?.map(s => s.text).join(' ');

  return (
    <>
      <Header />
      <main style={{ backgroundColor: '#e2e2df', minHeight: '100vh' }}>
        <div className="mx-auto px-6 py-10" style={{ maxWidth: '900px' }}>
          {/* Header */}
          <div
            className="mb-8 relative overflow-hidden"
            style={{ backgroundColor: '#070607', borderRadius: '40px', padding: '48px 40px' }}
          >
            <div
              className="blob-violet"
              style={{ width: 250, height: 200, top: -60, right: -30, opacity: 0.4 }}
            />
            <div className="relative flex items-center gap-4 mb-4">
              <div
                className="w-12 h-12 rounded-[16px] flex items-center justify-center"
                style={{ backgroundColor: '#fc5000' }}
              >
                <FileText className="w-6 h-6 text-white" />
              </div>
            </div>
            <h1
              className="relative"
              style={{
                fontFamily: 'var(--font-bebas)',
                fontSize: '56px',
                letterSpacing: '0.02em',
                color: '#ffffff',
                lineHeight: '1',
              }}
            >
              자막 추출
            </h1>
            <p
              className="relative mt-3"
              style={{
                fontFamily: 'var(--font-dm-sans)',
                fontSize: '16px',
                color: 'rgba(255,255,255,0.65)',
                lineHeight: '1.55',
              }}
            >
              YouTube 비디오 URL 또는 ID를 입력하면 자막을 텍스트로 추출합니다.
            </p>
          </div>

          {/* Input form */}
          <div
            className="mb-6"
            style={{ backgroundColor: '#f7f6f2', borderRadius: '40px', padding: '40px' }}
          >
            <div className="space-y-4">
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: '#070607', fontFamily: 'var(--font-dm-sans)' }}
                >
                  비디오 URL 또는 ID
                </label>
                <div className="relative">
                  <Search
                    className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5"
                    style={{ color: '#888' }}
                  />
                  <input
                    className="search-input"
                    style={{ paddingLeft: '48px' }}
                    type="text"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleFetch()}
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: '#070607', fontFamily: 'var(--font-dm-sans)' }}
                  >
                    언어
                  </label>
                  <select
                    className="px-4 py-3 text-sm font-medium border-2 border-[#070607] outline-none"
                    style={{
                      borderRadius: '100px',
                      backgroundColor: 'transparent',
                      color: '#070607',
                      fontFamily: 'var(--font-dm-sans)',
                    }}
                    value={lang}
                    onChange={e => setLang(e.target.value)}
                  >
                    <option value="ko">한국어</option>
                    <option value="en">영어</option>
                    <option value="ja">일본어</option>
                    <option value="zh-Hans">중국어(간체)</option>
                    <option value="zh-Hant">중국어(번체)</option>
                    <option value="">자동</option>
                  </select>
                </div>

                <button
                  className="btn-primary flex items-center gap-2 self-end"
                  style={{ padding: '14px 24px', marginBottom: '2px' }}
                  onClick={handleFetch}
                  disabled={loading}
                >
                  추출하기
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {loading && <LoadingSpinner label="자막 추출 중..." />}
          {error && <ErrorMessage message={error} />}

          {transcript && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p
                  className="text-sm font-medium"
                  style={{ color: '#717171', fontFamily: 'var(--font-dm-sans)' }}
                >
                  총 {transcript.length}개 세그먼트
                </p>
                <button
                  className="btn-ghost flex items-center gap-2 text-sm"
                  style={{ height: '40px', padding: '0 16px' }}
                  onClick={handleDownload}
                >
                  <Download className="w-4 h-4" />
                  TXT 다운로드
                </button>
              </div>

              {/* Full text */}
              <div style={{ backgroundColor: '#070607', borderRadius: '40px', padding: '40px' }}>
                <h2
                  className="mb-4"
                  style={{
                    fontFamily: 'var(--font-bebas)',
                    fontSize: '28px',
                    letterSpacing: '0.02em',
                    color: '#ffffff',
                  }}
                >
                  전체 텍스트
                </h2>
                <p
                  className="text-sm leading-relaxed"
                  style={{
                    color: 'rgba(255,255,255,0.75)',
                    fontFamily: 'var(--font-dm-sans)',
                    lineHeight: '1.7',
                  }}
                >
                  {fullText}
                </p>
              </div>

              {/* Timestamped */}
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
                  타임스탬프별 자막
                </h2>
                <div className="max-h-96 overflow-y-auto space-y-2 pr-2">
                  {transcript.map((seg, i) => {
                    const min = Math.floor(seg.offset / 1000 / 60);
                    const sec = Math.floor((seg.offset / 1000) % 60);
                    return (
                      <div key={i} className="flex gap-3 text-sm">
                        <span
                          className="flex-shrink-0 text-xs font-medium pt-0.5"
                          style={{
                            color: '#fc5000',
                            minWidth: '50px',
                            fontFamily: 'var(--font-dm-sans)',
                          }}
                        >
                          {min}:{String(sec).padStart(2, '0')}
                        </span>
                        <span style={{ color: '#444', fontFamily: 'var(--font-dm-sans)', lineHeight: '1.5' }}>
                          {seg.text}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
