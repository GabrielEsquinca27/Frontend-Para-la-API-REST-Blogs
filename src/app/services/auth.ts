"use server";

import { cookies } from "next/headers";

export async function login (email: string, password: string) {
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

  sessionStorage.setItem('token', data.token);
  cookies().set('token', data.token, {
    secure: true,
    httpOnly: true,
    path: '/',
  })

  return data;
};

export async function isLoggedIn() {
  // const token = sessionStorage.getItem('token');
  const token = await cookies().get('token');

  if (token !== undefined) {
    return true;
  }

  return false;
}
