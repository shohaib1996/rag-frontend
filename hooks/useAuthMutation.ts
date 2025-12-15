import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

// Login Mutation
export function useLogin() {
  const { login } = useAuth();

  return useMutation({
    mutationFn: async (data: any) => {
      // Backend now expects JSON { email, password }
      const response = await api.post("/auth/login", data);
      return response.data;
    },
    onSuccess: (data) => {
      console.log("Login success data:", data);
      // data should contain { access_token, user: { id, name, email ... } }
      login(data.access_token, data.user);
      toast.success("Logged in successfully!");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.detail ||
        "Login failed. Please check your credentials.";
      toast.error(message);
    },
  });
}

// Signup Mutation
export function useSignup() {
  const { login } = useAuth();

  return useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post("/auth/signup", data);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Account created successfully!");
      // If the backend returns a token on signup, we can log them in directly.
      // The current backend returns user_id, email, name but NO token.
      // So we should redirect them to login or ask them to login.
      // For better UX, we might want to automatically login, but we need the password again to get the token
      // OR the backend should return a token.

      // Based on `api/auth.py`, signup returns { message, user_id, email, name }.
      // So we cannot auto-login without modifying the backend.
      // We will just redirect to login in the component.
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.detail || "Signup failed. Please try again.";
      toast.error(message);
    },
  });
}
