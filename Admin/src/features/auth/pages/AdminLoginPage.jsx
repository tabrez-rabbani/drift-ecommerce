import { Suspense } from "react";
import AdminLoginForm from "../components/AdminLoginForm/AdminLoginForm";
import styles from "./AdminLoginPage.module.css";

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className={styles.suspenseFallback} />}>
      <AdminLoginForm />
    </Suspense>
  );
}
