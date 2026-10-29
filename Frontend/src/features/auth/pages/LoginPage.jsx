import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../hooks/useAuth";
import { Button } from "../../../components/ui";
import styles from "./LoginPage.module.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { handleLogin, handleGoogleLogin, isAuthenticated, loading, isInitialized, user } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const verified = searchParams.get("verified");
    const errorParam = searchParams.get("error");

    if (verified === "true") {
      toast.success("Email verified successfully! You can now log in.");
    } else if (errorParam === "verification_failed") {
      toast.error("Verification link is invalid or has expired.");
    } else if (errorParam === "unauthorized") {
      toast.error("Google login failed. Your account may not be authorized.");
    } else if (errorParam === "google_failed") {
      toast.error("Google authentication failed. Please try again.");
    }
  }, [searchParams]);

  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      const from = location.state?.from || (user?.role === "admin" ? "/admin" : "/");
      navigate(from, { replace: true });
    }
  }, [isInitialized, isAuthenticated, user, navigate, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail) {
      toast.warning("Please enter your email address");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      toast.warning("Please enter a valid email address");
      return;
    }

    if (!password) {
      toast.warning("Please enter your password");
      return;
    }

    await handleLogin({ email: cleanEmail, password });
  };

  const onGoogleLogin = () => {
    const from = location.state?.from;
    if (from && from !== "/") {
      try {
        sessionStorage.setItem("auth_redirect_to", from);
      } catch {
        void 0;
      }
    }
    handleGoogleLogin();
  };

  return (
    <main className={styles.main}>
      <div className={styles.card}>
        <div className={styles.brandPanel}>
          <img
            src="/images/login/login.webp"
            alt="DRIFT Fashion"
            className={styles.brandPanel__image}
          />
        </div>

        <div className={styles.formPanel}>
          <h2 className={styles.formPanel__title}>Sign in to your account</h2>

          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <div className={styles.field}>
              <input
                type="email"
                id="login-email"
                placeholder=" "
                required
                autoComplete="email"
                className={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
              <label htmlFor="login-email" className={styles.label}>Email address</label>
            </div>

            <div className={styles.field}>
              <input
                type={showPassword ? "text" : "password"}
                id="login-password"
                placeholder=" "
                required
                autoComplete="current-password"
                className={`${styles.input} ${styles.passwordInput}`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
              <label htmlFor="login-password" className={styles.label}>Password</label>
              <button
                type="button"
                tabIndex={-1}
                className={styles.eyeBtn}
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                disabled={loading}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className={styles.formRow}>
              <Button
                type="submit"
                fullWidth
                loading={loading}
              >
                Sign In
              </Button>
            </div>
          </form>

          <div className={styles.divider}><span>or</span></div>

          <button
            type="button"
            className={styles.googleBtn}
            onClick={onGoogleLogin}
            disabled={loading}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span>Continue with Google</span>
          </button>

          <p className={styles.switchText}>
            No account? <Link to="/register" state={location.state} className={styles.switchLink}>Sign up</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
