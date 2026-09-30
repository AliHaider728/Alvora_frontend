import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

// Keeping the existing GET handler to avoid breaking any external webhooks that might be using it.
export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');
  const path = request.nextUrl.searchParams.get('path');
  const tag = request.nextUrl.searchParams.get('tag');

  if (secret !== process.env.ALVORA_REVALIDATION_SECRET) {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }

  if (!path && !tag) {
    return NextResponse.json({ message: 'Missing path or tag parameter' }, { status: 400 });
  }

  try {
    if (path) {
      revalidatePath(path);
    }
    if (tag) {
      revalidateTag(tag, 'max');
    }
    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (err) {
    return NextResponse.json({ message: 'Error revalidating' }, { status: 500 });
  }
}

// Our new dedicated secure POST endpoint strictly for sitemap invalidation as requested.
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { secret } = body;

    if (!process.env.SITEMAP_REVALIDATION_SECRET) {
      console.warn('[revalidate] SITEMAP_REVALIDATION_SECRET is not configured on the server.');
      return NextResponse.json({ message: 'Server misconfigured' }, { status: 500 });
    }

    if (secret !== process.env.SITEMAP_REVALIDATION_SECRET) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    // Only invalidate the sitemap path securely. No generic/arbitrary paths allowed.
    revalidatePath('/sitemap.xml');

    return NextResponse.json({ 
      revalidated: true, 
      path: '/sitemap.xml',
      message: 'Sitemap cache invalidated successfully.',
      now: Date.now() 
    });
  } catch (err) {
    console.error('[revalidate] Error processing revalidation request:', err);
    return NextResponse.json({ message: 'Error revalidating sitemap' }, { status: 500 });
  }
}
