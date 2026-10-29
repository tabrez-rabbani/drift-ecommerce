import { Plus, Image as ImageIcon, Loader2 } from "lucide-react";
import CategoryTableRow from "./CategoryTableRow";
import styles from "./CategoryTable.module.css";

export default function CategoryTable({
  categories,
  loading,
  updatingId,
  onAddClick,
  onEdit,
  onDelete,
  onQuickImageChange,
}) {
  return (
    <div className={styles.card}>
      <div className={styles.tableHeader}>
        <h2 className={styles.cardTitle}>
          All Categories ({categories.length})
        </h2>
      </div>

      {loading ? (
        <div className={styles.loadingState}>
          <Loader2 size={32} className={styles.spinner} />
          <p>Loading categories...</p>
        </div>
      ) : categories.length === 0 ? (
        <div className={styles.emptyState}>
          <ImageIcon size={48} className={styles.emptyIcon} />
          <p className={styles.emptyTitle}>No categories found</p>
          <p className={styles.emptyText}>
            Add your first category to have it display on the homepage slider.
          </p>
          <button
            type="button"
            className={styles.primaryBtn}
            onClick={onAddClick}
          >
            <Plus size={18} />
            <span>Add Category</span>
          </button>
        </div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.thThumbnail}>Thumbnail</th>
                <th>Name</th>
                <th>Slug</th>
                <th className={styles.thOrder}>Order</th>
                <th className={styles.thActions}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <CategoryTableRow
                  key={cat._id}
                  category={cat}
                  updatingId={updatingId}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onQuickImageChange={onQuickImageChange}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
