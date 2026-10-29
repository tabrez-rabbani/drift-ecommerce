import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useAdminSidebar } from "@/context/AdminSidebarContext";
import { 
  LayoutDashboard, 
  Package2, 
  ShoppingCart, 
  Users as UsersIcon,
  Image as ImageIcon,
  ExternalLink,
  ChevronDown
} from "lucide-react";
import { STOREFRONT_URL } from "@/config/env";
import styles from "./Sidebar.module.css";

export default function Sidebar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { logout } = useAuth();
  const { isSidebarOpen, toggleSidebar, closeSidebar, isMobile } = useAdminSidebar();

  const isProductsActive = pathname.startsWith("/admin/products") || pathname.startsWith("/admin/categories");
  const isOrdersActive = pathname.startsWith("/admin/orders");
  const isUsersActive = pathname.startsWith("/admin/users");

  const [isProductMenuOpen, setIsProductMenuOpen] = useState(isProductsActive);
  const [isOrderMenuOpen, setIsOrderMenuOpen] = useState(isOrdersActive);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(isUsersActive);

  useEffect(() => {
    if (isProductsActive) setIsProductMenuOpen(true);
    if (isOrdersActive) setIsOrderMenuOpen(true);
    if (isUsersActive) setIsUserMenuOpen(true);
  }, [isProductsActive, isOrdersActive, isUsersActive]);

  const handleNavClick = () => {
    if (isMobile) {
      closeSidebar();
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/admin-login");
  };

  return (
    <aside
      className={`${styles.sidebar} ${
        isSidebarOpen ? styles["sidebar--open"] : styles["sidebar--closed"]
      }`}
    >
      <div className={styles.sidebar__header}>
        <h2 className={styles.sidebar__logo}>Admin.</h2>
        <button
          type="button"
          className={styles.sidebar__toggle}
          aria-label="Toggle Sidebar"
          onClick={toggleSidebar}
        >
          <span className={styles.hamburger}>
            <span className={styles.hamburgerLine} />
            <span className={styles.hamburgerLine} />
            <span className={styles.hamburgerLine} />
          </span>
        </button>
      </div>

      <nav className={styles.sidebar__nav}>
        <ul className={styles.sidebar__list}>
          <li>
            <Link 
              to="/admin" 
              className={`${styles.sidebar__link} ${pathname === "/admin" ? styles["sidebar__link--active"] : ""}`}
              onClick={handleNavClick}
            >
              <div className={styles.sidebar__linkInner}>
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </div>
            </Link>
          </li>

          <li>
            <Link 
              to="/admin/hero" 
              className={`${styles.sidebar__link} ${pathname === "/admin/hero" || pathname === "/admin/banners" ? styles["sidebar__link--active"] : ""}`}
              onClick={handleNavClick}
            >
              <div className={styles.sidebar__linkInner}>
                <ImageIcon size={18} />
                <span>Hero Banners</span>
              </div>
            </Link>
          </li>

          <li>
            <div 
              className={`${styles.sidebar__link} ${isProductsActive ? styles["sidebar__link--active"] : ""} ${isProductMenuOpen ? styles["sidebar__link--open"] : ""}`} 
              onClick={() => setIsProductMenuOpen(!isProductMenuOpen)}
            >
              <div className={styles.sidebar__linkInner}>
                <Package2 size={18} />
                <span>Products</span>
              </div>
              <ChevronDown 
                size={16} 
                className={`${styles.sidebar__chevron} ${isProductMenuOpen ? styles["sidebar__chevron--open"] : ""}`}
              />
            </div>
            <div className={`${styles.sidebar__submenu} ${isProductMenuOpen ? styles["sidebar__submenu--open"] : ""}`}>
              <ul className={styles.sidebar__subList}>
                <li>
                  <Link 
                    to="/admin/products" 
                    className={`${styles.sidebar__subLink} ${pathname === "/admin/products" ? styles["sidebar__subLink--active"] : ""}`}
                    onClick={handleNavClick}
                  >
                    - Products List
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/admin/products/create" 
                    className={`${styles.sidebar__subLink} ${pathname === "/admin/products/create" ? styles["sidebar__subLink--active"] : ""}`}
                    onClick={handleNavClick}
                  >
                    - Add New Product
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/admin/categories" 
                    className={`${styles.sidebar__subLink} ${pathname === "/admin/categories" ? styles["sidebar__subLink--active"] : ""}`}
                    onClick={handleNavClick}
                  >
                    - Categories
                  </Link>
                </li>
              </ul>
            </div>
          </li>

          <li>
            <div 
              className={`${styles.sidebar__link} ${isOrdersActive ? styles["sidebar__link--active"] : ""} ${isOrderMenuOpen ? styles["sidebar__link--open"] : ""}`} 
              onClick={() => setIsOrderMenuOpen(!isOrderMenuOpen)}
            >
              <div className={styles.sidebar__linkInner}>
                <ShoppingCart size={18} />
                <span>Orders</span>
              </div>
              <ChevronDown 
                size={16} 
                className={`${styles.sidebar__chevron} ${isOrderMenuOpen ? styles["sidebar__chevron--open"] : ""}`}
              />
            </div>
            <div className={`${styles.sidebar__submenu} ${isOrderMenuOpen ? styles["sidebar__submenu--open"] : ""}`}>
              <ul className={styles.sidebar__subList}>
                <li>
                  <Link 
                    to="/admin/orders/users-orders" 
                    className={`${styles.sidebar__subLink} ${pathname === "/admin/orders/users-orders" ? styles["sidebar__subLink--active"] : ""}`}
                    onClick={handleNavClick}
                  >
                    - Users Orders
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/admin/orders/cancel-orders" 
                    className={`${styles.sidebar__subLink} ${pathname === "/admin/orders/cancel-orders" ? styles["sidebar__subLink--active"] : ""}`}
                    onClick={handleNavClick}
                  >
                    - Cancel Orders
                  </Link>
                </li>
              </ul>
            </div>
          </li>

          <li>
            <div 
              className={`${styles.sidebar__link} ${isUsersActive ? styles["sidebar__link--active"] : ""} ${isUserMenuOpen ? styles["sidebar__link--open"] : ""}`} 
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            >
              <div className={styles.sidebar__linkInner}>
                <UsersIcon size={18} />
                <span>Users</span>
              </div>
              <ChevronDown 
                size={16} 
                className={`${styles.sidebar__chevron} ${isUserMenuOpen ? styles["sidebar__chevron--open"] : ""}`}
              />
            </div>
            <div className={`${styles.sidebar__submenu} ${isUserMenuOpen ? styles["sidebar__submenu--open"] : ""}`}>
              <ul className={styles.sidebar__subList}>
                <li>
                  <Link 
                    to="/admin/users" 
                    className={`${styles.sidebar__subLink} ${pathname === "/admin/users" ? styles["sidebar__subLink--active"] : ""}`}
                    onClick={handleNavClick}
                  >
                    - All Users
                  </Link>
                </li>
              </ul>
            </div>
          </li>

          <li>
            <a 
              href={STOREFRONT_URL || "/"} 
              target="_blank"
              rel="noreferrer"
              className={styles.sidebar__link}
              title="Open live storefront website in new tab"
            >
              <div className={styles.sidebar__linkInner}>
                <ExternalLink size={18} />
                <span>Live Website</span>
              </div>
            </a>
          </li>
        </ul>
      </nav>

      <div className={styles.sidebar__footer}>
        <button className={styles.sidebar__logout} onClick={handleLogout}>
          Log Out
        </button>
      </div>
    </aside>
  );
}
