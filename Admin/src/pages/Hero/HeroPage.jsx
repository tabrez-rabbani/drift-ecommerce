import { useState, useEffect, useRef } from "react";
import authApiInstance from "@/lib/axios";
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Upload, 
  Image as ImageIcon, 
  Loader2, 
  X,
} from "lucide-react";
import { toast } from "sonner";
import styles from "./HeroAdmin.module.css";

export default function HeroPage() {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [title, setTitle] = useState("");
  const [ctaLink, setCtaLink] = useState("");
  const [order, setOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);

  const [desktopFile, setDesktopFile] = useState(null);
  const [desktopPreview, setDesktopPreview] = useState(null);
  const [currentDesktopUrl, setCurrentDesktopUrl] = useState("");

  const [mobileFile, setMobileFile] = useState(null);
  const [mobilePreview, setMobilePreview] = useState(null);
  const [currentMobileUrl, setCurrentMobileUrl] = useState("");

  const desktopInputRef = useRef(null);
  const mobileInputRef = useRef(null);
  const formRef = useRef(null);

  const fetchSlides = async () => {
    try {
      setLoading(true);
      const res = await authApiInstance.get("/hero/admin/all");
      if (res.data?.success) {
        setSlides(res.data.slides || []);
      }
    } catch (err) {
      console.error("Failed to fetch hero banners", err);
      toast.error(err.response?.data?.message || "Failed to load hero banners");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  useEffect(() => {
    return () => {
      if (desktopPreview && desktopPreview.startsWith("blob:")) {
        URL.revokeObjectURL(desktopPreview);
      }
      if (mobilePreview && mobilePreview.startsWith("blob:")) {
        URL.revokeObjectURL(mobilePreview);
      }
    };
  }, [desktopPreview, mobilePreview]);

  const resetForm = () => {
    if (desktopPreview && desktopPreview.startsWith("blob:")) {
      URL.revokeObjectURL(desktopPreview);
    }
    if (mobilePreview && mobilePreview.startsWith("blob:")) {
      URL.revokeObjectURL(mobilePreview);
    }

    setEditingId(null);
    setTitle("");
    setCtaLink("");
    setOrder(0);
    setIsActive(true);

    setDesktopFile(null);
    setDesktopPreview(null);
    setCurrentDesktopUrl("");

    setMobileFile(null);
    setMobilePreview(null);
    setCurrentMobileUrl("");

    if (desktopInputRef.current) desktopInputRef.current.value = "";
    if (mobileInputRef.current) mobileInputRef.current.value = "";
    setIsFormOpen(false);
  };

  const handleEditClick = (slide) => {
    if (desktopPreview && desktopPreview.startsWith("blob:")) {
      URL.revokeObjectURL(desktopPreview);
    }
    if (mobilePreview && mobilePreview.startsWith("blob:")) {
      URL.revokeObjectURL(mobilePreview);
    }

    setEditingId(slide._id);
    setTitle(slide.title || "");
    setCtaLink(slide.ctaLink || "");
    setOrder(slide.order ?? 0);
    setIsActive(slide.isActive ?? true);

    setDesktopFile(null);
    setDesktopPreview(null);
    setCurrentDesktopUrl(slide.desktopImage || "");

    setMobileFile(null);
    setMobilePreview(null);
    setCurrentMobileUrl(slide.mobileImage || "");

    setIsFormOpen(true);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handleDesktopFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (desktopPreview && desktopPreview.startsWith("blob:")) {
        URL.revokeObjectURL(desktopPreview);
      }
      setDesktopFile(file);
      setDesktopPreview(URL.createObjectURL(file));
    }
  };

  const handleMobileFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (mobilePreview && mobilePreview.startsWith("blob:")) {
        URL.revokeObjectURL(mobilePreview);
      }
      setMobileFile(file);
      setMobilePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.warning("Please enter a title/name for the slide banner");
      return;
    }

    if (!editingId && !desktopFile) {
      toast.warning("Please upload a banner image");
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("ctaLink", ctaLink.trim());
      formData.append("order", String(order));
      formData.append("isActive", String(isActive));
      formData.append("eyebrow", "");
      formData.append("description", "");
      formData.append("ctaText", "");
      formData.append("ratingText", "");
      formData.append("showSocialProof", "false");

      if (desktopFile) {
        formData.append("desktopImage", desktopFile);
      } else if (currentDesktopUrl) {
        formData.append("desktopImage", currentDesktopUrl);
      }

      if (mobileFile) {
        formData.append("mobileImage", mobileFile);
      } else if (currentMobileUrl) {
        formData.append("mobileImage", currentMobileUrl);
      }

      let res;
      if (editingId) {
        res = await authApiInstance.put(`/hero/${editingId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        toast.success("Hero slide updated successfully!");
      } else {
        res = await authApiInstance.post("/hero", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        toast.success("New Hero slide uploaded successfully!");
      }

      if (res.data?.success) {
        resetForm();
        fetchSlides();
      }
    } catch (err) {
      console.error("Save hero error", err);
      toast.error(err.response?.data?.message || "Failed to save hero slide");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    setSlides((prev) =>
      prev.map((s) => (s._id === id ? { ...s, isActive: !currentStatus } : s))
    );

    try {
      const res = await authApiInstance.patch(`/hero/${id}/toggle`);
      if (res.data?.success) {
        toast.success(res.data.message || "Slide visibility updated");
      }
    } catch (err) {
      setSlides((prev) =>
        prev.map((s) => (s._id === id ? { ...s, isActive: currentStatus } : s))
      );
      toast.error(err.response?.data?.message || "Failed to update status");
    }
  };

  const handleDelete = async (id, slideTitle) => {
    if (!window.confirm(`Are you sure you want to delete slide "${slideTitle}"?`)) {
      return;
    }

    try {
      const res = await authApiInstance.delete(`/hero/${id}`);
      if (res.data?.success) {
        setSlides((prev) => prev.filter((s) => s._id !== id));
        toast.success("Hero slide deleted successfully!");
        if (editingId === id) resetForm();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete hero slide");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleWrapper}>
          <div className={styles.titleLine} />
          <div>
            <h1 className={styles.title}>Hero Section Banners</h1>
            <p className={styles.subtitle}>
              Upload and manage dynamic full-width slider images for the storefront homepage.
            </p>
          </div>
        </div>

        {!isFormOpen && (
          <button
            type="button"
            className={styles.primaryBtn}
            onClick={() => {
              resetForm();
              setIsFormOpen(true);
            }}
          >
            <Plus size={18} />
            <span>Add New Slide</span>
          </button>
        )}
      </div>

      {isFormOpen && (
        <div className={styles.formCard} ref={formRef}>
          <div className={styles.formHeader}>
            <h2 className={styles.formTitle}>
              {editingId ? "Edit Hero Slide" : "Upload New Hero Slide"}
            </h2>
            <button
              type="button"
              className={styles.closeBtn}
              onClick={resetForm}
              aria-label="Close form"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Slide Name / Title <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  className={styles.input}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Summer Drop 01, Denim Trend..."
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Redirect Link (Optional)
                </label>
                <input
                  type="text"
                  className={styles.input}
                  value={ctaLink}
                  onChange={(e) => setCtaLink(e.target.value)}
                  placeholder="e.g. /collection or /collection/shirts"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Display Order (Slide Priority)
                </label>
                <input
                  type="number"
                  className={styles.input}
                  value={order}
                  onChange={(e) => setOrder(Number(e.target.value))}
                  placeholder="0, 1, 2... (lower number slides first)"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Visibility</label>
                <div style={{ paddingTop: "14px" }}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      className={styles.checkbox}
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                    />
                    <span>Slide Active (Visible on Storefront Homepage)</span>
                  </label>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Desktop Image (Landscape / Full Width) <span className={styles.required}>*</span>
                </label>
                <input
                  type="file"
                  ref={desktopInputRef}
                  onChange={handleDesktopFileChange}
                  accept="image/*"
                  className={styles.hiddenInput}
                />

                {desktopPreview || currentDesktopUrl ? (
                  <div className={styles.previewWrapper}>
                    <img
                      src={desktopPreview || currentDesktopUrl}
                      alt="Desktop Banner Preview"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <button
                      type="button"
                      className={styles.removeImgBtn}
                      onClick={() => {
                        if (desktopPreview && desktopPreview.startsWith("blob:")) {
                          URL.revokeObjectURL(desktopPreview);
                        }
                        setDesktopFile(null);
                        setDesktopPreview(null);
                        setCurrentDesktopUrl("");
                        if (desktopInputRef.current) desktopInputRef.current.value = "";
                      }}
                      title="Remove image"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <div
                    className={styles.dropzone}
                    onClick={() => desktopInputRef.current?.click()}
                  >
                    <Upload size={24} className={styles.dropzoneIcon} />
                    <span className={styles.dropzoneText}>Upload Slide Image</span>
                    <span className={styles.dropzoneSubtext}>Recommended: 1920x800 or high resolution (PNG/JPG/WEBP)</span>
                  </div>
                )}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Mobile Image (Optional Vertical/Crop)
                </label>
                <input
                  type="file"
                  ref={mobileInputRef}
                  onChange={handleMobileFileChange}
                  accept="image/*"
                  className={styles.hiddenInput}
                />

                {mobilePreview || currentMobileUrl ? (
                  <div className={styles.previewWrapperMobile}>
                    <img
                      src={mobilePreview || currentMobileUrl}
                      alt="Mobile Banner Preview"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <button
                      type="button"
                      className={styles.removeImgBtn}
                      onClick={() => {
                        if (mobilePreview && mobilePreview.startsWith("blob:")) {
                          URL.revokeObjectURL(mobilePreview);
                        }
                        setMobileFile(null);
                        setMobilePreview(null);
                        setCurrentMobileUrl("");
                        if (mobileInputRef.current) mobileInputRef.current.value = "";
                      }}
                      title="Remove image"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <div
                    className={styles.dropzoneMobile}
                    onClick={() => mobileInputRef.current?.click()}
                  >
                    <Upload size={22} className={styles.dropzoneIconSecondary} />
                    <span className={styles.dropzoneText}>Upload Mobile Image</span>
                    <span className={styles.dropzoneSubtext}>Optional (defaults to desktop)</span>
                  </div>
                )}
              </div>
            </div>

            <div className={styles.formActions}>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={resetForm}
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={styles.submitBtn}
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 size={16} className={styles.spinner} />
                    <span>Saving Slide...</span>
                  </>
                ) : (
                  <span>{editingId ? "Update Slide" : "Upload Slide"}</span>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className={styles.card}>
        {loading ? (
          <div className={styles.emptyState}>
            <Loader2 size={32} className={styles.spinner} />
            <p>Loading hero slides...</p>
          </div>
        ) : slides.length === 0 ? (
          <div className={styles.emptyState}>
            <ImageIcon size={44} className={styles.emptyIcon} />
            <p>No custom hero slides uploaded yet. The storefront is using default hero slides.</p>
            <button
              type="button"
              className={styles.primaryBtn}
              onClick={() => setIsFormOpen(true)}
            >
              <Plus size={16} />
              <span>Upload First Slide</span>
            </button>
          </div>
        ) : (
          <div className={styles.slidesGrid}>
            {slides.map((slide) => (
              <div
                key={slide._id}
                className={`${styles.slideCard} ${!slide.isActive ? styles["slideCard--inactive"] : ""}`}
              >
                <div className={styles.slideBanner}>
                  <img
                    src={slide.desktopImage}
                    alt={slide.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  <div className={styles.slideBadges}>
                    {slide.isActive ? (
                      <span className={styles.badgeActive}>Active</span>
                    ) : (
                      <span className={styles.badgeInactive}>Hidden</span>
                    )}
                    <span className={styles.badgeOrder}>Order #{slide.order ?? 0}</span>
                  </div>
                </div>

                <div className={styles.slideContent}>
                  <h3 className={styles.slideTitle}>{slide.title}</h3>

                  <div className={styles.slideMeta}>
                    <div className={styles.metaRow}>
                      <span className={styles.metaLabel}>Redirect Link</span>
                      {slide.ctaLink ? (
                        <span className={styles.metaLink}>{slide.ctaLink}</span>
                      ) : (
                        <span className={styles.metaValue} style={{ color: "#6b7280" }}>None</span>
                      )}
                    </div>
                    {slide.mobileImage && slide.mobileImage !== slide.desktopImage && (
                      <div className={styles.metaRow}>
                        <span className={styles.metaLabel}>Mobile Image</span>
                        <span className={styles.metaValue} style={{ color: "#22c55e" }}>Uploaded</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className={styles.slideFooter}>
                  <label className={styles.toggleSwitch} title="Toggle active status">
                    <input
                      type="checkbox"
                      checked={slide.isActive}
                      onChange={() => handleToggleStatus(slide._id, slide.isActive)}
                      className={styles.checkbox}
                    />
                    <span>{slide.isActive ? "Visible" : "Hidden"}</span>
                  </label>

                  <div className={styles.actionBtns}>
                    <button
                      type="button"
                      className={styles.iconBtn}
                      onClick={() => handleEditClick(slide)}
                      title="Edit slide"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      type="button"
                      className={`${styles.iconBtn} ${styles.deleteBtn}`}
                      onClick={() => handleDelete(slide._id, slide.title)}
                      title="Delete slide"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
