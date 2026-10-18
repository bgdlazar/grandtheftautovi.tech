export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return new Response("Cod de autorizare lipsă.", { status: 400 });
  }

  const response = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "User-Agent": "Cloudflare-Pages-OAuth"
    },
    body: JSON.stringify({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code
    })
  });

  const data = await response.json();
  const token = data.access_token;

  const content = `
    <!doctype html>
    <html>
      <body>
        <script>
          (function() {
            function receiveMessage(e) {
              window.opener.postMessage(
                'authorization:github:success:{"token":"${token}","provider":"github"}',
                e.origin
              );
              window.removeEventListener("message", receiveMessage, false);
            }
            window.addEventListener("message", receiveMessage, false);
            window.opener.postMessage("authorizing:github", "*");
          })();
        </script>
      </body>
    </html>
  `;

  return new Response(content, {
    headers: { "Content-Type": "text/html;charset=UTF-8" }
  });
}
