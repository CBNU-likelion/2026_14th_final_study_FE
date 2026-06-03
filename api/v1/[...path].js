import http from "node:http";
import https from "node:https";

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

export default function handler(request, response) {
  const path = Array.isArray(request.query.path)
    ? request.query.path.join("/")
    : request.query.path;
  const search = new URL(request.url, "http://localhost").search;
  const targetUrl = new URL(`${API_ORIGIN}/api/v1/${path ?? ""}${search}`);

  const headers = {};

  for (const [key, value] of Object.entries(request.headers)) {
    if (!hopByHopHeaders.has(key.toLowerCase()) && key.toLowerCase() !== "origin") {
      headers[key] = value;
    }
  }

  const client = targetUrl.protocol === "https:" ? https : http;

  const proxyRequest = client.request(
    {
      protocol: targetUrl.protocol,
      hostname: targetUrl.hostname,
      port: targetUrl.port,
      path: `${targetUrl.pathname}${targetUrl.search}`,
      method: request.method,
      headers,
      timeout: 25000,
    },
    (proxyResponse) => {
      response.statusCode = proxyResponse.statusCode ?? 502;

      for (const [key, value] of Object.entries(proxyResponse.headers)) {
        if (!hopByHopHeaders.has(key.toLowerCase()) && value !== undefined) {
          response.setHeader(key, value);
        }
      }

      proxyResponse.pipe(response);
    }
  );

  proxyRequest.on("timeout", () => {
    proxyRequest.destroy(new Error("API proxy timed out"));
  });

  proxyRequest.on("error", (error) => {
    console.error("API proxy failed", {
      message: error.message,
      code: error.code,
      target: targetUrl.href,
    });

    if (!response.headersSent) {
      response.status(502).json({
        message: "Failed to connect to API server.",
        code: error.code,
      });
      return;
    }

    response.end();
  });

  if (["GET", "HEAD"].includes(request.method)) {
    proxyRequest.end();
    return;
  }

  request.pipe(proxyRequest);
}
