import { NextResponse } from 'next/server';
import { sendTikTokEventToServer } from '../../../lib/tiktokEventsApi';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { event_name, event_id, event_data } = body;

    if (!event_name || !event_id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Capture IP and User-Agent from headers
    const reqIp = req.headers.get('x-forwarded-for') || '';
    const reqUserAgent = req.headers.get('user-agent') || '';

    // Await the fetch so Vercel/NextJS doesn't kill the background process early
    await sendTikTokEventToServer(event_name, event_id, event_data, reqIp, reqUserAgent);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[TikTok Events Route] Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
