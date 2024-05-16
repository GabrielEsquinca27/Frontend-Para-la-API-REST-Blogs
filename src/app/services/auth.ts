'use client';

export async function loginSevice (email: string, password: string) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const response = await fetch(`${API_URL}/sanctum/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ email, password, device_name: 'web' }),
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  const data = await response.json();
  console.log(data);

  return data;
};
