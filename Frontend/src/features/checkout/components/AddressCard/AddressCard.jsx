import styles from "./AddressCard.module.css";

export default function AddressCard({
  shippingAddress,
  isEditingAddress,
  setIsEditingAddress,
  formErrors,
  handleInputChange,
  handleSaveAddress,
}) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.title}>Shipping Address</h2>
        <button
          type="button"
          className={styles.editBtn}
          onClick={() => setIsEditingAddress(!isEditingAddress)}
        >
          {isEditingAddress ? "Done" : "Edit"}
        </button>
      </div>

      {!isEditingAddress ? (
        <div className={styles.preview}>
          <div className={styles.previewName}>{shippingAddress.fullName}</div>
          <div>{shippingAddress.streetAddress}</div>
          <div>
            {shippingAddress.city}, {shippingAddress.state} - {shippingAddress.postalCode}
          </div>
          <div>{shippingAddress.country}</div>
          <div className={styles.previewMeta}>
            Phone: {shippingAddress.phone} | Email: {shippingAddress.email}
          </div>
        </div>
      ) : (
        <>
          <div className={styles.formGrid}>
            <div className={styles.inputGroup}>
              <input
                type="text"
                name="fullName"
                autoComplete="name"
                placeholder="Full Name"
                value={shippingAddress.fullName}
                onChange={handleInputChange}
                className={`${styles.input} ${formErrors.fullName ? styles.inputError : ""}`}
              />
              {formErrors.fullName && (
                <span className={styles.fieldError}>{formErrors.fullName}</span>
              )}
            </div>

            <div className={styles.inputGroup}>
              <input
                type="email"
                name="email"
                autoComplete="email"
                placeholder="Email Address"
                value={shippingAddress.email}
                onChange={handleInputChange}
                className={`${styles.input} ${formErrors.email ? styles.inputError : ""}`}
              />
              {formErrors.email && (
                <span className={styles.fieldError}>{formErrors.email}</span>
              )}
            </div>

            <div className={styles.inputGroup}>
              <input
                type="tel"
                name="phone"
                autoComplete="tel"
                placeholder="Phone Number (10 digits)"
                value={shippingAddress.phone}
                onChange={handleInputChange}
                className={`${styles.input} ${formErrors.phone ? styles.inputError : ""}`}
              />
              {formErrors.phone && (
                <span className={styles.fieldError}>{formErrors.phone}</span>
              )}
            </div>

            <div className={styles.inputGroup}>
              <input
                type="text"
                name="streetAddress"
                autoComplete="street-address"
                placeholder="Street Address, Area, House No."
                value={shippingAddress.streetAddress}
                onChange={handleInputChange}
                className={`${styles.input} ${formErrors.streetAddress ? styles.inputError : ""}`}
              />
              {formErrors.streetAddress && (
                <span className={styles.fieldError}>{formErrors.streetAddress}</span>
              )}
            </div>

            <div className={styles.inputGroup}>
              <input
                type="text"
                name="postalCode"
                autoComplete="postal-code"
                placeholder="Postal / PIN Code"
                value={shippingAddress.postalCode}
                onChange={handleInputChange}
                className={`${styles.input} ${formErrors.postalCode ? styles.inputError : ""}`}
              />
              {formErrors.postalCode && (
                <span className={styles.fieldError}>{formErrors.postalCode}</span>
              )}
            </div>

            <div className={styles.inputGroup}>
              <input
                type="text"
                name="city"
                autoComplete="address-level2"
                placeholder="City"
                value={shippingAddress.city}
                onChange={handleInputChange}
                className={`${styles.input} ${formErrors.city ? styles.inputError : ""}`}
              />
              {formErrors.city && (
                <span className={styles.fieldError}>{formErrors.city}</span>
              )}
            </div>

            <div className={styles.inputGroup}>
              <input
                type="text"
                name="state"
                autoComplete="address-level1"
                placeholder="State"
                value={shippingAddress.state}
                onChange={handleInputChange}
                className={`${styles.input} ${formErrors.state ? styles.inputError : ""}`}
              />
              {formErrors.state && (
                <span className={styles.fieldError}>{formErrors.state}</span>
              )}
            </div>

            <div className={styles.inputGroup}>
              <input
                type="text"
                name="country"
                autoComplete="country-name"
                placeholder="Country"
                value={shippingAddress.country}
                onChange={handleInputChange}
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.saveBar}>
            <button
              type="button"
              className={styles.saveBtn}
              onClick={handleSaveAddress}
            >
              Save & Continue
            </button>
          </div>
        </>
      )}
    </div>
  );
}

