import api from "./instance";
import type {
  SignupRequest, SignupResponse,
  LoginRequest, LoginResponse,
  ReissueRequest, ReissueResponse,
  MemberResponse,
} from "../types/auth";

export const signup = async (data: SignupRequest): Promise<SignupResponse> => {
  const res = await api.post<SignupResponse>("/auth/signup", data);
  return res.data;
};

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const res = await api.post<LoginResponse>("/auth/login", data);
  return res.data;
};

export const reissueToken = async (data: ReissueRequest): Promise<ReissueResponse> => {
  const res = await api.post<ReissueResponse>("/auth/reissue", data);
  return res.data;
};

export const getMyInfo = async (): Promise<MemberResponse> => {
  const res = await api.get<MemberResponse>("/members/me");
  return res.data;
};
