export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  // Clear auth cookie and redirect to login
  return new Response(
    `<!DOCTYPE html>
    <html>
    <head>
      <title>Logging Out...</title>
      <style>
        body { font-family: system-ui; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: #111; color: white; }
        .container { text-align: center; }
        h1 { color: #dc0f0f; margin-bottom: 16px; }
        .spinner { width: 40px; height: 40px; border: 3px solid rgba(220,15,15,0.3); border-top-color: #dc0f0f; border-radius: 50%; animation: spin 1s linear infinite; margin: 20px auto; }
        @keyframes spin { to { transform: rotate(360deg); } }
      </style>
      <script>
        sessionStorage.clear();
        setTimeout(function() {
          window.location.href = '/login.html';
        }, 800);
      </script>
    </head>
    <body>
      <div class="container">
        <h1>Logging Out</h1>
        <div class="spinner"></div>
        <p>Redirecting to login...</p>
      </div>
    </body>
    </html>`,
    {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
        'Set-Cookie': 'reportAuth=; Path=/; Max-Age=0; HttpOnly; SameSite=Strict',
      },
    }
  );
}
