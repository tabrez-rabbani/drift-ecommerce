import { Outlet } from "react-router-dom";
import ScrollToTop from "../../components/layout/ScrollToTop/ScrollToTop";
import Header from "../../components/layout/Header/Header";
import Footer from "../../components/layout/Footer/Footer";
import CartDrawer from "../../features/cart/components/CartDrawer/CartDrawer";
import styles from "./MainLayout.module.css";

export default function MainLayout() {
  return (
    <div className={styles.layout}>
      <ScrollToTop />
      <Header />
      <CartDrawer />
      <main className={styles.main}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
