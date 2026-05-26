import { NextResponse } from 'next/server';
import { Innertube } from 'youtubei.js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function getText(obj: unknown): string {
  if (!obj) return '';
  if (typeof obj === 'string') return obj;
  if (typeof obj === 'object') {
    const o = obj as Record<string, unknown>;
    if (o.text) return String(o.text);
    if (Array.isArray(o.runs) && o.runs.length > 0) {
      return (o.runs as Array<{ text?: string }>).map(r => r.text || '').join('');
    }
  }
  return String(obj);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');
  const type = (searchParams.get('type') as 'video' | 'channel' | 'playlist') || 'video';

  if (!q) {
    return NextResponse.json({ error: '검색어를 입력하세요.' }, { status: 400 });
  }

  try {
    const yt = await Innertube.create({ generate_session_locally: true });
    const results = await yt.search(q, { type });

    const items = [];
    const rawResults = (results as unknown as { videos?: unknown[]; results?: unknown[] }).videos
      || (results as unknown as { results?: unknown[] }).results
      || [];

    for (const item of rawResults) {
      const v = item as Record<string, unknown>;
      if (!v.id) continue;

      const author = v.author as Record<string, unknown> | undefined;
      const thumbnails = (v.thumbnails as Array<{ url: string }>) || [];
      const authorThumbs = (author?.thumbnails as Array<{ url: string }>) || [];

      items.push({
        id: String(v.id),
        title: getText(v.title),
        description: getText(v.description_snippet || v.short_description),
        thumbnail:
          (v.best_thumbnail as { url?: string })?.url ||
          thumbnails[0]?.url ||
          `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`,
        viewCount: getText(v.short_view_count || v.view_count) || '0',
        publishedAt: getText(v.published) || '',
        duration: getText((v.duration as Record<string, unknown>)?.text !== undefined
          ? (v.duration as Record<string, unknown>)
          : v.duration) || '',
        channel: {
          id: author?.id ? String(author.id) : '',
          name: author?.name ? String(author.name) : getText(author),
          thumbnail: (author?.best_thumbnail as { url?: string })?.url || authorThumbs[0]?.url || '',
        },
      });
    }

    return NextResponse.json({ videos: items, query: q });
  } catch (err) {
    console.error('Search error:', err);
    return NextResponse.json({ error: '검색 중 오류가 발생했습니다.' }, { status: 500 });
  }
}
