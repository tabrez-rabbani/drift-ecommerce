import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { forgotPassword } from "../services/auth.api";
import { Button } from "../../../components/ui";
import styles from "./ForgotPasswordPage.module.css";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [sent, setSent] = useState(false);

  const startCooldown = () => {
    setCooldown(60);
    const timer = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
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

    if (cooldown > 0) {
      toast.warning(`Please wait ${cooldown}s before trying again`);
      return;
    }

    try {
      setLoading(true);
      const data = await forgotPassword(cleanEmail);
      toast.success(data.message || "Reset link sent! Check your inbox.");
      setSent(true);
      startCooldown();
    } catch (err) {
      toast.error(err.message || "Failed to send reset link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <p className={styles.brand}>DRIFT</p>

        {sent ? (
          <div className={styles.sentView}>
            <h1 className={styles.title}>Check your email</h1>
            <p className={styles.subtitle}>
              We sent a password reset link to <strong>{email}</strong>. Please check your inbox and spam folder.
            </p>

            <Link to="/login" className={styles.backButtonLink}>
              <Button fullWidth>Return to sign in</Button>
            </Link>

            <div className={styles.resendArea}>
              <span className={styles.resendNote}>Didn&apos;t get the email?</span>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading || cooldown > 0}
                className={styles.resendBtn}
              >
                {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend link"}
              </button>
              <span className={styles.dot}>•</span>
              <button
                type="button"
                onClick={() => setSent(false)}
                className={styles.changeEmailBtn}
              >
                Change email
              </button>
            </div>
          </div>
        ) : (
          <>
            <h1 className={styles.title}>Forgot your password?</h1>
            <p className={styles.subtitle}>
              Enter your email and we&apos;ll send you a link to reset your password.
            </p>

            <form className={styles.form} onSubmit={handleSubmit} noValidate>
              <div className={styles.field}>
                <input
                  type="email"
                  id="forgot-email"
                  placeholder=" "
                  required
                  autoComplete="email"
                  autoFocus
                  className={styles.input}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
                <label htmlFor="forgot-email" className={styles.label}>Email address</label>
              </div>

              <Button type="submit" fullWidth loading={loading} disabled={cooldown > 0}>
                {cooldown > 0 ? `Resend in ${cooldown}s` : "Send reset link"}
              </Button>
            </form>

            <p className={styles.backLink}>
              <Link to="/login" className={styles.link}>← Back to sign in</Link>
            </p>
          </>
        )}
      </div>
    </main>
  );
}
