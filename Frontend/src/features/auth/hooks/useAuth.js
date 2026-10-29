import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
  redirectToGoogleAuth,
} from "../services/auth.api";
import {
  setUser,
  setLoading,
  setError,
  logout,
} from "../state/auth.slice";

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading, isInitialized, error } = useSelector((state) => state.auth);

  const handleRegister = useCallback(
    async ({ name, email, password, phone }) => {
      try {
        dispatch(setLoading(true));
        const data = await registerUser({ name, email, password, phone });
        dispatch(setUser(data.user));
        toast.success("Account created successfully!");
        return data.user;
      } catch (err) {
        const message = err.message || "Registration failed";
        dispatch(setError(message));
        toast.error(message);
        return false;
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch]
  );

  const handleLogin = useCallback(
    async ({ email, password }) => {
      try {
        dispatch(setLoading(true));
        const data = await loginUser({ email, password });
        dispatch(setUser(data.user));
        toast.success("Welcome back!");
        return data.user;
      } catch (err) {
        const message = err.message || "Invalid email or password";
        dispatch(setError(message));
        toast.error(message);
        return false;
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch]
  );

  const handleLogout = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      await logoutUser();
      dispatch(logout());
      toast.success("Logged out successfully");
      return true;
    } catch {
      dispatch(logout());
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const checkAuth = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      const data = await getMe();
      dispatch(setUser(data.user));
      return data.user;
    } catch {
      dispatch(setUser(null));
      return null;
    }
  }, [dispatch]);

  const handleGoogleLogin = useCallback(() => {
    redirectToGoogleAuth();
  }, []);

  return {
    user,
    isAuthenticated,
    loading,
    isInitialized,
    error,
    handleRegister,
    handleLogin,
    handleLogout,
    checkAuth,
    handleGoogleLogin,
  };
};

export default useAuth;