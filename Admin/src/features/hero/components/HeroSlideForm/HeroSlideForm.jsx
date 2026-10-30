import { useState, useEffect, useRef } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import styles from "./HeroSlideForm.module.css";

export default function HeroSlideForm({
  editingSlide,
  submitting,
  onSubmit,
  onCancel,
}) {
  const [title, setTitle] = useState(editingSlide?.title || "");
  const [ctaLink, setCtaLink] = useState(editingSlide?.ctaLink || "");
  const [order, setOrder] = useState(editingSlide?.order ?? 0);
  const [isActive, setIsActive] = useState(editingSlide?.isActive ?? true);

  const [desktopFile, setDesktopFile] = useState(null);
  const [desktopPreview, setDesktopPreview] = useState(null);
  const [currentDesktopUrl, setCurrentDesktopUrl] = useState(
    editingSlide?.desktopImage || ""
  );

  const [mobileFile, setMobileFile] = useState(null);
  const [mobilePreview, setMobilePreview] = useState(null);
  const [currentMobileUrl, setCurrentMobileUrl] = useState(
    editingSlide?.mobileImage || ""
  );

  const desktopInputRef = useRef(null);
  const mobileInputRef = useRef(null);

  useEffect(() => {
    setTitle(editingSlide?.title || "");
    setCtaLink(editingSlide?.ctaLink || "");
    setOrder(editingSlide?.order ?? 0);
    setIsActive(editingSlide?.isActive ?? true);
    setCurrentDesktopUrl(editingSlide?.desktopImage || "");
    setCurrentMobileUrl(editingSlide?.mobileImage || "");
    setDesktopFile(null);
    setDesktopPreview(null);
    setMobileFile(null);
    setMobilePreview(null);
  }, [editingSlide]);

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

  const handleRemoveDesktop = () => {
    if (desktopPreview && desktopPreview.startsWith("blob:")) {
      URL.revokeObjectURL(desktopPreview);
    }
    setDesktopFile(null);
    setDesktopPreview(null);
    setCurrentDesktopUrl("");
    if (desktopInputRef.current) desktopInputRef.current.value = "";
  };

  const handleRemoveMobile = () => {
    if (mobilePreview && mobilePreview.startsWith("blob:")) {
      URL.revokeObjectURL(mobilePreview);
    }
    setMobileFile(null);
    setMobilePreview(null);
    setCurrentMobileUrl("");
    if (mobileInputRef.current) mobileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.warning("Please enter a title for the slide banner");
      return;
    }

    if (!desktopFile && !currentDesktopUrl) {
      toast.warning("Please upload a desktop banner image");
      return;
    }

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

    const success = await onSubmit(formData, editingSlide?._id);
    if (success) {
      handleRemoveDesktop();
      handleRemoveMobile();
      onCancel();
    }
  };

  return (
    <div className={styles.formCard}>
      <div className={styles.formHeader}>
        <h2 className={styles.formTitle}>
          {editingSlide ? "Edit Hero Slide" : "Upload New Hero Slide"}
        </h2>
        <button
          type="button"
          className={styles.closeBtn}
          onClick={onCancel}
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
            <label className={styles.label}>Redirect Link (Optional)</label>
            <input
              type="text"
              className={styles.input}
              value={ctaLink}
              onChange={(e) => setCtaLink(e.target.value)}
              placeholder="e.g. /collection or /collection/shirts"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Display Order (Priority)</label>
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
            <div className={styles.checkboxContainer}>
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
              Desktop Image (Landscape / Full Width){" "}
              <span className={styles.required}>*</span>
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
                  className={styles.previewImg}
                />
                <button
                  type="button"
                  className={styles.removeImgBtn}
                  onClick={handleRemoveDesktop}
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
                <span className={styles.dropzoneSubtext}>
                  Recommended: 1920x800 or high resolution (PNG/JPG/WEBP)
                </span>
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
                  className={styles.previewImg}
                />
                <button
                  type="button"
                  className={styles.removeImgBtn}
                  onClick={handleRemoveMobile}
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
                <span className={styles.dropzoneSubtext}>
                  Optional (defaults to desktop)
                </span>
              </div>
            )}
          </div>
        </div>

        <div className={styles.formActions}>
          <button
            type="button"
            className={styles.cancelBtn}
            onClick={onCancel}
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
              <span>{editingSlide ? "Update Slide" : "Upload Slide"}</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
