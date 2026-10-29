import { ShoppingCart, ClipboardList, Pencil } from "lucide-react";
import styles from "./DashboardTab.module.css";

export default function DashboardTab({
  user,
  orders,
  cartItemCount,
  onEditProfile,
}) {
  return (
    <div className={styles.root}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>My Dashboard</h2>
      </div>

      <div className={styles.greeting}>
        <h4>
          Hello, <span className={styles.greetingName}>{user?.name}</span>
        </h4>
        <p className={styles.greetingDesc}>
          Welcome to your personalized account dashboard. Here you can manage
          your orders, update your profile, and track your shopping journey —
          all in one place.
        </p>
      </div>

      {/* Stats */}
      <div className={styles.statsGrid}>
        <div className={styles.statBox}>
          <div className={styles.statIconWrapper}>
            <ShoppingCart size={28} strokeWidth={2} />
          </div>
          <div className={styles.statInfo}>
            <h4>Cart Items</h4>
            <h3>{cartItemCount}</h3>
          </div>
        </div>
        <div className={styles.statBox}>
          <div className={styles.statIconWrapper}>
            <ClipboardList size={28} strokeWidth={2} />
          </div>
          <div className={styles.statInfo}>
            <h4>My Orders</h4>
            <h3>{orders?.length ?? 0}</h3>
          </div>
        </div>
      </div>

      {/* Profile Info */}
      <div className={styles.infoCard}>
        <h3 className={styles.infoCardTitle}>Profile Information</h3>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Name:</span>
          <span className={styles.infoValue}>{user?.name}</span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Phone:</span>
          <span className={styles.infoValue}>
            {user?.phone || "Phone not provided"}
          </span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Address:</span>
          <span className={styles.infoValue}>
            {[user?.streetAddress, user?.city, user?.state, user?.postalCode, user?.country]
              .filter(Boolean)
              .join(", ") || "Address not provided"}
          </span>
          <button
            type="button"
            className={styles.editBtn}
            onClick={onEditProfile}
            title="Edit Profile"
          >
            <Pencil size={14} />
          </button>
        </div>
      </div>

      {/* Login Details */}
      <div className={styles.infoCard}>
        <h3 className={styles.infoCardTitle}>Login Details</h3>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Email:</span>
          <span className={styles.infoValue}>{user?.email || "Not provided"}</span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Username:</span>
          <span className={styles.infoValue}>{user?.name || "Not provided"}</span>
        </div>
      </div>
    </div>
  );
}
