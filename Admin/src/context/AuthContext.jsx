import { createContext, useContext, useState, useEffect } from "react";
import authApiInstance from "@/lib/axios";
import { toast } from "sonner";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const response = await authApiInstance.get("/auth/get-me");
        if (response.data.success) {
          const userData = response.data.user;
          setUser(userData);

          const params = new URLSearchParams(window.location.search);
          if (params.get("auth") === "google_success") {
            const firstName = userData?.name ? userData.name.split(" ")[0] : "Admin";
            toast.success(`Welcome back, ${firstName}! Signed in with Google.`);
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        }
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const logout = async () => {
    try {
      await authApiInstance.get("/auth/logout");
      setUser(null);
      toast.success("You have been signed out successfully.");
    } catch {
      toast.error("Sign out failed. Please try again.");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        setUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
