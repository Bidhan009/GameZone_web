import { NextResponse } from 'next/server';
import { clearAuthCookies } from '@/lib/cookie';

export async function POST() {
  try {
    await clearAuthCookies();
    return NextResponse.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Logout failed' }, { status: 500 });
  }
}
