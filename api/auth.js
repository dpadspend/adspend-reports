export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  const authHeader = request.headers.get('authorization');
  const url = new URL(request.url);

  // Check for auth query param (from login form)
  const authParam = url.searchParams.get('auth');

  // Credentials from env vars
  const validUser = process.env.AUTH_USER || 'adspend';
  const validPass = process.env.AUTH_PASSWORD || 'reports2024';

  // Try auth header first, then query param
  let credentials = null;

  if (authHeader) {
    const [scheme, encoded] = authHeader.split(' ');
    if (scheme === 'Basic') {
      credentials = encoded;
    }
  } else if (authParam) {
    credentials = authParam;
  }

  if (credentials) {
    try {
      const decoded = atob(credentials);
      const [username, password] = decoded.split(':');

      if (username === validUser && password === validPass) {
        // Auth passed - fetch and return the report
        const htmlUrl = `${url.origin}/_report.html`;
        const response = await fetch(htmlUrl);
        const html = await response.text();

        return new Response(html, {
          status: 200,
          headers: {
            'Content-Type': 'text/html',
          },
        });
      }
    } catch (e) {
      // Invalid base64
    }
  }

  // Not authenticated - redirect to login page
  return new Response(null, {
    status: 302,
    headers: {
      'Location': '/login.html',
    },
  });
}
