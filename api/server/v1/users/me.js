import { proxyRequest } from "../../../../vercel-api-proxy.js";

export default function handler(request, response) {
  return proxyRequest(request, response, "/api/v1/users/me");
}
