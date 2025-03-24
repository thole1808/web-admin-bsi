'use client';

import { useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function useAutoLogout() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      // Optional: bisa langsung signOut atau redirect ke login
      signOut({ redirect: false });
      router.push('/auth/login');
    }
  }, [status, router]);
}