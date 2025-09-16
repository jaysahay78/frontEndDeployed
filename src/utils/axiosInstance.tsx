'use client';

import { getToken } from "@/app/(auth)";
import axios, {  AxiosError, InternalAxiosRequestConfig } from 'axios'

// Axios Interceptor Instance
export const myAxios = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
});

export const privateAxios=axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
})

privateAxios.interceptors.request.use(
    (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
      const token: string | null = getToken()
      console.log(token)
  
      if (token && config.headers) {
        config.headers['Authorization'] = `Bearer ${token}`
      }
  
      return config
    },
    (error: AxiosError) => Promise.reject(error)
  )