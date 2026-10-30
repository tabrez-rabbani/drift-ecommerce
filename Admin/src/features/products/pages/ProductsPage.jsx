import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useProducts } from "../hooks/useProducts";
import { Pagination } from "@/components/ui";
import styles from "./Products.module.css";

export default function ProductsPage() {
  const {
    filteredProducts,
    totalCount,
    searchQuery,
    setSearchQuery,
    isLoading,
    page,
    setPage,
    pageSize,
    setPageSize,
    totalPages,
    deleteProduct,
  } = useProducts();

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.titleWrapper}>
            <div className={styles.titleLine} />
            <h2 className={styles.title}>Products List</h2>
          </div>
          <Link to="/admin/products/create" className={styles.addBtn}>
            <Plus size={18} strokeWidth={2.5} />
            <span>Add Product</span>
          </Link>
        </div>

        <div className={styles.searchRow}>
          <label htmlFor="product-search" className={styles.searchLabel}>
            Search Name:
          </label>
          <input
            id="product-search"
            type="text"
            className={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by product name..."
          />
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Product Image</th>
                <th>Product Name</th>
                <th>Brand</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock Info</th>
                <th>Option</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className={styles.emptyState}>
                    Loading products...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className={styles.emptyState}>
                    {searchQuery
                      ? "No products match your search."
                      : "No products found. Add one above."}
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const firstColor = product.colors?.[0];
                  const img = firstColor?.images?.[0];

                  return (
                    <tr key={product._id}>
                      <td>
                        <div className={styles.productImageWrapper}>
                          {img ? (
                            <img
                              src={img}
                              alt={product.title}
                              className={styles.productImage}
                            />
                          ) : (
                            <div className={styles.productImagePlaceholder}>No Img</div>
                          )}
                        </div>
                      </td>
                      <td>
                        <h3 className={styles.productTitle}>{product.title}</h3>
                      </td>
                      <td>
                        <span className={styles.textMuted}>No Brand</span>
                      </td>
                      <td className={styles.categoryCell}>{product.category}</td>
                      <td>
                        <span className={styles.price}>₹{product.price?.amount}</span>
                      </td>
                      <td>
                        <span
                          className={`${styles.badge} ${
                            product.inStock ? styles.badgeStock : styles.badgeOut
                          }`}
                        >
                          {product.inStock ? "In Stock" : "Out Of Stock"}
                        </span>
                      </td>
                      <td>
                        <div className={styles.actions}>
                          <Link
                            to={`/admin/products/edit/${product._id}`}
                            className={styles.iconBtnEdit}
                            title="Edit Product"
                          >
                            <Pencil size={16} />
                          </Link>
                          <button
                            type="button"
                            className={styles.iconBtnDelete}
                            onClick={() => deleteProduct(product._id, product.title)}
                            title="Delete Product"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          page={page}
          totalPages={totalPages}
          total={totalCount}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          pageSizeOptions={[5, 10, 20, 50]}
        />
      </div>
    </div>
  );
}

