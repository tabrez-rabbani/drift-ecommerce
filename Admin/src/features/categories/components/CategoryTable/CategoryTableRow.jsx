import { useRef } from "react";
import { Edit3, Trash2, Upload, Image as ImageIcon, Loader2, ExternalLink } from "lucide-react";
import { STOREFRONT_URL } from "@/config/env";
import styles from "./CategoryTable.module.css";

export default function CategoryTableRow({
  category,
  updatingId,
  onEdit,
  onDelete,
  onQuickImageChange,
}) {
  const fileInputRef = useRef(null);
  const isUpdating = updatingId === category._id;
  const storefrontHref = STOREFRONT_URL
    ? `${STOREFRONT_URL}/collection/${category.slug}`
    : `/collection/${category.slug}`;

  return (
    <tr className={styles.tr}>
      <td className={styles.tdThumbnail}>
        <div className={styles.thumbWrapper}>
          {category.image ? (
            <img src={category.image} alt={category.name} className={styles.thumbImg} />
          ) : (
            <div className={styles.thumbPlaceholder}>
              <ImageIcon size={18} />
            </div>
          )}
          <button
            type="button"
            className={styles.quickUploadBtn}
            title="Quick update image"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUpdating}
          >
            {isUpdating ? (
              <Loader2 size={12} className={styles.spinner} />
            ) : (
              <Upload size={12} />
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className={styles.hiddenInput}
            onChange={(e) => onQuickImageChange(category._id, e)}
          />
        </div>
      </td>

      <td className={styles.tdName}>
        <span className={styles.categoryName}>{category.name}</span>
      </td>

      <td className={styles.tdSlug}>
        <a
          href={storefrontHref}
          target="_blank"
          rel="noreferrer"
          className={styles.slugLink}
          title="View on storefront"
        >
          <span>/collection/{category.slug}</span>
          <ExternalLink size={12} />
        </a>
      </td>

      <td className={styles.tdOrder}>
        <span className={styles.orderBadge}>#{category.order || 0}</span>
      </td>

      <td className={styles.tdActions}>
        <div className={styles.actionsGroup}>
          <button
            type="button"
            className={styles.actionBtn}
            onClick={() => onEdit(category)}
            title="Edit Category"
          >
            <Edit3 size={16} />
          </button>
          <button
            type="button"
            className={`${styles.actionBtn} ${styles.deleteBtn}`}
            onClick={() => onDelete(category)}
            title="Delete Category"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
}

