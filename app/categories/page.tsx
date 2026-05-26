'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Tag, Search } from 'lucide-react';
import Header from '@/components/Header';
import LoadingSpinner from '@/components/LoadingSpinner';
import type { VideoCategory } from '@/lib/types';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<VideoCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/categories')
      .then(r => r.json())
      .then(data => setCategories(data.categories || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Header />
      <main style={{ backgroundColor: '#e2e2df', minHeight: '100vh' }}>
        <div className="mx-auto px-6 py-10" style={{ maxWidth: '1200px' }}>
          {/* Header */}
          <div className="mb-10">
            <h1
              className="mb-3"
              style={{
                fontFamily: 'var(--font-bebas)',
                fontSize: 'clamp(48px, 6vw, 80px)',
                letterSpacing: '0.02em',
                color: '#070607',
                lineHeight: '1',
              }}
            >
              카테고리
            </h1>
            <p
              style={{
                fontFamily: 'var(--font-dm-sans)',
                fontSize: '16px',
                color: '#717171',
                lineHeight: '1.55',
              }}
            >
              YouTube 비디오 카테고리를 선택해 관련 비디오를 검색하세요.
            </p>
          </div>

          {loading && <LoadingSpinner />}

          {!loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories.map((cat, i) => (
                <Link
                  key={cat.id}
                  href={`/search?q=${encodeURIComponent(cat.title)}`}
                  className="group block"
                  style={{ textDecoration: 'none' }}
                >
                  <div
                    className="h-full transition-transform duration-200 group-hover:scale-[1.03]"
                    style={{
                      backgroundColor: i % 5 === 0 ? '#fc5000' : '#f7f6f2',
                      borderRadius: '40px',
                      padding: '32px',
                    }}
                  >
                    <div
                      className="w-10 h-10 rounded-[12px] flex items-center justify-center mb-4"
                      style={{
                        backgroundColor: i % 5 === 0 ? 'rgba(255,255,255,0.2)' : '#e2e2df',
                      }}
                    >
                      <Tag
                        className="w-5 h-5"
                        style={{ color: i % 5 === 0 ? '#ffffff' : '#fc5000' }}
                      />
                    </div>
                    <h3
                      style={{
                        fontFamily: 'var(--font-bebas)',
                        fontSize: '24px',
                        letterSpacing: '0.02em',
                        color: i % 5 === 0 ? '#ffffff' : '#070607',
                        lineHeight: '1',
                      }}
                    >
                      {cat.title}
                    </h3>
                    <div
                      className="mt-3 flex items-center gap-1 text-xs font-medium"
                      style={{
                        color: i % 5 === 0 ? 'rgba(255,255,255,0.75)' : '#fc5000',
                        fontFamily: 'var(--font-dm-sans)',
                      }}
                    >
                      <Search className="w-3 h-3" />
                      검색하기
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
