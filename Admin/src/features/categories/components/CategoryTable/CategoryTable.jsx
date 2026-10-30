import { Plus } from "lucide-react";
import CategoryTableRow from "./CategoryTableRow";
import styles from "./CategoryTable.module.css";

export default function CategoryTable({
  categories,
  loading,
  updatingId,
  isFormOpen,
  onAddClick,
  onEdit,
  onDelete,
  onQuickImageChange,
}) {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.titleWrapper}>
          <div className={styles.titleLine} />
          <h2 className={styles.cardTitle}>Categories List</h2>
        </div>
        {!isFormOpen && (
          <button
            type="button"
            className={styles.addBtn}
            onClick={onAddClick}
          >
            <Plus size={18} strokeWidth={2.5} />
            <span>Add Category</span>
          </button>
        )}
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Thumbnail</th>
              <th>Category Name</th>
              <th>Storefront Link</th>
              <th>Display Order</th>
              <th>Option</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className={styles.emptyState}>
                  Loading categories...
                </td>
              </tr>
            ) : categories.length === 0 ? (
              <tr>
                <td colSpan={5} className={styles.emptyState}>
                  No categories found. Click &quot;Add Category&quot; above to create one.
                </td>
              </tr>
            ) : (
              categories.map((cat) => (
                <CategoryTableRow
                  key={cat._id}
                  category={cat}
                  updatingId={updatingId}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onQuickImageChange={onQuickImageChange}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
