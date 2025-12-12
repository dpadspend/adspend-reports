export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const body = await request.json();
    const { credentials } = body;

    if (!credentials) {
      return new Response('Missing credentials', { status: 400 });
    }

    // Decode and validate
    const validUser = process.env.AUTH_USER || 'adspend';
    const validPass = process.env.AUTH_PASSWORD || 'reports2024';

    const decoded = atob(credentials);
    const [username, password] = decoded.split(':');

    if (username === validUser && password === validPass) {
      // Set a cookie for session
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': `reportAuth=${credentials}; Path=/; HttpOnly; SameSite=Strict; Max-Age=86400`,
        },
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Invalid request' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
