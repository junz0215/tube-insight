'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import VideoCard from '@/components/VideoCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import type { SearchResult } from '@/lib/types';

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';

  const [input, setInput] = useState(query);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!query) return;
    setLoading(true);
    setError('');
    fetch(`/api/search?q=${encodeURIComponent(query)}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) setError(data.error);
        else setResults(data.videos || []);
      })
      .catch(() => setError('검색 중 오류가 발생했습니다.'))
      .finally(() => setLoading(false));
  }, [query]);

  function handleSearch() {
    const trimmed = input.trim();
    if (!trimmed) return;
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  }

  return (
    <main style={{ backgroundColor: '#e2e2df', minHeight: '100vh' }}>
      <div className="mx-auto px-6 py-10" style={{ maxWidth: '1200px' }}>
        {/* Search bar */}
        <div className="mb-10">
          <h1
            className="mb-6"
            style={{
              fontFamily: 'var(--font-bebas)',
              fontSize: '48px',
              letterSpacing: '0.02em',
              color: '#070607',
              lineHeight: '1',
            }}
          >
            비디오 검색
          </h1>
          <div className="flex gap-3" style={{ maxWidth: '700px' }}>
            <div className="relative flex-1">
              <Search
                className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5"
                style={{ color: '#888' }}
              />
              <input
                className="search-input"
                style={{ paddingLeft: '48px' }}
                type="text"
                placeholder="검색어를 입력하세요..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <button
              className="btn-primary flex items-center gap-2"
              style={{ padding: '16px 24px' }}
              onClick={handleSearch}
            >
              검색
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {loading && <LoadingSpinner label="검색 중..." />}
        {error && <ErrorMessage message={error} />}

        {!loading && !error && results.length > 0 && (
          <>
            <p
              className="mb-6 text-sm font-medium"
              style={{ color: '#717171', fontFamily: 'var(--font-dm-sans)' }}
            >
              <span style={{ color: '#fc5000' }}>{query}</span> 검색 결과 {results.length}개
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {results.map(video => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          </>
        )}

        {!loading && !error && query && results.length === 0 && (
          <div
            className="text-center py-20"
            style={{ fontFamily: 'var(--font-dm-sans)', color: '#717171' }}
          >
            <p className="text-lg font-medium">검색 결과가 없습니다.</p>
            <p className="text-sm mt-2">다른 키워드로 검색해 보세요.</p>
          </div>
        )}

        {!query && (
          <div
            className="text-center py-20"
            style={{ fontFamily: 'var(--font-dm-sans)', color: '#717171' }}
          >
            <Search className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">검색어를 입력하세요</p>
          </div>
        )}
      </div>
    </main>
  );
}

export default function SearchPage() {
  return (
    <>
      <Header />
      <Suspense fallback={<LoadingSpinner label="로딩 중..." />}>
        <SearchContent />
      </Suspense>
    </>
  );
}
