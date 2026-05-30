import axios from "axios";
import type {
    SignupRequest, SignupResponse,
    LoginRequest, LoginResponse,
    ReissueRequest, ReissueResponse,
    MemberResponse
} from "../types/auth";
import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
  clearTokens
} from "../utils/token";

// axios 인스턴스 생성 (base URL 설정)
const api = axios.create({
  baseURL: "/api", // vite.config.ts에서 프록시로 실제 서버로 연결
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터: 모든 요청에 accessToken 자동으로 헤더에 추가
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  // 토큰이 있으면 Authorization 헤더에 Bearer 형식으로 추가
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 응답 인터셉터: 에러 응답 처리
api.interceptors.response.use(
  // 정상 응답은 그대로 반환
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // 401 에러이고 재시도한 적 없는 요청이면 토큰 재발급 시도
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // 무한 재시도 방지 플래그

      const refreshToken = getRefreshToken();

      // refreshToken이 없으면 로그인 페이지로 이동
      if (!refreshToken) {
        clearTokens();
        window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
        // refreshToken으로 새 토큰 재발급 요청
        const res = await reissueToken({ refreshToken });

        // 새로 받은 토큰 저장
        setAccessToken(res.accessToken);
        setRefreshToken(res.refreshToken);

        // 실패했던 요청 새 토큰으로 재시도
        originalRequest.headers.Authorization = `Bearer ${res.accessToken}`;
        return api(originalRequest);

      } catch {
        // 재발급도 실패하면 토큰 삭제 후 로그인 페이지로 이동
        clearTokens();
        window.location.href = "/login";
        return Promise.reject(error);
      }
    }

    // 403 에러면 권한없음 알림 표시
    if (error.response?.status === 403) {
      alert("접근 권한이 없습니다.");
    }

    return Promise.reject(error);
  }
);

// 회원가입 API 호출
export const signup = async (data: SignupRequest): Promise<SignupResponse> => {
  const res = await api.post<SignupResponse>("/auth/signup", data);
  return res.data;
};

// 로그인 API 호출
export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const res = await api.post<LoginResponse>("/auth/login", data);
  return res.data;
};

// 토큰 재발급 API 호출
export const reissueToken = async (data: ReissueRequest): Promise<ReissueResponse> => {
  const res = await api.post<ReissueResponse>("/auth/reissue", data);
  return res.data;
};

// 내 정보 조회 API 호출
export const getMyInfo = async (): Promise<MemberResponse> => {
  const res = await api.get<MemberResponse>("/members/me");
  return res.data;
};

export default api;