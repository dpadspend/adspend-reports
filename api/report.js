export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  const url = new URL(request.url);

  // Check for auth cookie
  const cookies = request.headers.get('cookie') || '';
  const authCookie = cookies.split(';').find(c => c.trim().startsWith('reportAuth='));

  if (!authCookie) {
    return new Response(null, {
      status: 302,
      headers: { 'Location': '/login.html' },
    });
  }

  const credentials = authCookie.split('=')[1];

  try {
    // Validate credentials
    const validUser = process.env.AUTH_USER || 'adspend';
    const validPass = process.env.AUTH_PASSWORD || 'reports2024';

    const decoded = atob(credentials);
    const [username, password] = decoded.split(':');

    if (username === validUser && password === validPass) {
      // Fetch and return the report
      const htmlUrl = `${url.origin}/_report.html`;
      const response = await fetch(htmlUrl);
      const html = await response.text();

      return new Response(html, {
        status: 200,
        headers: { 'Content-Type': 'text/html' },
      });
    }
  } catch (e) {
    // Invalid credentials
  }

  // Clear invalid cookie and redirect to login
  return new Response(null, {
    status: 302,
    headers: {
      'Location': '/login.html',
      'Set-Cookie': 'reportAuth=; Path=/; Max-Age=0',
    },
  });
}
