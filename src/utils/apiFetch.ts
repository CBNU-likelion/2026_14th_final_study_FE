export async function apiFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const token = localStorage.getItem("accessToken");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, { ...options, headers });

  if (response.status === 401) {
    localStorage.removeItem("accessToken");
    window.location.href = "/forbidden";
  } else if (response.status === 403) {
    alert("접근 권한이 없습니다. 다시 로그인해주세요.");
    window.location.href = "/login";
  }

  return response;
}
