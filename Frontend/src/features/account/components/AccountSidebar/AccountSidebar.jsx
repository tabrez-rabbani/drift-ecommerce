import {
  Home,
  User as UserIcon,
  ShoppingBag,
  LogOut,
} from "lucide-react";
import styles from "./AccountSidebar.module.css";

const NAV_TABS = [
  { id: "dashboard", label: "Dashboard", Icon: Home },
  { id: "userinfo", label: "User Info", Icon: UserIcon },
  { id: "orders", label: "My Orders", Icon: ShoppingBag },
];

export default function AccountSidebar({
  user,
  activeTab,
  onTabChange,
  onLogout,
  getUserInitial,
}) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.cover}>
        <img
          src="/images/account/cover-img.jpg"
          alt="Account cover"
          className={styles.coverImg}
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      </div>

      <div className={styles.profileInfo}>
        <div className={styles.avatarWrapper}>
          <span className={styles.avatarInitial}>{getUserInitial()}</span>
        </div>
        <h3 className={styles.userName}>{user?.name}</h3>
        <p className={styles.userEmail}>{user?.email}</p>
      </div>

      <nav className={styles.nav}>
        <ul className={styles.navList}>
          {NAV_TABS.map(({ id, label, Icon }) => (
            <li key={id} className={styles.navItem}>
              <button
                type="button"
                className={`${styles.navLink} ${activeTab === id ? styles.navLinkActive : ""}`}
                onClick={() => onTabChange(id)}
              >
                <Icon size={18} />
                <span>{label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className={styles.logoutArea}>
        <button type="button" className={styles.logoutBtn} onClick={onLogout}>
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
