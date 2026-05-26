import { NextResponse } from 'next/server';
import { YoutubeTranscript } from 'youtube-transcript';
import { extractVideoId } from '@/lib/utils';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const input = searchParams.get('id') || searchParams.get('url') || '';
  const lang = searchParams.get('lang') || undefined;

  if (!input) {
    return NextResponse.json({ error: '비디오 ID 또는 URL이 필요합니다.' }, { status: 400 });
  }

  const videoId = extractVideoId(input) || input;

  try {
    const transcript = await YoutubeTranscript.fetchTranscript(videoId, lang ? { lang } : undefined);
    return NextResponse.json({ transcript, videoId });
  } catch {
    try {
      const transcript = await YoutubeTranscript.fetchTranscript(videoId);
      return NextResponse.json({ transcript, videoId });
    } catch (err) {
      console.error('Transcript error:', err);
      return NextResponse.json(
        { error: '자막을 불러올 수 없습니다. 자막이 없거나 비공개 영상일 수 있습니다.' },
        { status: 404 }
      );
    }
  }
}
