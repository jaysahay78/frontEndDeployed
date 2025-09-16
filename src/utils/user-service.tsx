'use client';

import { myAxios, privateAxios } from "@/utils/axiosInstance";

export interface UserRegisterPayload {
    name: string;
    email: string;
    password: string;
    about: string;
  }

// Define the structure for user details
export interface User {
    id: string;
    name: string;
    email: string;
    about: string;
    roles: Role[];
}

export interface Role{
    id: string,
    name: string,
}

// Define the expected response after login
interface LoginResponse {
    jwtToken: string;
    user: User;
}

// Define the login details structure
interface LoginDetail {
    email: string;
    password: string;
}

export interface UserUpdateProfilePayload {
    id: String;
    name: string;
    email: string;
    about: string;
  }
  

export interface PasswordUpdatePayload {
  oldPassword: string;
  newPassword: string;
}

// utils/user-service.ts

export async function fetchUserById(id: number) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users/${id}`, {
    method: "GET",
    credentials: "include", // Include cookies if you use them for auth
    headers: {
      "Content-Type": "application/json",
    },
  })

  if (!res.ok) throw new Error("Failed to fetch updated user")
  return await res.json()
}


export const updateUserPassword = (userId: number, payload: PasswordUpdatePayload) => {
  return privateAxios
    .put(`/users/${userId}/password`, payload)
    .then((response) => response.data);
};

  export const updateUserProfile = (user: UserUpdateProfilePayload) => {
    return privateAxios
      .put(`/users/${user.id}`, user)
      .then((response) => response.data);
  };
  


export const signUp = async (user: UserRegisterPayload): Promise<User> => {
    const response = await myAxios.post<User>("/auth/register", user);
    return response.data;
  };

export const login = (loginDetail: LoginDetail): Promise<LoginResponse> => {
    return myAxios.post<LoginResponse>('/auth/login', loginDetail)
        .then(response => response.data);
}

  