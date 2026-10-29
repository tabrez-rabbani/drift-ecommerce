import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useCheckout } from "../../hooks/useCheckout";
import AddressCard from "../../components/AddressCard/AddressCard";
import PaymentCard from "../../components/PaymentCard/PaymentCard";
import OrderSummary from "../../components/OrderSummary/OrderSummary";
import OrderSuccessCard from "../../components/OrderSuccessCard/OrderSuccessCard";
import CheckoutSkeleton from "../../components/CheckoutSkeleton/CheckoutSkeleton";
import styles from "./CheckoutPage.module.css";

export default function CheckoutPage() {
  const checkout = useCheckout();

  if (!checkout.isInitialized) {
    return (
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.verifyingSession}>
            <div className={styles.verifyingSpinner} />
            <p className={styles.verifyingText}>Verifying session...</p>
          </div>
        </div>
      </main>
    );
  }

  if (!checkout.isAuthenticated) return null;

  if (checkout.orderSuccess) {
    return (
      <main className={styles.main}>
        <div className={styles.container}>
          <OrderSuccessCard order={checkout.orderSuccess} />
        </div>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.checkoutHeader}>
          <Link to="/cart" className={styles.backLink}>
            <ArrowLeft size={16} /> Return to Cart
          </Link>
          <h1 className={styles.checkoutTitle}>Checkout</h1>
        </div>

        {checkout.cartLoading && checkout.items.length === 0 ? (
          <CheckoutSkeleton />
        ) : checkout.items.length === 0 ? (
          <div className={styles.emptyState}>
            <h2 className={styles.emptyTitle}>Your cart is empty</h2>
            <p className={styles.emptyText}>
              Add some items to your bag before proceeding to checkout.
            </p>
            <Link to="/collection" className={styles.emptyBtn}>
              Explore Collection
            </Link>
          </div>
        ) : (
          <div className={styles.checkoutLayout}>
            <div className={styles.mainColumn}>
              <AddressCard
                shippingAddress={checkout.shippingAddress}
                isEditingAddress={checkout.isEditingAddress}
                setIsEditingAddress={checkout.setIsEditingAddress}
                formErrors={checkout.formErrors}
                handleInputChange={checkout.handleInputChange}
                handleSaveAddress={checkout.handleSaveAddress}
              />
              <PaymentCard
                paymentMethod={checkout.paymentMethod}
                setPaymentMethod={checkout.setPaymentMethod}
              />
            </div>

            <div className={styles.summarySidebar}>
              <OrderSummary
                items={checkout.items}
                subtotal={checkout.subtotal}
                deliveryCharge={checkout.deliveryCharge}
                total={checkout.total}
                serverError={checkout.serverError}
                isPlacingOrder={checkout.isPlacingOrder}
                paymentMethod={checkout.paymentMethod}
                handlePlaceOrder={checkout.handlePlaceOrder}
              />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}


