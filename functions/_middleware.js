export async function onRequest(context) {
  const url = new URL(context.request.url);

  // Dacă vizitatorul este pe subdomeniul de blog și accesează rădăcina "/"
  if (url.hostname === "blog.grandtheftautovi.tech" && url.pathname === "/") {
    url.pathname = "/blog.html";
    return context.env.ASSETS.fetch(url);
  }

  return context.next();
}
