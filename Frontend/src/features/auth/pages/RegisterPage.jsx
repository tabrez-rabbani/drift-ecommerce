import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../hooks/useAuth";
import { Button } from "../../../components/ui";
import styles from "./RegisterPage.module.css";

export default function RegisterPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { handleRegister, handleGoogleLogin, isAuthenticated, loading, isInitialized, user } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      const from = location.state?.from || (user?.role === "admin" ? "/admin" : "/");
      navigate(from, { replace: true });
    }
  }, [isInitialized, isAuthenticated, user, navigate, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanName = name.trim();
    const cleanEmail = email.trim();
    const cleanPhone = phone.trim().replace(/\D/g, "");

    if (!cleanName || cleanName.length < 3) {
      toast.warning("Full name must be at least 3 characters");
      return;
    }
    if (cleanName.length > 50) {
      toast.warning("Full name must be under 50 characters");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      toast.warning("Please enter a valid email address");
      return;
    }

    if (!cleanPhone || cleanPhone.length < 10 || cleanPhone.length > 15) {
      toast.warning("Contact number must be between 10 and 15 digits");
      return;
    }

    if (!password || password.length < 6) {
      toast.warning("Password must be at least 6 characters long");
      return;
    }

    if (password !== confirmPassword) {
      toast.warning("Passwords do not match");
      return;
    }

    const success = await handleRegister({
      name: cleanName,
      email: cleanEmail,
      password,
      phone: cleanPhone,
    });

    if (success) {
      navigate("/login", { replace: true });
    }
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
        <div className={styles.formPanel}>
          <h2 className={styles.formPanel__title}>Create Account</h2>
          <p className={styles.formPanel__subtitle}>Join DRIFT for an elevated shopping experience.</p>

          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <div className={styles.formGrid}>
              <div className={styles.field}>
                <input
                  type="text"
                  id="reg-name"
                  placeholder=" "
                  required
                  autoComplete="name"
                  minLength={3}
                  maxLength={50}
                  className={styles.input}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                />
                <label htmlFor="reg-name" className={styles.label}>Full name</label>
              </div>

              <div className={styles.field}>
                <input
                  type="tel"
                  id="reg-phone"
                  placeholder=" "
                  required
                  autoComplete="tel"
                  inputMode="numeric"
                  pattern="[0-9]{10,15}"
                  maxLength={15}
                  className={styles.input}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                  disabled={loading}
                />
                <label htmlFor="reg-phone" className={styles.label}>Phone number</label>
              </div>
            </div>

            <div className={styles.field}>
              <input
                type="email"
                id="reg-email"
                placeholder=" "
                required
                autoComplete="email"
                className={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
              <label htmlFor="reg-email" className={styles.label}>Email address</label>
            </div>

            <div className={styles.field}>
              <input
                type={showPassword ? "text" : "password"}
                id="reg-password"
                placeholder=" "
                required
                autoComplete="new-password"
                minLength={6}
                className={`${styles.input} ${styles.passwordInput}`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
              <label htmlFor="reg-password" className={styles.label}>Password</label>
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

            <div className={styles.field}>
              <input
                type={showConfirm ? "text" : "password"}
                id="reg-confirm"
                placeholder=" "
                required
                autoComplete="new-password"
                className={`${styles.input} ${styles.passwordInput}`}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
              />
              <label htmlFor="reg-confirm" className={styles.label}>Confirm password</label>
              <button
                type="button"
                tabIndex={-1}
                className={styles.eyeBtn}
                onClick={() => setShowConfirm(!showConfirm)}
                aria-label={showConfirm ? "Hide password" : "Show password"}
                disabled={loading}
              >
                {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <Button
              type="submit"
              fullWidth
              loading={loading}
            >
              Create Account
            </Button>
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
            Already have an account? <Link to="/login" state={location.state} className={styles.switchLink}>Sign in</Link>
          </p>
        </div>

        <div className={styles.imagePanel}>
          <div className={styles.imagePanel__top}>
            <span className={styles.imagePanel__question}>Already a member?</span>
            <Link to="/login" state={location.state} className={styles.imagePanel__loginBtn}>Sign In</Link>
          </div>
          <div className={styles.imagePanel__img}>
            <img
              src="/images/login/signup.webp"
              alt="DRIFT Fashion"
              className={styles.imagePanel__imgElement}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
