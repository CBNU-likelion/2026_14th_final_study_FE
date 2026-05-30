import axiosInstance from './axiosInstance'

// ── Request types ──────────────────────────────────────────────────────────

export interface LoginRequest {
  email: string
  password: string
}

export interface SignupRequest {
  email: string
  password: string
  name: string
}

// ── 공통 래퍼 타입 ─────────────────────────────────────────────────────────
// 백엔드가 { code, message, result } 형태로 모든 응답을 감쌈

export interface ApiResponse<T> {
  code: number
  message: string
  result: T
}

// ── Response types ─────────────────────────────────────────────────────────

export interface AuthResult {
  accessToken: string
  tokenType: string
}

export interface UserInfo {
  email: string
  name: string
}

// ── API functions ──────────────────────────────────────────────────────────

/** POST /api/users/login */
export const loginApi = (data: LoginRequest) =>
  axiosInstance.post<ApiResponse<AuthResult>>('/users/login', data)

/** POST /api/users/signup */
export const signupApi = (data: SignupRequest) =>
  axiosInstance.post<ApiResponse<void>>('/users/signup', data)

/** GET /api/users/me  — Authorization 헤더는 인터셉터가 자동 첨부 */
export const getMyInfoApi = () =>
  axiosInstance.get<ApiResponse<UserInfo>>('/users/me')
