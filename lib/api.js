export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://synthetic-studio-backend.omrender.com';

export async function registerUser(username, password) {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Registration failed');
  }

  return await response.json();
}