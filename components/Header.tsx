'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TrendingUp, Search, PlayCircle } from 'lucide-react';

const navItems = [
  { href: '/search', label: '비디오 검색', icon: Search },
  { href: '/trending', label: '트렌드', icon: TrendingUp },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-[#d0d0cc]" style={{ backgroundColor: '#e2e2df' }}>
      <div className="mx-auto px-6 flex items-center justify-between h-16" style={{ maxWidth: '1200px' }}>
        <Link href="/" className="flex items-center gap-2 group">
          <div
            className="w-9 h-9 rounded-[12px] flex items-center justify-center"
            style={{ backgroundColor: '#fc5000' }}
          >
            <PlayCircle className="w-5 h-5" style={{ color: '#ffffff' }} />
          </div>
          <span
            className="font-display text-2xl"
            style={{ color: '#070607', fontFamily: 'var(--font-bebas)', letterSpacing: '0.05em' }}
          >
            TubeInsight
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-2">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="nav-link flex items-center gap-2 text-sm font-medium"
              style={{
                backgroundColor: pathname === href ? '#070607' : '#f7f6f2',
                color: pathname === href ? '#ffffff' : '#070607',
              }}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </nav>

        <Link
          href="/trending"
          className="btn-primary text-sm hidden md:flex items-center gap-2"
          style={{ padding: '10px 20px' }}
        >
          <TrendingUp className="w-4 h-4" />
          인기 급상승
        </Link>
      </div>
    </header>
  );
}
