'use client';

import { useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function useAutoLogout() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status !== "authenticated") return;
    if (!('expiresAt' in session?.user)) return;

    const now = Date.now();
    const expireAt = new Date((session.user as { expiresAt: string }).expiresAt).getTime();

    if (now >= expireAt) {
      console.log('Session already expired, signing out...');
      signOut({ callbackUrl: '/login' });
    } else {
      const timeout = setTimeout(() => {
        console.log('Session auto-expired, signing out...');
        signOut({ callbackUrl: '/login' });
      }, expireAt - now);

      return () => clearTimeout(timeout);
    }
  }, [session, status]);
}