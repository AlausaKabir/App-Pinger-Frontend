import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setUser, setToken } from "@/lib/redux/reducers/user";
import { loginUser } from "@/requests/auth";
import { toast } from "react-toastify";

interface LoginForm {
  email: string;
  password: string;
}

interface LoginState {
  isLoading: boolean;
  isAuthenticated: boolean;
  showLoading: boolean;
  error: string | null;
}

export const useLoginFlow = () => {
  const [state, setState] = useState<LoginState>({
    isLoading: false,
    isAuthenticated: false,
    showLoading: false,
    error: null,
  });

  const router = useRouter();
  const dispatch = useDispatch();

  const login = useCallback(
    async (formData: LoginForm) => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        // Step 1: Authenticate user
        const response = await loginUser(formData);

        if (response.statusCode === 200) {
          const { token, access_token, user } = response.data;
          const authToken = token || access_token;

          // Step 2: Store authentication data
          dispatch(setToken(authToken || null));
          dispatch(setUser(user || null));

          // Step 3: Show loading screen
          setState((prev) => ({
            ...prev,
            isLoading: false,
            isAuthenticated: true,
            showLoading: true,
          }));

          toast.success("Login successful! Preparing your dashboard...");

          return true;
        }
      } catch (error: any) {
        console.error("Login error:", error);
        const errorMessage = error.response?.data?.message || "Login failed. Please try again.";

        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
        }));

        toast.error(errorMessage);
        return false;
      }
    },
    [dispatch]
  );

  const completeLogin = useCallback(() => {
    setState((prev) => ({ ...prev, showLoading: false }));

    // Add a small delay for smooth transition
    setTimeout(() => {
      router.push("/dashboard");
    }, 300);
  }, [router]);

  const reset = useCallback(() => {
    setState({
      isLoading: false,
      isAuthenticated: false,
      showLoading: false,
      error: null,
    });
  }, []);

  return {
    ...state,
    login,
    completeLogin,
    reset,
  };
};
