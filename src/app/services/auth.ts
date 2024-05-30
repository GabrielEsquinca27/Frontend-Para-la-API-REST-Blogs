'use client';

export async function loginService (email: string, password: string) {
  const API_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const API_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const response = await fetch(`${API_URL}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: {
      'apikey': `${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error('Error de inicio de sesion.');
  }

  const data = await response.json();
  console.log(data);

  return data;
};