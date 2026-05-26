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
    if (o.simpleText) return String(o.simpleText);
  }
  return String(obj);
}

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: '채널 ID가 필요합니다.' }, { status: 400 });
  }

  try {
    const yt = await Innertube.create({ generate_session_locally: true });

    const channelHandle = id.startsWith('UC') ? id : `@${id.replace(/^@/, '')}`;
    const channel = await yt.getChannel(channelHandle);

    const meta = (channel as unknown as { metadata: Record<string, unknown> }).metadata;
    const thumbs = (meta?.thumbnail as Array<{ url: string }>) ||
      (meta?.avatar as Array<{ url: string }>) || [];
    const bannerThumbs = (meta?.banner as Array<{ url: string }>) || [];

    const channelData = {
      id: getText(meta?.external_id || meta?.channel_id) || id,
      handle: getText(meta?.vanity_url || meta?.channel_url) || '',
      name: getText(meta?.title) || '',
      description: getText(meta?.description) || '',
      thumbnail: thumbs[thumbs.length - 1]?.url || thumbs[0]?.url || '',
      banner: bannerThumbs[bannerThumbs.length - 1]?.url || '',
      subscriberCount: getText(meta?.subscriber_count) || '0',
      videoCount: getText((meta as Record<string, unknown>)?.video_count) || '0',
      viewCount: getText((meta as Record<string, unknown>)?.view_count) || '0',
      joinedDate: getText((meta as Record<string, unknown>)?.joined_date) || '',
      isVerified: Boolean(meta?.is_verified),
      keywords: Array.isArray(meta?.keywords) ? (meta.keywords as string[]) : [],
    };

    return NextResponse.json(channelData);
  } catch (err) {
    console.error('Channel error:', err);
    return NextResponse.json({ error: '채널 정보를 불러올 수 없습니다.' }, { status: 500 });
  }
}
