'use client';

import { apiFetch, LoginResponse } from './api';

const TOKEN_KEY = 'taw10_access_token';
const COOKIE_NAME = 'taw10_access_token';

export function getAdminToken() {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.localStorage.getItem(TOKEN_KEY);
}

export async function loginAdmin(email: string, password: string) {
  const response = await apiFetch<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  window.localStorage.setItem(TOKEN_KEY, response.accessToken);
  document.cookie = `${COOKIE_NAME}=1; path=/; max-age=3600; SameSite=Lax`;

  return response;
}

export async function logoutAdmin() {
  const token = getAdminToken();

  if (token) {
    await apiFetch('/auth/logout', {
      method: 'POST',
      token,
    }).catch(() => undefined);
  }

  window.localStorage.removeItem(TOKEN_KEY);
  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
}
