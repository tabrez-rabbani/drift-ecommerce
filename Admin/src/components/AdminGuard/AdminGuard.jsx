import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import styles from "./AdminGuard.module.css";

export default function AdminGuard({ children }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated || user?.role !== "admin") {
        navigate("/admin-login", { replace: true });
      }
    }
  }, [isLoading, isAuthenticated, user, navigate]);

  if (isLoading || !isAuthenticated || user?.role !== "admin") {
    return (
      <div className={styles.authChecking}>
        Verifying admin authorization...
      </div>
    );
  }

  return <>{children}</>;
}
