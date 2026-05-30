// 회원가입 요청 타입
export interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

// 회원가입 응답 타입
export interface SignupResponse {
  id: number;
  name: string;
  email: string;
}

// 로그인 요청 타입
export interface LoginRequest {
  email: string;
  password: string;
}

// 로그인 응답 타입 (토큰 두 개 받음)
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

// 토큰 재발급 요청 타입
export interface ReissueRequest {
  refreshToken: string;
}

// 토큰 재발급 응답 타입
export interface ReissueResponse {
  accessToken: string;
  refreshToken: string;
}

// 내 정보 조회 응답 타입
export interface MemberResponse {
  id: number;
  name: string;
  email: string;
}