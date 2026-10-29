import styles from "./StatusBadge.module.css";

const COLOR_MAP = {
  delivered: "green",
  completed: "green",
  instock: "green",
  active: "green",
  success: "green",

  cancelled: "red",
  failed: "red",
  outofstock: "red",
  inactive: "red",
  danger: "red",

  shipped: "blue",
  info: "blue",

  processing: "amber",
  warning: "amber",

  placed: "purple",
  pending: "purple",
};

export default function StatusBadge({ status = "", variant, label, className = "" }) {
  const normalized = (status || "").toLowerCase().replace(/\s+/g, "");
  const color = variant || COLOR_MAP[normalized] || "gray";
  const displayLabel = label || status || "-";

  return (
    <span className={`${styles.badge} ${styles[color] || styles.gray} ${className}`.trim()}>
      {displayLabel}
    </span>
  );
}

