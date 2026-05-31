import axiosInstance from './axiosInstance'

export interface LoginRequest {
  email: string
  password: string
}

export interface SignupRequest {
  email: string
  password: string
  name: string
}

export interface ApiResponse<T> {
  code: number
  message: string
  result: T
}


export interface AuthResult {
  accessToken: string
  tokenType: string
}

export interface UserInfo {
  email: string
  name: string
}

export const loginApi = (data: LoginRequest) =>
  axiosInstance.post<ApiResponse<AuthResult>>('/users/login', data)

export const signupApi = (data: SignupRequest) =>
  axiosInstance.post<ApiResponse<void>>('/users/signup', data)

export const getMyInfoApi = () =>
  axiosInstance.get<ApiResponse<UserInfo>>('/users/me')
