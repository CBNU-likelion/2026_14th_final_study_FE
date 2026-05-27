import client from "./client";

export const signup = async (data: {
  name: string;
  phoneNumber: string;
  email: string;
  password: string;
}) => {
  const response = await client.post("/signup", data);

  return response.data;
};

export const login = async (data: {
  email: string;
  password: string;
}) => {
  const response = await client.post("/login", data);

  return response.data;
};