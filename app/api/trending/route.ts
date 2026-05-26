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
    if (Array.isArray(o.runs)) {
      return (o.runs as Array<{ text?: string }>).map(r => r.text || '').join('');
    }
  }
  return String(obj);
}

function extractVideoItems(items: unknown[], results: unknown[]): void {
  for (const item of items) {
    if (!item || typeof item !== 'object') continue;
    const v = item as Record<string, unknown>;
    if (v.id && v.title) {
      results.push(v);
    } else if (Array.isArray(v.contents)) {
      extractVideoItems(v.contents as unknown[], results);
    } else if (Array.isArray(v.items)) {
      extractVideoItems(v.items as unknown[], results);
    }
  }
}

export async function GET() {
  try {
    const yt = await Innertube.create({ generate_session_locally: true });
    const feed = await yt.getHomeFeed();

    const rawItems = (feed as unknown as { videos?: unknown[]; contents?: unknown[] }).videos
      || (feed as unknown as { contents?: unknown[] }).contents
      || [];

    const videos: unknown[] = [];
    extractVideoItems(rawItems, videos);

    const result = videos
      .filter(item => {
        const v = item as Record<string, unknown>;
        return v.id && v.title;
      })
      .slice(0, 40)
      .map((item: unknown) => {
        const v = item as Record<string, unknown>;
        const author = v.author as Record<string, unknown> | undefined;
        const thumbs = (v.thumbnails as Array<{ url: string }>) || [];

        return {
          id: String(v.id),
          title: getText(v.title),
          thumbnail:
            (v.best_thumbnail as { url?: string })?.url ||
            thumbs[0]?.url ||
            `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`,
          viewCount: getText(v.short_view_count || v.view_count) || '0',
          publishedAt: getText(v.published) || '',
          duration: getText((v.duration as Record<string, unknown>)?.text !== undefined
            ? (v.duration as Record<string, unknown>)
            : v.duration) || '',
          channel: {
            id: author?.id ? String(author.id) : '',
            name: author?.name ? String(author.name) : '',
          },
        };
      });

    return NextResponse.json({ videos: result });
  } catch (err) {
    console.error('Trending error:', err);
    return NextResponse.json({ error: '트렌드 정보를 불러올 수 없습니다.' }, { status: 500 });
  }
}
