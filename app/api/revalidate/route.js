import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

function handleRevalidate(request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');

  const expectedSecret = process.env.REVALIDATION_SECRET;

  if (!expectedSecret) {
    console.error('REVALIDATION_SECRET environment variable is not set.');
    return NextResponse.json(
      { message: 'Revalidation is not configured on this server.' },
      { status: 500 }
    );
  }

  if (secret !== expectedSecret) {
    return NextResponse.json(
      { message: 'Invalid secret token.' },
      { status: 401 }
    );
  }

  try {
    // Purge cache for the main listing and dynamic individual blog pages
    revalidatePath('/');
    revalidatePath('/blog');
    revalidatePath('/blog/[slug]', 'page');

    console.log('Successfully revalidated blog paths.');
    return NextResponse.json({
      revalidated: true,
      message: 'Cache purged successfully.',
      now: Date.now()
    });
  } catch (err) {
    console.error('Error during cache revalidation:', err);
    return NextResponse.json(
      { message: 'Error revalidating', error: err.message },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  return handleRevalidate(request);
}

export async function POST(request) {
  return handleRevalidate(request);
}
