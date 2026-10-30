import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";
import {
  fetchHeroSlidesApi,
  createHeroSlideApi,
  updateHeroSlideApi,
  toggleHeroStatusApi,
  deleteHeroSlideApi,
} from "../services/hero.api";

export function useHeroSlides() {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const loadSlides = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchHeroSlidesApi();
      if (isMountedRef.current && data?.success) {
        setSlides(data.slides || []);
      }
    } catch (err) {
      if (isMountedRef.current) {
        toast.error(err.response?.data?.message || "Failed to load hero banners");
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    loadSlides();
  }, [loadSlides]);

  const saveSlide = async (formData, editingId) => {
    try {
      setSubmitting(true);
      let data;
      if (editingId) {
        data = await updateHeroSlideApi(editingId, formData);
        toast.success("Hero slide updated successfully!");
      } else {
        data = await createHeroSlideApi(formData);
        toast.success("New hero slide uploaded successfully!");
      }

      if (data?.success) {
        await loadSlides();
        return true;
      }
      return false;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save hero slide");
      return false;
    } finally {
      if (isMountedRef.current) {
        setSubmitting(false);
      }
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    setSlides((prev) =>
      prev.map((s) => (s._id === id ? { ...s, isActive: !currentStatus } : s))
    );

    try {
      const data = await toggleHeroStatusApi(id);
      if (data?.success) {
        toast.success(data.message || "Slide visibility updated");
      }
    } catch (err) {
      if (isMountedRef.current) {
        setSlides((prev) =>
          prev.map((s) => (s._id === id ? { ...s, isActive: currentStatus } : s))
        );
        toast.error(err.response?.data?.message || "Failed to update slide status");
      }
    }
  };

  const deleteSlide = (id, slideTitle) => {
    toast(`Delete slide "${slideTitle || "this banner"}"?`, {
      description: "This slide banner will be permanently removed from storefront.",
      action: {
        label: "Delete",
        onClick: async () => {
          try {
            const data = await deleteHeroSlideApi(id);
            if (data?.success) {
              if (isMountedRef.current) {
                setSlides((prev) => prev.filter((s) => s._id !== id));
              }
              toast.success("Hero slide deleted successfully!");
            }
          } catch (err) {
            toast.error(err.response?.data?.message || "Failed to delete slide");
          }
        },
      },
      cancel: {
        label: "Cancel",
        onClick: () => {},
      },
    });
  };

  return {
    slides,
    loading,
    submitting,
    saveSlide,
    toggleStatus,
    deleteSlide,
    refreshSlides: loadSlides,
  };
}
