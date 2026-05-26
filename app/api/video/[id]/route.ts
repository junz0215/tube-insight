import { NextResponse } from 'next/server';
import { Innertube } from 'youtubei.js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: '비디오 ID가 필요합니다.' }, { status: 400 });
  }

  try {
    const yt = await Innertube.create({ generate_session_locally: true });
    const info = await yt.getInfo(id);

    const basic = info.basic_info as Record<string, unknown>;
    const channel = basic.channel as Record<string, unknown> | undefined;
    const channelId = basic.channel_id ? String(basic.channel_id) : String(channel?.id || '');
    const channelName = String(channel?.name || basic.author || '');
    const thumbs = (basic.thumbnail as Array<{ url: string }>) || [];

    const videoData = {
      id: String(basic.id || id),
      title: String(basic.title || ''),
      description: String(basic.short_description || basic.description || ''),
      thumbnail: thumbs[0]?.url || `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`,
      viewCount: basic.view_count || 0,
      likeCount: basic.like_count || 0,
      publishedAt: String(basic.publish_date || ''),
      duration: basic.duration ? String(basic.duration) : '0',
      tags: Array.isArray(basic.keywords) ? (basic.keywords as string[]).slice(0, 20) : [],
      category: String(basic.category || ''),
      channel: {
        id: channelId,
        name: channelName,
        thumbnail: '',
        subscriberCount: '',
        isVerified: Boolean(basic.is_verified),
      },
    };

    return NextResponse.json(videoData);
  } catch (err) {
    console.error('Video info error:', err);
    return NextResponse.json({ error: '비디오 정보를 불러올 수 없습니다.' }, { status: 500 });
  }
}
