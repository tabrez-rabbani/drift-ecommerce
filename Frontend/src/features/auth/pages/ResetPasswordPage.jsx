import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { resetPassword } from "../services/auth.api";
import { Button } from "../../../components/ui";
import styles from "./ResetPasswordPage.module.css";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      toast.error("Invalid or missing reset token.");
      navigate("/forgot-password", { replace: true });
    }
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newPassword || newPassword.length < 6) {
      toast.warning("Password must be at least 6 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.warning("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const data = await resetPassword({ token, newPassword });
      toast.success(data.message || "Password reset successfully!");
      navigate("/login", { replace: true });
    } catch (err) {
      toast.error(err.message || "Failed to reset password. The link may have expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <p className={styles.brand}>DRIFT</p>
        <h1 className={styles.title}>Create new password</h1>
        <p className={styles.subtitle}>
          Your new password must be at least 6 characters long.
        </p>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.field}>
            <input
              type={showNew ? "text" : "password"}
              id="reset-new-password"
              placeholder=" "
              required
              autoComplete="new-password"
              autoFocus
              className={`${styles.input} ${styles.passwordInput}`}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={loading}
            />
            <label htmlFor="reset-new-password" className={styles.label}>New password</label>
            <button
              type="button"
              tabIndex={-1}
              className={styles.eyeBtn}
              onClick={() => setShowNew(!showNew)}
              aria-label={showNew ? "Hide password" : "Show password"}
            >
              {showNew ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className={styles.field}>
            <input
              type={showConfirm ? "text" : "password"}
              id="reset-confirm-password"
              placeholder=" "
              required
              autoComplete="new-password"
              className={`${styles.input} ${styles.passwordInput}`}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
            />
            <label htmlFor="reset-confirm-password" className={styles.label}>Confirm new password</label>
            <button
              type="button"
              tabIndex={-1}
              className={styles.eyeBtn}
              onClick={() => setShowConfirm(!showConfirm)}
              aria-label={showConfirm ? "Hide password" : "Show password"}
            >
              {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <Button type="submit" fullWidth loading={loading}>
            Reset password
          </Button>
        </form>
      </div>
    </main>
  );
}
