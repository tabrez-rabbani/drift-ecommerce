import { useRef } from "react";
import { Pencil, Trash2, Upload, Image as ImageIcon, Loader2, ExternalLink } from "lucide-react";
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
    <tr>
      <td>
        <div className={styles.thumbWrapper}>
          {category.image ? (
            <img src={category.image} alt={category.name} className={styles.thumbImg} />
          ) : (
            <div className={styles.thumbPlaceholder}>
              <ImageIcon size={20} />
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
              <Loader2 size={14} className={styles.spinner} />
            ) : (
              <Upload size={14} />
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

      <td>
        <span className={styles.categoryName}>{category.name}</span>
      </td>

      <td>
        <a
          href={storefrontHref}
          target="_blank"
          rel="noreferrer"
          className={styles.slugLink}
          title="View on storefront"
        >
          <span>/collection/{category.slug}</span>
          <ExternalLink size={14} />
        </a>
      </td>

      <td>
        <span className={styles.orderBadge}>#{category.order || 0}</span>
      </td>

      <td>
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.iconBtnEdit}
            onClick={() => onEdit(category)}
            title="Edit Category"
          >
            <Pencil size={18} />
          </button>
          <button
            type="button"
            className={styles.iconBtnDelete}
            onClick={() => onDelete(category)}
            title="Delete Category"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
}
