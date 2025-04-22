'use client';

import { useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function useAutoLogout() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session?.expiresAt) return;

    const now = Date.now();
    const expireAt = session.expiresAt;

    // console.log('Backend expiresAt:', new Date(expireAt).toISOString());
    // console.log('Current time:', new Date(now).toISOString());

    if (now >= new Date(expireAt).getTime()) {
      console.log('Session expired from backend, logging out...');
      localStorage.clear();
      signOut({ callbackUrl: '/login' });
    } else {
      const timeout = setTimeout(() => {
        console.log('Session auto-expired, logging out...');
        localStorage.clear();
        signOut({ callbackUrl: '/login' });
      }, new Date(expireAt).getTime() - now);

      return () => clearTimeout(timeout); // cleanup
    }
  }, [session]);
}