import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { API_URL } from "@/lib/axios";
import { adminLoginApi, adminLogoutApi } from "../services/auth.api";

export function useAdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const isMountedRef = useRef(true);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setUser, isAuthenticated, user } = useAuth();

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam === "unauthorized") {
      const msg = "Access Denied. You are not authorized as an admin.";
      setError(msg);
      toast.error(msg);
    } else if (errorParam === "google_failed") {
      const msg = "Google authentication failed. Please try again.";
      setError(msg);
      toast.error(msg);
    }
  }, [searchParams]);

  useEffect(() => {
    if (isAuthenticated && user?.role === "admin") {
      navigate("/admin", { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const handleLogin = useCallback(
    async (e) => {
      e.preventDefault();
      if (loading || googleLoading) return;

      const trimmedEmail = email.trim();
      if (!trimmedEmail || !password) {
        setError("Please enter both email and password.");
        return;
      }

      setError("");
      setLoading(true);

      try {
        const data = await adminLoginApi({
          email: trimmedEmail,
          password,
        });

        if (!isMountedRef.current) return;

        if (data?.success) {
          if (data.user?.role !== "admin") {
            try {
              await adminLogoutApi();
            } catch {}
            const msg = "Access Denied. You do not have admin privileges.";
            setError(msg);
            toast.error(msg);
            return;
          }

          setUser(data.user);
          toast.success("Welcome back, Admin!");
          navigate("/admin");
        }
      } catch (err) {
        if (!isMountedRef.current) return;
        const msg = err?.response?.data?.message || "Invalid email or password";
        setError(msg);
        toast.error(msg);
      } finally {
        if (isMountedRef.current) {
          setLoading(false);
        }
      }
    },
    [email, password, loading, googleLoading, setUser, navigate]
  );

  const handleGoogleLogin = useCallback(() => {
    if (loading || googleLoading) return;
    setGoogleLoading(true);
    window.location.href = `${API_URL}/auth/google?state=admin`;
  }, [loading, googleLoading]);

  return {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    togglePasswordVisibility,
    error,
    loading,
    googleLoading,
    handleLogin,
    handleGoogleLogin,
  };
}
