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

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: '플레이리스트 ID가 필요합니다.' }, { status: 400 });
  }

  try {
    const yt = await Innertube.create({ generate_session_locally: true });
    const playlist = await yt.getPlaylist(id);

    const raw = playlist as unknown as Record<string, unknown>;
    const info = (raw.info || raw.metadata) as Record<string, unknown> | undefined;
    const items = (raw.items || raw.videos || []) as unknown[];
    const thumbs = (info?.thumbnails as Array<{ url: string }>) || [];

    const videos = items.slice(0, 100).map((item: unknown, index: number) => {
      const v = item as Record<string, unknown>;
      const vThumbs = (v.thumbnails as Array<{ url: string }>) || [];
      const author = v.author as Record<string, unknown> | undefined;

      return {
        id: String(v.id || ''),
        title: getText(v.title),
        thumbnail: vThumbs[0]?.url || `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`,
        duration: getText((v.duration as Record<string, unknown>)?.text !== undefined
          ? (v.duration as Record<string, unknown>)
          : v.duration) || '',
        channel: author?.name ? String(author.name) : '',
        index: index + 1,
      };
    });

    const playlistData = {
      id,
      title: getText(info?.title),
      description: getText(info?.description),
      thumbnail: thumbs[0]?.url || (videos[0]?.thumbnail ?? ''),
      videoCount: videos.length,
      author: getText(info?.author || (raw.author as unknown)),
      videos,
    };

    return NextResponse.json(playlistData);
  } catch (err) {
    console.error('Playlist error:', err);
    return NextResponse.json({ error: '플레이리스트 정보를 불러올 수 없습니다.' }, { status: 500 });
  }
}
