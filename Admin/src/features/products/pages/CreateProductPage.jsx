import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Save, CloudUpload, X } from "lucide-react";
import styles from "./CreateProduct.module.css";
import { fetchCategoriesApi, createProductApi } from "../services/product.api";
import { FILTER_COLORS } from "@/constants/collectionFilters";
import { SUBCATEGORIES_BY_CATEGORY } from "@/constants/subcategories";
import { toast } from "sonner";

function ImageFilePreview({ file, alt, className }) {
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  if (!previewUrl) return null;

  return <img src={previewUrl} alt={alt} className={className} />;
}

export default function CreateProductPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priceAmount: "",
    originalPriceAmount: "",
    category: "",
    subcategory: "",
    material: "",
    deliveryInfo: "",
    inStock: "true",
    isNewIn: "false"
  });

  const [sizes, setSizes] = useState([]);
  const [sizeInput, setSizeInput] = useState("");
  const [colors, setColors] = useState([]);
  const [showCustomColor, setShowCustomColor] = useState(false);
  const [customColorName, setCustomColorName] = useState("");
  const [customColorHex, setCustomColorHex] = useState("#ffffff");
  const [colorImages, setColorImages] = useState({});
  const [categoriesList, setCategoriesList] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await fetchCategoriesApi();
        if (isMountedRef.current && data?.success) {
          setCategoriesList(data.categories || []);
        }
      } catch (error) {
        if (isMountedRef.current) {
          toast.error(error.response?.data?.message || "Failed to load categories");
        }
      }
    };

    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "category") {
      setFormData((prev) => ({ ...prev, category: value, subcategory: "" }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const addSize = () => {
    const val = sizeInput.trim();
    if (val && !sizes.includes(val)) {
      setSizes([...sizes, val]);
      setSizeInput("");
    }
  };

  const removeSize = (sizeToRemove) => {
    setSizes(sizes.filter(s => s !== sizeToRemove));
  };

  const toggleColor = (colorObj) => {
    const exists = colors.find(c => c.name === colorObj.name);
    if (exists) {
      setColors(colors.filter(c => c.name !== colorObj.name));
      const newImages = { ...colorImages };
      delete newImages[colorObj.name];
      setColorImages(newImages);
    } else {
      setColors([...colors, colorObj]);
      setColorImages({ ...colorImages, [colorObj.name]: [] });
    }
  };

  const addCustomColor = () => {
    if (customColorName.trim() && customColorHex) {
      const newColor = { name: customColorName.trim(), hex: customColorHex };
      if (!colors.find(c => c.name.toLowerCase() === newColor.name.toLowerCase())) {
        setColors([...colors, newColor]);
        setColorImages({ ...colorImages, [newColor.name]: [] });
      }
      setCustomColorName("");
      setCustomColorHex("#ffffff");
      setShowCustomColor(false);
    }
  };

  const removeColor = (idxToRemove) => {
    const colorToRemove = colors[idxToRemove];
    setColors(colors.filter((_, idx) => idx !== idxToRemove));
    const newImages = { ...colorImages };
    delete newImages[colorToRemove.name];
    setColorImages(newImages);
  };

  const handleColorImageUpload = (e, colorName) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      const currentImages = colorImages[colorName] || [];
      if (currentImages.length + selectedFiles.length > 7) {
        toast.warning("You can only upload up to 7 images per color");
        return;
      }
      setColorImages({
        ...colorImages,
        [colorName]: [...currentImages, ...selectedFiles]
      });
    }
  };

  const removeColorImage = (colorName, idxToRemove) => {
    const currentImages = colorImages[colorName] || [];
    setColorImages({
      ...colorImages,
      [colorName]: currentImages.filter((_, idx) => idx !== idxToRemove)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (colors.length === 0) {
      toast.warning("Please select at least one color");
      return;
    }
    
    const missingImages = colors.find(c => !colorImages[c.name] || colorImages[c.name].length === 0);
    if (missingImages) {
      toast.warning(`Please upload at least one image for color: ${missingImages.name}`);
      return;
    }

    try {
      setIsSubmitting(true);
      
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });
      
      data.append("sizes", JSON.stringify(sizes));
      data.append("colors", JSON.stringify(colors));
      
      colors.forEach((color, idx) => {
        const imagesForColor = colorImages[color.name] || [];
        imagesForColor.forEach(img => {
          data.append(`images_${idx}`, img);
        });
      });

      const res = await createProductApi(data);

      if (res?.success) {
        toast.success("Product created successfully!");
        setTimeout(() => {
          if (isMountedRef.current) {
            navigate("/admin/products");
          }
        }, 800);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create product.");
    } finally {
      if (isMountedRef.current) {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.titleWrapper}>
            <div className={styles.titleLine}></div>
            <h2 className={styles.title}>Product Information</h2>
          </div>
          <button type="submit" className={styles.saveBtn} disabled={isSubmitting}>
            <Save size={18} />
            <span>{isSubmitting ? "Saving..." : "Save Data"}</span>
          </button>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Product Name :</label>
          <div className={styles.inputWrapper}>
            <input 
              type="text" 
              name="title"
              className={styles.input} 
              placeholder="Product Name" 
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Product Price :</label>
          <div className={styles.inputWrapper}>
            <input 
              type="number" 
              name="priceAmount"
              className={styles.input} 
              placeholder="Product Price (e.g. 1999)" 
              value={formData.priceAmount}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Product Before Price :</label>
          <div className={styles.inputWrapper}>
            <input 
              type="number" 
              name="originalPriceAmount"
              className={styles.input} 
              placeholder="Original Price (Optional)" 
              value={formData.originalPriceAmount}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Product Category :</label>
          <div className={styles.inputWrapper}>
            <select 
              name="category"
              className={styles.select}
              value={formData.category}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Category...</option>
              {categoriesList.map(cat => (
                <option key={cat.slug} value={cat.slug}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>

        {SUBCATEGORIES_BY_CATEGORY[formData.category] && (
          <div className={styles.formGroup}>
            <label className={styles.label}>Sub-Category (Optional) :</label>
            <div className={styles.inputWrapper}>
              <select
                name="subcategory"
                className={styles.select}
                value={formData.subcategory}
                onChange={handleInputChange}
              >
                <option value="">None — show in all collections</option>
                {SUBCATEGORIES_BY_CATEGORY[formData.category].map((sub) => (
                  <option key={sub.value} value={sub.value}>{sub.label}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        <div className={styles.formGroup}>
          <label className={styles.label}>Product Sizes (Optional) :</label>
          <div className={styles.inputWrapper}>
            <div className={styles.flexInput}>
              <input 
                type="text" 
                className={styles.input} 
                placeholder="e.g. S, M, L or 4.5ml, 50ml (Optional for Bags/Beauty)" 
                value={sizeInput}
                onChange={(e) => setSizeInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSize())}
              />
              <button type="button" className={styles.addBtn} onClick={addSize}>Add</button>
            </div>
            {sizes.length > 0 && (
              <div className={styles.tagContainer}>
                {sizes.map(size => (
                  <span key={size} className={styles.tag}>
                    {size} <button type="button" onClick={() => removeSize(size)}><X size={14}/></button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Selected Colors :</label>
          <div className={styles.inputWrapper}>
            <div className={styles.swatchGrid}>
              {FILTER_COLORS.map((c) => {
                const isSelected = colors.some(selected => selected.name === c.name);
                return (
                  <button
                    key={c.name}
                    type="button"
                    className={`${styles.swatchBtn} ${isSelected ? styles.swatchSelected : ""}`}
                    onClick={() => toggleColor(c)}
                    title={c.name}
                  >
                    <span 
                      className={styles.swatchCircle} 
                      ref={(el) => {
                        if (el) el.style.backgroundColor = c.hex;
                      }}
                    />
                    <span className={styles.swatchName}>{c.name}</span>
                  </button>
                );
              })}
              
              <button 
                type="button" 
                className={styles.addCustomBtn} 
                onClick={() => setShowCustomColor(!showCustomColor)}
              >
                + Custom
              </button>
            </div>

            {showCustomColor && (
              <div className={`${styles.flexInput} ${styles.customColorBox}`}>
                <input 
                  type="text" 
                  className={styles.input} 
                  placeholder="Custom Name (e.g. Neon Pink)" 
                  value={customColorName}
                  onChange={(e) => setCustomColorName(e.target.value)}
                />
                <input 
                  type="color" 
                  className={styles.colorPicker} 
                  value={customColorHex}
                  onChange={(e) => setCustomColorHex(e.target.value)}
                />
                <button type="button" className={styles.addBtn} onClick={addCustomColor}>Add</button>
              </div>
            )}

            {colors.length > 0 && (
              <div className={styles.tagContainer}>
                {colors.map((c, idx) => (
                  <span 
                    key={idx} 
                    className={styles.tag}
                    ref={(el) => {
                      if (el) el.style.borderLeftColor = c.hex;
                    }}
                  >
                    {c.name} <button type="button" onClick={() => removeColor(idx)}><X size={14}/></button>
                  </span>
                ))}
              </div>
            )}
            {colors.length === 0 && <span className={`${styles.helperText} ${styles.helperTextMargin}`}>No colors selected</span>}
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Material :</label>
          <div className={styles.inputWrapper}>
            <input 
              type="text" 
              name="material"
              className={styles.input} 
              placeholder="e.g. 100% Cotton" 
              value={formData.material}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Stock status :</label>
          <div className={styles.inputWrapper}>
            <select 
              name="inStock"
              className={styles.select} 
              value={formData.inStock}
              onChange={handleInputChange}
            >
              <option value="true">In Stock</option>
              <option value="false">Out of Stock</option>
            </select>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Feature in NEW IN :</label>
          <div className={styles.inputWrapper}>
            <select 
              name="isNewIn"
              className={styles.select} 
              value={formData.isNewIn}
              onChange={handleInputChange}
            >
              <option value="false">No</option>
              <option value="true">Yes — Show on Homepage</option>
            </select>
          </div>
        </div>

        <div className={`${styles.formGroup} ${styles.formGroupTop}`}>
          <label className={`${styles.label} ${styles.labelTop}`}>Product Long Description:</label>
          <div className={styles.inputWrapper}>
            <textarea 
              name="description"
              className={styles.textarea} 
              placeholder="product long description"
              value={formData.description}
              onChange={handleInputChange}
              rows={6}
            />
          </div>
        </div>

        <div className={`${styles.formGroup} ${styles.formGroupTop}`}>
          <label className={`${styles.label} ${styles.labelTop}`}>Shipping & Returns :</label>
          <div className={styles.inputWrapper}>
            <textarea 
              name="deliveryInfo"
              className={styles.textarea} 
              placeholder="e.g. Free standard shipping on orders above ₹999. Easy 7-day returns & exchanges." 
              value={formData.deliveryInfo}
              onChange={handleInputChange}
              rows={4}
            />
          </div>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.titleWrapper}>
          <div className={styles.titleLine}></div>
          <h2 className={styles.title}>Product Images (Per Color)</h2>
        </div>
        
        {colors.length === 0 ? (
          <p className={styles.noColorHelper}>
            Please select colors above to upload their images.
          </p>
        ) : (
          <div className={styles.colorUploadsContainer}>
            {colors.map((color) => {
              const currentImages = colorImages[color.name] || [];
              return (
                <div key={color.name} className={styles.colorUploadGroup}>
                  <div className={styles.colorUploadHeader}>
                    <span 
                      className={styles.colorUploadSwatch}
                      ref={(el) => {
                        if (el) el.style.backgroundColor = color.hex;
                      }}
                    />
                    <h3 className={styles.colorUploadTitle}>{color.name} Images <span className={styles.helperText}>(Max 7)</span></h3>
                  </div>

                  <div className={styles.uploadArea}>
                    <input 
                      type="file" 
                      id={`imageUpload-${color.name}`}
                      className={styles.fileInput} 
                      multiple 
                      accept="image/*"
                      onChange={(e) => handleColorImageUpload(e, color.name)}
                      disabled={currentImages.length >= 7}
                    />
                    <label htmlFor={`imageUpload-${color.name}`} className={styles.uploadLabel}>
                      <CloudUpload size={32} className={styles.uploadIcon} />
                      <p>Drag and drop or click to upload {color.name} photos</p>
                    </label>
                  </div>

                  {currentImages.length > 0 && (
                    <div className={styles.imagePreviewGrid}>
                      {currentImages.map((img, idx) => (
                        <div key={idx} className={styles.imagePreviewWrapper}>
                          <ImageFilePreview file={img} alt={`Preview ${idx}`} className={styles.imagePreview} />
                          <button type="button" className={styles.removeImageBtn} onClick={() => removeColorImage(color.name, idx)}>
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </form>
  );
}
