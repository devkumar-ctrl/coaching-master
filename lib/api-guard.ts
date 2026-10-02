import { NextResponse } from 'next/server';
import { auth } from '@/auth';

/**
 * Guard for diagnostic/debug endpoints.
 *
 * These routes expose deployment internals (DB schema, configured integrations,
 * SMTP relay) so they must never be reachable anonymously in production.
 */
export async function requireAdmin() {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  return null;
}