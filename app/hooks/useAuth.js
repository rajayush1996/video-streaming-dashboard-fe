// hooks/useAuth.js
'use client'
import { useMutation } from '@tanstack/react-query';
import { login, logout, signUp } from '@apis/auth/authApi';

export const useLogin = () => {
  return useMutation({
    mutationFn: (credentials) => login(credentials),
  });
};

export const useLogout = () => {
  return useMutation({
    mutationFn: () => logout(),
  });
};


export const useSignUp = () => {
  return useMutation({
    mutationFn: (userData) => signUp(userData),
  });
};