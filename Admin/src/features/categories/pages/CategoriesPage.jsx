import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "sonner";
import {
  fetchCategoriesApi,
  createCategoryApi,
  updateCategoryApi,
  deleteCategoryApi,
} from "../services/category.api";
import CategoryForm from "../components/CategoryForm/CategoryForm";
import CategoryTable from "../components/CategoryTable/CategoryTable";
import styles from "./CategoriesPage.module.css";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchCategoriesApi();
      if (isMountedRef.current && data?.success && Array.isArray(data.categories)) {
        setCategories(data.categories);
      }
    } catch (err) {
      if (isMountedRef.current) {
        toast.error(err.response?.data?.message || "Failed to load categories");
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const handleOpenAddForm = () => {
    setEditingCategory(null);
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleOpenEditForm = (category) => {
    setEditingCategory(category);
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
        const data = await updateCategoryApi(editingCategory._id, formData);
        if (data?.success) {
          toast.success("Category updated successfully");
          handleCloseForm();
          loadCategories();
        }
      } else {
        const data = await createCategoryApi(formData);
        if (data?.success) {
          toast.success("Category created successfully");
          handleCloseForm();
          loadCategories();
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save category");
    } finally {
      if (isMountedRef.current) {
        setSubmitting(false);
      }
    }
  };

  const handleQuickImageChange = async (categoryId, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUpdatingId(categoryId);
      const formData = new FormData();
      formData.append("image", file);

      const data = await updateCategoryApi(categoryId, formData);
      if (data?.success && data.category) {
        if (isMountedRef.current) {
          setCategories((prev) =>
            prev.map((c) => (c._id === categoryId ? { ...c, image: data.category.image } : c))
          );
        }
        toast.success("Category thumbnail updated");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update category image");
    } finally {
      if (isMountedRef.current) {
        setUpdatingId(null);
      }
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
            const data = await deleteCategoryApi(cat._id);
            if (data?.success) {
              if (isMountedRef.current) {
                setCategories((prev) => prev.filter((c) => c._id !== cat._id));
              }
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
        isFormOpen={isFormOpen}
        onAddClick={handleOpenAddForm}
        onEdit={handleOpenEditForm}
        onDelete={handleDelete}
        onQuickImageChange={handleQuickImageChange}
      />
    </div>
  );
}
