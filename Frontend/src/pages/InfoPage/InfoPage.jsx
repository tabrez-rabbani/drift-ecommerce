import { useParams, Link } from "react-router-dom";
import styles from "./InfoPage.module.css";

const INFO_DATA = {
  "privacy-policy": {
    title: "Privacy Policy",
    updated: "Last updated: October 2026",
    sections: [
      {
        heading: "1. Information We Collect",
        text: "We collect information you provide directly to us when creating an account, making a purchase, or communicating with customer service. This includes your name, email address, shipping address, and phone number.",
      },
      {
        heading: "2. How We Use Your Information",
        text: "Your data is used strictly to process orders, manage deliveries, prevent fraudulent transactions, and send essential order status notifications.",
      },
      {
        heading: "3. Payment & Data Security",
        text: "DRIFT does not store payment card details on its servers. All payments are encrypted and processed through secure, RBI-compliant payment gateways.",
      },
    ],
  },
  "refund-policy": {
    title: "Refund & Return Policy",
    updated: "Last updated: October 2026",
    sections: [
      {
        heading: "1. 15-Day Hassle-Free Returns",
        text: "We offer a 15-day return window from the date of delivery. Items must be unused, unwashed, and in their original packaging with tags intact.",
      },
      {
        heading: "2. Refund Processing",
        text: "Once your returned item passes quality inspection at our warehouse, the refund is initiated within 48 hours to your original payment method.",
      },
      {
        heading: "3. Exchanges",
        text: "Need a different size or color? You can request an exchange through your account dashboard or by contacting customer support.",
      },
    ],
  },
  "shipping-policy": {
    title: "Shipping & Delivery Policy",
    updated: "Last updated: October 2026",
    sections: [
      {
        heading: "1. Free Shipping",
        text: "We provide Free Standard Shipping on all prepaid and COD orders over ₹999 across India.",
      },
      {
        heading: "2. Estimated Delivery Time",
        text: "Metro cities typically receive orders within 2 to 4 business days. Regional and remote pin codes take 4 to 7 business days.",
      },
      {
        heading: "3. Order Tracking",
        text: "A tracking link and AWB number are automatically sent via SMS and email as soon as your shipment is dispatched.",
      },
    ],
  },
  "terms-of-service": {
    title: "Terms of Service",
    updated: "Last updated: October 2026",
    sections: [
      {
        heading: "1. Acceptance of Terms",
        text: "By accessing and using DRIFT, you agree to comply with and be bound by these terms, applicable laws, and regulations.",
      },
      {
        heading: "2. Product Availability & Pricing",
        text: "All product prices and availability are subject to change without prior notice. We reserve the right to correct any typographical or pricing errors.",
      },
      {
        heading: "3. User Conduct",
        text: "You agree not to misuse our website or attempt unauthorized access to our systems, servers, or connected databases.",
      },
    ],
  },
  "faq": {
    title: "Frequently Asked Questions",
    updated: "Last updated: October 2026",
    sections: [
      {
        heading: "How do I track my order?",
        text: "You can track your active orders by navigating to your Account Dashboard under the 'Orders' tab, or using the tracking link emailed upon dispatch.",
      },
      {
        heading: "What payment methods are supported?",
        text: "We accept all major credit/debit cards, UPI (Google Pay, PhonePe, Paytm), Net Banking, and Cash on Delivery (COD).",
      },
      {
        heading: "Can I cancel my order?",
        text: "Orders can be cancelled from your account dashboard before they are processed and dispatched by our logistics partner.",
      },
    ],
  },
  "about-us": {
    title: "About DRIFT",
    updated: "Modern Menswear Crafted for Everyday Luxury",
    sections: [
      {
        heading: "Our Philosophy",
        text: "DRIFT is an independent fashion label focused on contemporary apparel, premium materials, and timeless aesthetics. We craft garments that seamlessly transition from work to weekend.",
      },
      {
        heading: "Quality First",
        text: "From our heavyweight cotton tees to precision-tailored trousers, every piece undergoes rigorous fabric testing and finishing.",
      },
    ],
  },
  "contact": {
    title: "Contact & Customer Care",
    updated: "We're here to help you Monday through Saturday, 9 AM - 7 PM IST",
    sections: [
      {
        heading: "Customer Support",
        text: "For questions about orders, shipping, or returns, email us at support@driftfashion.com or call +91 (800) 123-4567.",
      },
      {
        heading: "Corporate Address",
        text: "DRIFT Apparel Private Limited, Indiranagar 100ft Road, Bengaluru, Karnataka, 560038, India.",
      },
    ],
  },
  "size-chart": {
    title: "Size Chart & Fit Guide",
    updated: "Measurement Guide (in Inches)",
    sections: [
      {
        heading: "Shirts & T-Shirts",
        text: "Small (S): Chest 38, Length 27 | Medium (M): Chest 40, Length 28 | Large (L): Chest 42, Length 29 | Extra Large (XL): Chest 44, Length 30.",
      },
      {
        heading: "Trousers & Jeans",
        text: "Sizes correspond to waist measurements in inches: 30, 32, 34, 36, and 38 with standard regular and tapered leg inseams.",
      },
    ],
  },
};

export default function InfoPage() {
  const { slug } = useParams();
  const page = INFO_DATA[slug] || INFO_DATA["about-us"];

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link to="/" className={styles.breadcrumbLink}>Home</Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span className={styles.breadcrumbCurrent}>{page.title}</span>
        </nav>

        <article className={styles.card}>
          <h1 className={styles.title}>{page.title}</h1>
          <p className={styles.updated}>{page.updated}</p>

          <div className={styles.content}>
            {page.sections.map((section, idx) => (
              <section key={idx} className={styles.section}>
                <h2 className={styles.sectionTitle}>{section.heading}</h2>
                <p className={styles.paragraph}>{section.text}</p>
              </section>
            ))}
          </div>

          <div className={styles.backBtnWrap}>
            <Link to="/collection" className={styles.backBtn}>
              Continue Shopping
            </Link>
          </div>
        </article>
      </div>
    </main>
  );
}
