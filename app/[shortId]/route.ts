import { NextResponse } from 'next/server';

export async function GET(request: Request, context: { params: Promise<{ shortId: string }> }) {
  const { shortId } = await context.params;
  const baseUrl = (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8081/api').replace('/api', '');
  
  return NextResponse.redirect(`${baseUrl}/r/${shortId}`);
}
