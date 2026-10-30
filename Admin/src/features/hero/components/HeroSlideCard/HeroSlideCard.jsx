import { Pencil, Trash2 } from "lucide-react";
import styles from "./HeroSlideCard.module.css";

export default function HeroSlideCard({ slide, onEdit, onToggle, onDelete }) {
  const isInactive = !slide.isActive;
  const hasDistinctMobile =
    Boolean(slide.mobileImage) && slide.mobileImage !== slide.desktopImage;

  return (
    <div
      className={`${styles.slideCard} ${
        isInactive ? styles.slideCardInactive : ""
      }`}
    >
      <div className={styles.slideBanner}>
        <img
          src={slide.desktopImage}
          alt={slide.title}
          className={styles.bannerImg}
        />
        <div className={styles.slideBadges}>
          <span
            className={slide.isActive ? styles.badgeActive : styles.badgeHidden}
          >
            {slide.isActive ? "Active" : "Hidden"}
          </span>
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
              <span className={styles.metaValueNone}>None</span>
            )}
          </div>
          {hasDistinctMobile && (
            <div className={styles.metaRow}>
              <span className={styles.metaLabel}>Mobile Image</span>
              <span className={styles.metaValueUploaded}>Uploaded</span>
            </div>
          )}
        </div>
      </div>

      <div className={styles.slideFooter}>
        <label className={styles.toggleSwitch} title="Toggle active status">
          <input
            type="checkbox"
            checked={slide.isActive}
            onChange={() => onToggle(slide._id, slide.isActive)}
            className={styles.checkbox}
          />
          <span>{slide.isActive ? "Visible" : "Hidden"}</span>
        </label>

        <div className={styles.actionBtns}>
          <button
            type="button"
            className={styles.iconBtnEdit}
            onClick={() => onEdit(slide)}
            title="Edit slide"
          >
            <Pencil size={16} />
          </button>
          <button
            type="button"
            className={styles.iconBtnDelete}
            onClick={() => onDelete(slide._id, slide.title)}
            title="Delete slide"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

