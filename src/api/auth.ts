import client from "./client";

export type SignupRequest = {
  email: string;
  password: string;
  passwordConfirm: string;
  name: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export const signup = async (data: SignupRequest) => {
  const response = await client.post("/auth/signup", data);
  return response.data;
};

export const login = async (data: LoginRequest) => {
  const response = await client.post("/auth/login", data);
  return response.data;
};

export const refreshAccessToken = async () => {
  const response = await client.post("/auth/refresh");
  return response.data;
};

export const logout = async () => {
  const response = await client.post("/auth/logout");
  return response.data;
};

export const getMyInfo = async () => {
  const response = await client.get("/users/me");
  return response.data;
};