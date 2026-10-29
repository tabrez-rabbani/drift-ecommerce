import { Outlet } from "react-router-dom";
import AdminGuard from "@/components/AdminGuard/AdminGuard";
import AdminLayoutContent from "./AdminLayoutContent";
import { AdminSidebarProvider } from "@/context/AdminSidebarContext";
import styles from "./AdminLayout.module.css";

export default function AdminLayout({ children }) {
  return (
    <AdminGuard>
      <AdminSidebarProvider>
        <AdminLayoutContent className={styles.adminLayout}>
          {children || <Outlet />}
        </AdminLayoutContent>
      </AdminSidebarProvider>
    </AdminGuard>
  );
}
