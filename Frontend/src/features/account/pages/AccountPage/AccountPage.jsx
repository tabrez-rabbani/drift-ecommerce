import { useEffect } from "react";
import useAccount from "../../hooks/useAccount";
import AccountSidebar from "../../components/AccountSidebar/AccountSidebar";
import DashboardTab from "../../components/DashboardTab/DashboardTab";
import UserInfoTab from "../../components/UserInfoTab/UserInfoTab";
import OrdersTab from "../../components/OrdersTab/OrdersTab";
import AccountSkeleton from "../../components/AccountSkeleton/AccountSkeleton";
import styles from "./AccountPage.module.css";

export default function AccountPage() {
  const account = useAccount();
  const { user, isInitialized, isAuthenticated } = account;

  useEffect(() => {
    document.title = "My Account | DRIFT";
  }, []);

  // Show skeleton while initializing auth
  if (!isInitialized || !isAuthenticated || !user) {
    return <AccountSkeleton />;
  }

  return (
    <main className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.layout}>
          {/* Sidebar */}
          <AccountSidebar
            user={user}
            activeTab={account.activeTab}
            onTabChange={account.handleTabChange}
            onLogout={account.handleLogoutAccount}
            getUserInitial={account.getUserInitial}
          />

          {/* Main content */}
          <section className={styles.content}>
            {account.activeTab === "dashboard" && (
              <DashboardTab
                user={user}
                orders={account.orders}
                cartItemCount={account.cartItemCount}
                onEditProfile={() => account.handleTabChange("userinfo")}
              />
            )}

            {account.activeTab === "userinfo" && (
              <UserInfoTab
                user={user}
                name={account.name}
                setName={account.setName}
                phone={account.phone}
                setPhone={account.setPhone}
                streetAddress={account.streetAddress}
                setStreetAddress={account.setStreetAddress}
                city={account.city}
                setCity={account.setCity}
                postalCode={account.postalCode}
                setPostalCode={account.setPostalCode}
                stateField={account.stateField}
                setStateField={account.setStateField}
                country={account.country}
                setCountry={account.setCountry}
                password={account.password}
                setPassword={account.setPassword}
                confirmPassword={account.confirmPassword}
                setConfirmPassword={account.setConfirmPassword}
                showPassword={account.showPassword}
                setShowPassword={account.setShowPassword}
                isSaving={account.isSaving}
                onSubmit={account.handleProfileSubmit}
              />
            )}

            {account.activeTab === "orders" && (
              <OrdersTab
                orders={account.orders}
                loading={account.loading}
                expandedOrderId={account.expandedOrderId}
                cancellingOrderId={account.cancellingOrderId}
                onToggleOrder={account.handleToggleOrder}
                onCancelOrder={account.handleCancelOrder}
                formatDate={account.formatDate}
                getTrackingStepIndex={account.getTrackingStepIndex}
              />
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
