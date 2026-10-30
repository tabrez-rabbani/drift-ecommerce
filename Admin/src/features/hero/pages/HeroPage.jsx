import { useState, useRef } from "react";
import { Plus, Image as ImageIcon, Loader2 } from "lucide-react";
import { useHeroSlides } from "../hooks/useHeroSlides";
import HeroSlideCard from "../components/HeroSlideCard/HeroSlideCard";
import HeroSlideForm from "../components/HeroSlideForm/HeroSlideForm";
import styles from "./HeroPage.module.css";

export default function HeroPage() {
  const {
    slides,
    loading,
    submitting,
    saveSlide,
    toggleStatus,
    deleteSlide,
  } = useHeroSlides();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState(null);
  const formRef = useRef(null);

  const handleOpenCreate = () => {
    setEditingSlide(null);
    setIsFormOpen(true);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handleEdit = (slide) => {
    setEditingSlide(slide);
    setIsFormOpen(true);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingSlide(null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerCard}>
        <div className={styles.headerLeft}>
          <div className={styles.titleWrapper}>
            <div className={styles.titleLine} />
            <div>
              <h1 className={styles.title}>Hero Section Banners</h1>
              <p className={styles.subtitle}>
                Upload and manage dynamic full-width slider images for the storefront homepage.
              </p>
            </div>
          </div>
        </div>

        <div className={styles.headerActions}>
          <div className={styles.statsPill}>
            <ImageIcon size={16} />
            <span>Total Slides:</span>
            <span className={styles.statsCount}>{slides.length}</span>
          </div>

          {!isFormOpen && (
            <button
              type="button"
              className={styles.addBtn}
              onClick={handleOpenCreate}
            >
              <Plus size={18} />
              <span>Add New Slide</span>
            </button>
          )}
        </div>
      </div>

      <div ref={formRef}>
        {isFormOpen && (
          <HeroSlideForm
            editingSlide={editingSlide}
            submitting={submitting}
            onSubmit={saveSlide}
            onCancel={handleCloseForm}
          />
        )}
      </div>

      <div className={styles.contentCard}>
        {loading ? (
          <div className={styles.emptyState}>
            <Loader2 size={36} className={styles.spinner} />
            <p>Loading hero slides...</p>
          </div>
        ) : slides.length === 0 ? (
          <div className={styles.emptyState}>
            <ImageIcon size={48} className={styles.emptyIcon} />
            <p className={styles.emptyStateText}>
              No custom hero slides uploaded yet. The storefront is using default hero slides.
            </p>
            <button
              type="button"
              className={styles.addBtn}
              onClick={handleOpenCreate}
            >
              <Plus size={16} />
              <span>Upload First Slide</span>
            </button>
          </div>
        ) : (
          <div className={styles.slidesGrid}>
            {slides.map((slide) => (
              <HeroSlideCard
                key={slide._id}
                slide={slide}
                onEdit={handleEdit}
                onToggle={toggleStatus}
                onDelete={deleteSlide}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
