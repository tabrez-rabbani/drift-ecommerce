import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Search,
  ChevronDown,
  X,
  Heart,
  User,
  ShoppingCart,
  LogOut,
  Package,
  LayoutDashboard,
} from "lucide-react";
import { useAuth } from "../../../features/auth/hooks/useAuth";
import { useCart } from "../../../features/cart/hooks/useCart";
import { useWishlist } from "../../../features/wishlist/hooks/useWishlist";
import styles from "./Header.module.css";


const desktopNavLinks = [
  { label: "COLLECTIONS", href: "/collection" },
  {
    label: "CATEGORIES",
    href: "/collection",
    children: [
      { label: "Shirts", href: "/collection/shirts" },
      { label: "T-Shirts", href: "/collection/t-shirts" },
      { label: "Polos", href: "/collection/polos" },
      { label: "Jeans", href: "/collection/jeans" },
      { label: "Trousers", href: "/collection/trousers" },
      { label: "Cargos", href: "/collection/cargos" },
      { label: "Outerwear", href: "/collection/outerwear" },
      { label: "Sneakers", href: "/collection/sneakers" },
      { label: "Plus Size", href: "/collection/plus-size" },
    ],
  },
  { label: "TRENDING", href: "/collection?sort=newest" },
  { label: "PRICE DROP", href: "/collection/price-drop", isHighlight: true },
];

const mobileNavLinks = [
  {
    label: "SHIRTS",
    href: "/collection/shirts",
    children: [
      { label: "All Shirts", href: "/collection/shirts" },
      { label: "Formal Shirts", href: "/collection/formal-shirts" },
      { label: "Linen Shirts", href: "/collection/linen-shirts" },
      { label: "Printed Shirts", href: "/collection/printed-shirts" },
      { label: "Checked Shirts", href: "/collection/checked-shirts" },
      { label: "Striped Shirts", href: "/collection/striped-shirts" },
    ],
  },
  {
    label: "T-SHIRTS & POLOS",
    href: "/collection/t-shirts",
    children: [
      { label: "T-Shirts", href: "/collection/t-shirts" },
      { label: "Polo T-Shirts", href: "/collection/polos" },
    ],
  },
  { label: "JEANS", href: "/collection/jeans" },
  {
    label: "TROUSERS & CARGOS",
    href: "/collection/trousers",
    children: [
      { label: "Trousers", href: "/collection/trousers" },
      { label: "Cargos", href: "/collection/cargos" },
    ],
  },
  { label: "OUTERWEAR", href: "/collection/outerwear" },
  { label: "SNEAKERS", href: "/collection/sneakers" },
  { label: "PLUS SIZE", href: "/collection/plus-size" },
  { label: "PRICE DROP", href: "/collection/price-drop", isHighlight: true },
];

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState(null);
  const [isSticky, setIsSticky] = useState(false);

  const profileRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const { user, isAuthenticated, handleLogout } = useAuth();
  const { totalItems, handleOpenCart } = useCart();
  const { wishlistCount } = useWishlist();

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          if (scrollY > 90) {
            setIsSticky(true);
          } else if (scrollY < 20) {
            setIsSticky(false);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsSticky(false);
    setIsMobileMenuOpen(false);
    setExpandedSection(null);
    setIsProfileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1200) {
        setIsMobileMenuOpen(false);
        setExpandedSection(null);
      }
    };
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogoClick = (e) => {
    if (location.pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsMobileMenuOpen(false);
        setIsProfileOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const onLogout = async () => {
    setIsProfileOpen(false);
    await handleLogout();
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setExpandedSection(null);
  };

  const toggleSection = (label) => {
    setExpandedSection((prev) => (prev === label ? null : label));
  };

  return (
    <div className={styles.headerWrapper}>
      <header
        className={`${styles.header} ${isSticky ? styles["header--sticky"] : ""}`}
        id="site-header"
      >
        <div className={styles.header__inner}>
        {/* Left: Brand Logo */}
        <Link
          to="/"
          className={styles.header__logo}
          aria-label="DRIFT home"
          onClick={handleLogoClick}
        >
          <img
            src="/images/logo.png"
            alt="DRIFT"
            width="160"
            height="53"
            fetchPriority="high"
            decoding="async"
            className={styles.header__logoImg}
          />
        </Link>

        {/* Center: Desktop Navigation */}
        <nav className={styles.header__nav} aria-label="Main navigation">
          {desktopNavLinks.map((link) =>
            link.children ? (
              <div key={link.label} className={styles.header__navItem}>
                <span>{link.label}</span>
                <ChevronDown className={styles.header__navChevron} strokeWidth={2.5} />
                <div className={styles.header__dropdown}>
                  {link.children.map((child) => (
                    <Link
                      key={child.label}
                      to={child.href}
                      className={styles.header__dropdownLink}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                key={link.label}
                to={link.href}
                className={`${styles.header__navItem} ${
                  link.isHighlight ? styles.header__navItemHighlight : ""
                }`}
              >
                {link.label}
              </Link>
            )
          )}
        </nav>

        {/* Right: Actions (Search, Wishlist, Profile, Cart, Mobile Menu) */}
        <div className={styles.header__actions}>
          {/* Search Icon */}
          <button
            type="button"
            className={styles.header__iconLink}
            onClick={() => navigate("/search")}
            aria-label="Search"
          >
            <Search size={22} strokeWidth={2} />
          </button>

          {/* Wishlist Icon */}
          <Link
            to="/wishlist"
            className={`${styles.header__iconLink} ${styles.header__wishlistBtn}`}
            aria-label="Wishlist"
          >
            <Heart size={22} strokeWidth={2} />
            {wishlistCount > 0 && (
              <span className={styles.header__wishlistBadge}>{wishlistCount}</span>
            )}
          </Link>

          {/* Profile / Account Dropdown */}
          {isAuthenticated ? (
            <div
              ref={profileRef}
              className={`${styles.header__profileWrapper} ${
                isProfileOpen ? styles["header__profileWrapper--open"] : ""
              }`}
            >
              <button
                type="button"
                className={`${styles.header__iconLink} ${styles.header__profileBtn}`}
                aria-label="My Account"
                aria-expanded={isProfileOpen}
                onClick={() => setIsProfileOpen((p) => !p)}
              >
                <User size={22} strokeWidth={2} />
              </button>

              <div className={styles.header__profileDropdown}>
                {user?.role === "admin" ? (
                  <Link
                    to="/admin"
                    className={styles.header__profileLink}
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <LayoutDashboard size={15} />
                    <span>Admin Panel</span>
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/account"
                      className={styles.header__profileLink}
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <User size={15} />
                      <span>My Account</span>
                    </Link>
                    <Link
                      to="/account?tab=orders"
                      className={styles.header__profileLink}
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <Package size={15} />
                      <span>Orders</span>
                    </Link>
                    <Link
                      to="/wishlist"
                      className={styles.header__profileLink}
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <Heart size={15} />
                      <span>Wishlist</span>
                    </Link>
                  </>
                )}
                <button
                  type="button"
                  className={`${styles.header__profileLink} ${styles.header__profileLogout}`}
                  onClick={onLogout}
                >
                  <LogOut size={15} />
                  <span>Log out</span>
                </button>
              </div>
            </div>
          ) : (
            <Link
              to="/login"
              className={`${styles.header__iconLink} ${styles.header__profileBtn}`}
              aria-label="Sign In"
              title="Sign In"
            >
              <User size={22} strokeWidth={2} />
            </Link>
          )}

          {/* Cart Icon */}
          <button
            type="button"
            className={`${styles.header__iconLink} ${styles.header__cartBtn}`}
            aria-label="Shopping cart"
            onClick={handleOpenCart}
          >
            <ShoppingCart size={22} strokeWidth={2} />
            {totalItems > 0 && (
              <span className={styles.header__cartBadge}>{totalItems}</span>
            )}
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            className={`${styles.header__menuBtn} ${
              isMobileMenuOpen ? styles["header__menuBtn--active"] : ""
            }`}
            type="button"
            aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          >
            <span className={styles.hamburger}>
              <span className={styles.hamburgerLine} />
              <span className={styles.hamburgerLine} />
              <span className={styles.hamburgerLine} />
            </span>
          </button>
        </div>
      </div>
    </header>

      {/* Mobile Drawer Overlay */}
      <div
        className={`${styles.mobileMenu__overlay} ${
          isMobileMenuOpen ? styles["mobileMenu__overlay--open"] : ""
        }`}
        onClick={closeMobileMenu}
        aria-hidden="true"
      />

      {/* Mobile Slide-in Drawer */}
      <aside
        className={`${styles.mobileMenu} ${
          isMobileMenuOpen ? styles["mobileMenu--open"] : ""
        }`}
        aria-label="Mobile navigation"
        aria-hidden={!isMobileMenuOpen}
      >
        <div className={styles.mobileMenu__header}>
          <Link to="/" className={styles.mobileMenu__brand} onClick={closeMobileMenu}>
            <img
              src="/images/logo.png"
              alt="DRIFT"
              width="120"
              height="40"
              loading="lazy"
              decoding="async"
              className={styles.mobileMenu__brandImg}
            />
          </Link>
          <button
            type="button"
            className={styles.mobileMenu__closeBtn}
            onClick={closeMobileMenu}
            aria-label="Close menu"
          >
            <X size={22} strokeWidth={2} />
          </button>
        </div>

        {/* Mobile Nav Links */}
        <nav className={styles.mobileMenu__nav} aria-label="Mobile navigation links">
          {mobileNavLinks.map((link) => (
            <div key={link.label} className={styles.mobileMenu__item}>
              {link.children ? (
                <>
                  <button
                    type="button"
                    className={`${styles.mobileMenu__accordionBtn} ${
                      expandedSection === link.label
                        ? styles["mobileMenu__accordionBtn--open"]
                        : ""
                    }`}
                    onClick={() => toggleSection(link.label)}
                    aria-expanded={expandedSection === link.label}
                  >
                    <span>{link.label}</span>
                    <ChevronDown
                      size={18}
                      className={`${styles.mobileMenu__accordionChevron} ${
                        expandedSection === link.label
                          ? styles["mobileMenu__accordionChevron--open"]
                          : ""
                      }`}
                      strokeWidth={2}
                    />
                  </button>
                  <div
                    className={`${styles.mobileMenu__subnav} ${
                      expandedSection === link.label
                        ? styles["mobileMenu__subnav--open"]
                        : ""
                    }`}
                  >
                    {link.children.map((child) => (
                      <Link
                        key={child.label}
                        to={child.href}
                        className={styles.mobileMenu__sublink}
                        onClick={closeMobileMenu}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </>
              ) : (
                <Link
                  to={link.href}
                  className={`${styles.mobileMenu__link} ${
                    link.isHighlight ? styles.mobileMenu__linkHighlight : ""
                  }`}
                  onClick={closeMobileMenu}
                >
                  {link.label}
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* Mobile Footer Actions */}
        <div className={styles.mobileMenu__footer}>
          <Link
            to="/search"
            className={styles.mobileMenu__footerLink}
            onClick={closeMobileMenu}
          >
            <Search size={17} strokeWidth={2} />
            <span>Search</span>
          </Link>
          <Link
            to="/wishlist"
            className={styles.mobileMenu__footerLink}
            onClick={closeMobileMenu}
          >
            <Heart size={17} strokeWidth={2} />
            <span>Wishlist</span>
            {wishlistCount > 0 && (
              <span className={styles.mobileMenu__badge}>{wishlistCount}</span>
            )}
          </Link>

          <button
            type="button"
            className={styles.mobileMenu__footerLink}
            onClick={() => {
              closeMobileMenu();
              handleOpenCart();
            }}
          >
            <ShoppingCart size={17} strokeWidth={2} />
            <span>Cart</span>
            {totalItems > 0 && (
              <span className={styles.mobileMenu__badge}>{totalItems}</span>
            )}
          </button>

          <Link
            to={isAuthenticated ? "/account" : "/login"}
            className={styles.mobileMenu__footerLink}
            onClick={closeMobileMenu}
          >
            <User size={17} strokeWidth={2} />
            <span>{isAuthenticated ? (user?.name || "My Account") : "Sign In / Register"}</span>
          </Link>

          {isAuthenticated && user?.role === "admin" && (
            <Link
              to="/admin"
              className={styles.mobileMenu__footerLink}
              onClick={closeMobileMenu}
            >
              <LayoutDashboard size={17} strokeWidth={2} />
              <span>Admin Panel</span>
            </Link>
          )}

          {isAuthenticated && (
            <button
              type="button"
              className={`${styles.mobileMenu__footerLink} ${styles.mobileMenu__footerLogout}`}
              onClick={() => {
                closeMobileMenu();
                onLogout();
              }}
            >
              <LogOut size={17} strokeWidth={2} />
              <span>Log out</span>
            </button>
          )}
        </div>
      </aside>
    </div>
  );
}
