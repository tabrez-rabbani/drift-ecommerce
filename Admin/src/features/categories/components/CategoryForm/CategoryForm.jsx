import { useState, useEffect, useRef } from "react";
import { Upload, Image as ImageIcon, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import styles from "./CategoryForm.module.css";

export default function CategoryForm({ initialData, submitting, onSubmit, onClose }) {
  const [name, setName] = useState(initialData?.name || "");
  const [order, setOrder] = useState(initialData?.order ?? 0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const currentImageUrl = initialData?.image || "";

  const fileInputRef = useRef(null);

  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (PNG, JPG, WEBP)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    setSelectedFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleClearImage = () => {
    if (imagePreview && imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }
    setSelectedFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Category name is required");
      return;
    }

    onSubmit({
      name: name.trim(),
      order: Number(order || 0),
      file: selectedFile,
    });
  };

  return (
    <div className={styles.formCard}>
      <div className={styles.formCardHeader}>
        <div className={styles.titleWrapper}>
          <div className={styles.titleLine} />
          <h2 className={styles.formCardTitle}>
            {initialData?._id ? "Edit Category" : "Add New Category"}
          </h2>
        </div>
        <button
          type="button"
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close form"
        >
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Category Name *</label>
          <div className={styles.inputWrapper}>
            <input
              type="text"
              className={styles.input}
              placeholder="e.g. SHIRTS, JEANS, SNEAKERS"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Display Order</label>
          <div className={styles.inputWrapper}>
            <input
              type="number"
              className={styles.input}
              placeholder="0, 1, 2..."
              value={order}
              onChange={(e) => setOrder(e.target.value)}
            />
          </div>
        </div>

        <div className={`${styles.formGroup} ${styles.formGroupTop}`}>
          <label className={`${styles.label} ${styles.labelTop}`}>Category Thumbnail</label>
          <div className={styles.inputWrapper}>
            <div className={styles.uploadArea}>
              <div className={styles.previewBox}>
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className={styles.previewImage} />
                ) : currentImageUrl ? (
                  <img src={currentImageUrl} alt="Current" className={styles.previewImage} />
                ) : (
                  <div className={styles.placeholderBox}>
                    <ImageIcon size={28} />
                    <span>No image</span>
                  </div>
                )}
              </div>

              <div className={styles.uploadControls}>
                <button
                  type="button"
                  className={styles.uploadBtn}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload size={16} />
                  <span>{selectedFile || currentImageUrl ? "Change Image" : "Upload Image"}</span>
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className={styles.hiddenInput}
                  onChange={handleFileChange}
                />

                {selectedFile && (
                  <button
                    type="button"
                    className={styles.removeImageBtn}
                    onClick={handleClearImage}
                  >
                    Clear Selection
                  </button>
                )}
                <span className={styles.uploadHint}>
                  Recommended: Transparent PNG or WebP (800x898 ratio). Max 5MB.
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.formActions}>
          <button
            type="button"
            className={styles.cancelBtn}
            onClick={onClose}
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={styles.submitBtn}
            disabled={submitting || !name.trim()}
          >
            {submitting ? (
              <>
                <Loader2 size={16} className={styles.spinner} />
                <span>Saving...</span>
              </>
            ) : (
              <span>{initialData?._id ? "Update Category" : "Save Category"}</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
