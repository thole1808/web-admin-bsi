'use client';

import { signOut } from 'next-auth/react';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

export async function apiFetch<T = any>(
  endpoint: string,
  options: RequestInit = {},
  customBaseUrl: string = BASE_URL
): Promise<T> {
  const url = `${customBaseUrl}${endpoint}`;

  try {
    const res = await fetch(url, {
      credentials: 'include',
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });

    if (res.status === 401) {
      await signOut({ callbackUrl: '/login' });
      return Promise.reject({ message: 'Unauthorized, redirecting to login' });
    }

    if (!res.ok) {
      const errorBody = await res.json().catch(() => ({}));
      throw new Error(errorBody.message || `HTTP error ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error('API Fetch Error:', error);
    throw error;
  }
}