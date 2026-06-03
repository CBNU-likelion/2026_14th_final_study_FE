const API_ORIGIN = "http://54.180.114.77:8080";

const hopByHopHeaders = new Set([
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
  "host",
  "content-length",
  "content-encoding",
]);

export default async function handler(request, response) {
  const path = Array.isArray(request.query.path)
    ? request.query.path.join("/")
    : request.query.path;
  const search = new URL(request.url, "http://localhost").search;
  const targetUrl = `${API_ORIGIN}/api/v1/${path ?? ""}${search}`;

  try {
    const headers = new Headers();

    for (const [key, value] of Object.entries(request.headers)) {
      if (!hopByHopHeaders.has(key.toLowerCase()) && key.toLowerCase() !== "origin") {
        headers.set(key, Array.isArray(value) ? value.join(",") : value);
      }
    }

    const backendResponse = await fetch(targetUrl, {
      method: request.method,
      headers,
      body: ["GET", "HEAD"].includes(request.method) ? undefined : request,
      duplex: "half",
    });

    response.status(backendResponse.status);

    backendResponse.headers.forEach((value, key) => {
      if (!hopByHopHeaders.has(key.toLowerCase())) {
        response.setHeader(key, value);
      }
    });

    const body = Buffer.from(await backendResponse.arrayBuffer());
    response.send(body);
  } catch (error) {
    console.error("API proxy failed", error);
    response.status(502).json({
      message: "Failed to connect to API server.",
    });
  }
}
