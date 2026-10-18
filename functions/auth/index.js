export async function onRequestGet(context) {
  const { env } = context;
  const client_id = env.GITHUB_CLIENT_ID;
  const url = `https://github.com/login/oauth/authorize?client_id=${client_id}&scope=repo`;
  return Response.redirect(url, 302);
}
