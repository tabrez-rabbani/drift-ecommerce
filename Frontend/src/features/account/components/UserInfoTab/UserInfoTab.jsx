import { Eye, EyeOff } from "lucide-react";
import styles from "./UserInfoTab.module.css";

export default function UserInfoTab({
  user,
  name, setName,
  phone, setPhone,
  streetAddress, setStreetAddress,
  city, setCity,
  postalCode, setPostalCode,
  stateField, setStateField,
  country, setCountry,
  password, setPassword,
  confirmPassword, setConfirmPassword,
  showPassword, setShowPassword,
  isSaving,
  onSubmit,
}) {
  return (
    <div className={styles.root}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Profile Info Update</h2>
      </div>
      <p className={styles.subtitle}>Manage your profile settings and address.</p>

      <form className={styles.form} onSubmit={onSubmit}>
        <h4 className={styles.formGroupHeading}>Personal Info</h4>

        <input
          type="text"
          className={styles.input}
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          className={`${styles.input} ${styles.inputDisabled}`}
          placeholder="Your email"
          value={user?.email || ""}
          disabled
          title="Email cannot be changed"
        />
        <input
          type="tel"
          className={styles.input}
          placeholder="Mobile number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <h4 className={styles.formGroupHeading}>Address Info</h4>

        <input
          type="text"
          className={styles.input}
          placeholder="Street address"
          value={streetAddress}
          onChange={(e) => setStreetAddress(e.target.value)}
        />
        <div className={styles.grid2}>
          <input
            type="text"
            className={styles.input}
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <input
            type="text"
            className={styles.input}
            placeholder="Postal code"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
          />
        </div>
        <div className={styles.grid2}>
          <input
            type="text"
            className={styles.input}
            placeholder="State"
            value={stateField}
            onChange={(e) => setStateField(e.target.value)}
          />
          <input
            type="text"
            className={styles.input}
            placeholder="Country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
        </div>

        <h4 className={styles.formGroupHeading}>Change Password (Optional)</h4>

        <div className={styles.passwordWrapper}>
          <input
            type={showPassword ? "text" : "password"}
            className={styles.input}
            placeholder="New password (leave empty to keep current)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
          <button
            type="button"
            className={styles.eyeBtn}
            onClick={() => setShowPassword(!showPassword)}
            aria-label="Toggle password visibility"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {password && (
          <input
            type={showPassword ? "text" : "password"}
            className={styles.input}
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required={Boolean(password)}
            autoComplete="new-password"
          />
        )}

        <button type="submit" className={styles.saveBtn} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Info"}
        </button>
      </form>
    </div>
  );
}
