import { useAdminSidebar } from "@/context/AdminSidebarContext";
import Sidebar from "@/components/Sidebar/Sidebar";
import Navbar from "@/components/Navbar/Navbar";
import styles from "./AdminLayout.module.css";

export default function AdminLayoutContent({ children, className }) {
  const { isSidebarOpen, closeSidebar, isMobile } = useAdminSidebar();

  return (
    <div className={className}>
      {isMobile && isSidebarOpen && (
        <div
          className={`${styles.sidebarOverlay} ${styles.sidebarOverlayVisible}`}
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}
      <Sidebar />
      <div
        className={`${styles.adminMain} ${!isSidebarOpen ? styles.adminMainExpanded : ""}`}
      >
        <Navbar />
        <div className={styles.adminContent}>{children}</div>
      </div>
    </div>
  );
}
