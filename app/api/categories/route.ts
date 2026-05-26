import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const YOUTUBE_CATEGORIES = [
  { id: '1', title: '영화 & 애니메이션' },
  { id: '2', title: '자동차 & 교통' },
  { id: '10', title: '음악' },
  { id: '15', title: '반려동물 & 야생동물' },
  { id: '17', title: '스포츠' },
  { id: '19', title: '여행 & 이벤트' },
  { id: '20', title: '게임' },
  { id: '22', title: '사람 & 블로그' },
  { id: '23', title: '코미디' },
  { id: '24', title: '엔터테인먼트' },
  { id: '25', title: '뉴스 & 정치' },
  { id: '26', title: '노하우 & 스타일' },
  { id: '27', title: '교육' },
  { id: '28', title: '과학 & 기술' },
  { id: '29', title: '비영리 & 사회운동' },
];

export async function GET() {
  return NextResponse.json({ categories: YOUTUBE_CATEGORIES });
}
