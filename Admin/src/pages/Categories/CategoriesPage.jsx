import { useState, useEffect } from "react";
import authApiInstance from "@/lib/axios";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import CategoryForm from "./components/CategoryForm/CategoryForm";
import CategoryTable from "./components/CategoryTable/CategoryTable";
import styles from "./CategoriesPage.module.css";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await authApiInstance.get("/categories");
      if (res.data?.success && Array.isArray(res.data.categories)) {
        setCategories(res.data.categories);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenAddForm = () => {
    setEditingCategory(null);
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (category) => {
    setEditingCategory(category);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setEditingCategory(null);
    setIsFormOpen(false);
  };

  const handleFormSubmit = async ({ name, order, file }) => {
    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append("name", name);
      formData.append("order", String(order));
      if (file) {
        formData.append("image", file);
      }

      if (editingCategory?._id) {
        const res = await authApiInstance.put(`/categories/${editingCategory._id}`, formData);
        if (res.data?.success) {
          toast.success("Category updated successfully");
          handleCloseForm();
          fetchCategories();
        }
      } else {
        const res = await authApiInstance.post("/categories", formData);
        if (res.data?.success) {
          toast.success("Category created successfully");
          handleCloseForm();
          fetchCategories();
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save category");
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickImageChange = async (categoryId, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUpdatingId(categoryId);
      const formData = new FormData();
      formData.append("image", file);

      const res = await authApiInstance.put(`/categories/${categoryId}`, formData);
      if (res.data?.success && res.data.category) {
        setCategories((prev) =>
          prev.map((c) => (c._id === categoryId ? { ...c, image: res.data.category.image } : c))
        );
        toast.success("Category thumbnail updated");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update category image");
    } finally {
      setUpdatingId(null);
      if (e.target) e.target.value = "";
    }
  };

  const handleDelete = (cat) => {
    toast(`Delete category "${cat.name}"?`, {
      description: "This category and its link will be removed from storefront.",
      action: {
        label: "Delete",
        onClick: async () => {
          try {
            const res = await authApiInstance.delete(`/categories/${cat._id}`);
            if (res.data?.success) {
              setCategories((prev) => prev.filter((c) => c._id !== cat._id));
              toast.success("Category deleted");
            }
          } catch (err) {
            toast.error(err.response?.data?.message || "Failed to delete category");
          }
        },
      },
      cancel: {
        label: "Cancel",
        onClick: () => {},
      },
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <div className={styles.titleWrapper}>
            <div className={styles.titleLine} />
            <h1 className={styles.title}>Categories</h1>
          </div>
          <p className={styles.subtitle}>
            Manage product categories, upload thumbnails, and arrange slider order on the homepage.
          </p>
        </div>

        {!isFormOpen && (
          <button
            type="button"
            className={styles.primaryBtn}
            onClick={handleOpenAddForm}
          >
            <Plus size={18} />
            <span>Add Category</span>
          </button>
        )}
      </div>

      {isFormOpen && (
        <CategoryForm
          initialData={editingCategory}
          submitting={submitting}
          onSubmit={handleFormSubmit}
          onClose={handleCloseForm}
        />
      )}

      <CategoryTable
        categories={categories}
        loading={loading}
        updatingId={updatingId}
        onAddClick={handleOpenAddForm}
        onEdit={handleOpenEditForm}
        onDelete={handleDelete}
        onQuickImageChange={handleQuickImageChange}
      />
    </div>
  );
}
