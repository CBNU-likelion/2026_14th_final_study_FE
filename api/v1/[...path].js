const API_ORIGIN = "http://54.180.114.77:8080";

const excludedRequestHeaders = new Set([
  "connection",
  "content-length",
  "host",
  "origin",
  "transfer-encoding",
]);

const excludedResponseHeaders = new Set([
  "connection",
  "content-encoding",
  "content-length",
  "transfer-encoding",
]);

async function readBody(request) {
  const chunks = [];

  for await (const chunk of request) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  return Buffer.concat(chunks);
}

export default async function handler(request, response) {
  try {
    const path = Array.isArray(request.query.path)
      ? request.query.path.join("/")
      : request.query.path;
    const search = new URL(request.url, "http://localhost").search;
    const targetUrl = `${API_ORIGIN}/api/v1/${path ?? ""}${search}`;

    const headers = {};

    for (const [key, value] of Object.entries(request.headers)) {
      if (!excludedRequestHeaders.has(key.toLowerCase()) && value !== undefined) {
        headers[key] = Array.isArray(value) ? value.join(",") : value;
      }
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000);
    const hasBody = !["GET", "HEAD"].includes(request.method ?? "GET");

    const backendResponse = await fetch(targetUrl, {
      method: request.method,
      headers,
      body: hasBody ? await readBody(request) : undefined,
      signal: controller.signal,
    });

    clearTimeout(timeout);
    response.statusCode = backendResponse.status;

    backendResponse.headers.forEach((value, key) => {
      if (!excludedResponseHeaders.has(key.toLowerCase())) {
        response.setHeader(key, value);
      }
    });

    response.send(Buffer.from(await backendResponse.arrayBuffer()));
  } catch (error) {
    response.statusCode = 502;
    response.setHeader("content-type", "application/json; charset=utf-8");
    response.end(
      JSON.stringify({
        message: "Failed to connect to API server.",
        code: error?.name === "AbortError" ? "ETIMEDOUT" : error?.code,
        detail: error?.message,
      })
    );
  }
}
