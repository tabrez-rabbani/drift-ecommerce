import { Eye, EyeOff } from "lucide-react";
import { useAdminLogin } from "../../hooks/useAdminLogin";
import styles from "./AdminLoginForm.module.css";

export default function AdminLoginForm() {
  const {
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
  } = useAdminLogin();

  const isSubmitting = loading || googleLoading;

  return (
    <main className={styles.main}>
      <div className={styles.card}>
        <div className={styles.brandPanel}>
          <img
            src="/images/login/login.webp"
            alt="Drift Admin"
            className={styles.brandPanel__image}
          />
        </div>

        <div className={styles.formPanel}>
          <h2 className={styles.formPanel__title}>Admin Secure Login</h2>

          <form className={styles.form} onSubmit={handleLogin} noValidate>
            {error && <div className={styles.errorMessage}>{error}</div>}

            <div className={styles.field}>
              <input
                type="email"
                id="admin-login-email"
                placeholder=" "
                required
                autoComplete="email"
                className={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
              />
              <label htmlFor="admin-login-email" className={styles.label}>
                Admin Email
              </label>
            </div>

            <div className={styles.field}>
              <input
                type={showPassword ? "text" : "password"}
                id="admin-login-password"
                placeholder=" "
                required
                autoComplete="current-password"
                className={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
              />
              <label htmlFor="admin-login-password" className={styles.label}>
                Password
              </label>
              <button
                type="button"
                className={styles.eyeBtn}
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Hide password" : "Show password"}
                disabled={isSubmitting}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className={styles.formRow}>
              <button
                type="submit"
                className={styles.submitBtn}
                disabled={isSubmitting}
              >
                {loading ? "Authenticating..." : "Login to Dashboard"}
              </button>
            </div>
          </form>

          <div className={styles.divider}>
            <span>or</span>
          </div>

          <button
            type="button"
            className={styles.googleBtn}
            onClick={handleGoogleLogin}
            disabled={isSubmitting}
          >
            {googleLoading ? (
              <>
                <div className={styles.googleSpinner} />
                <span>Connecting to Google...</span>
              </>
            ) : (
              <>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                <span>Continue with Google</span>
              </>
            )}
          </button>
        </div>
      </div>
    </main>
  );
}
