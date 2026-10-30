import { useUsers } from "../hooks/useUsers";
import { Pagination } from "@/components/ui";
import { Trash2, Users as UsersIcon } from "lucide-react";
import styles from "./UsersPage.module.css";

function getInitials(name = "") {
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return (name[0] || "U").toUpperCase();
}

function formatDate(isoDate) {
  if (!isoDate) return "N/A";
  try {
    return new Date(isoDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "N/A";
  }
}

function formatLocation(user) {
  const cityState = [user?.city, user?.state].filter(Boolean).join(", ");
  const country = user?.country || "";
  const main = cityState ? `${cityState}${country ? ` (${country})` : ""}` : country || "Not provided";
  const sub = user?.streetAddress || "";
  return { main, sub };
}

export default function UsersPage() {
  const {
    users,
    total,
    page,
    setPage,
    pageSize,
    setPageSize,
    totalPages,
    searchQuery,
    setSearchQuery,
    loading,
    deletingId,
    deleteUser,
  } = useUsers();

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.titleWrapper}>
            <div className={styles.titleLine} />
            <h1 className={styles.title}>Users Management</h1>
          </div>
          <div className={styles.statsPill}>
            <UsersIcon size={16} />
            <span>Total Customers:</span>
            <span className={styles.statsCount}>{total}</span>
          </div>
        </div>

        <div className={styles.searchRow}>
          <label htmlFor="userSearch" className={styles.searchLabel}>
            Search:
          </label>
          <input
            id="userSearch"
            type="text"
            className={styles.searchInput}
            placeholder="Search by name, email or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Contact Info</th>
                <th>Location</th>
                <th>Status</th>
                <th>Joined Date</th>
                <th>Option</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className={styles.emptyState}>
                    Loading users...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className={styles.emptyState}>
                    {searchQuery ? "No users match your search." : "No users found."}
                  </td>
                </tr>
              ) : (
                users.map((user) => {
                  const location = formatLocation(user);
                  return (
                    <tr key={user._id}>
                      <td>
                        <div className={styles.userCell}>
                          <div className={styles.avatar}>
                            {getInitials(user.name)}
                          </div>
                          <div className={styles.userInfo}>
                            <p className={styles.userName}>{user.name}</p>
                            <p className={styles.userId}>ID: {user._id.slice(-6)}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className={styles.contactCell}>
                          <p className={styles.userEmail}>{user.email}</p>
                          <p className={styles.userPhone}>
                            {user.phone ? `+91 ${user.phone}` : "No phone provided"}
                          </p>
                        </div>
                      </td>
                      <td>
                        <div className={styles.locationCell}>
                          <p className={styles.locationMain}>{location.main}</p>
                          {location.sub && (
                            <p className={styles.locationSub}>{location.sub}</p>
                          )}
                        </div>
                      </td>
                      <td>
                        <span
                          className={`${styles.badge} ${
                            user.isVerified
                              ? styles.badgeVerified
                              : styles.badgeUnverified
                          }`}
                        >
                          {user.isVerified ? "Verified" : "Unverified"}
                        </span>
                      </td>
                      <td className={styles.dateCell}>{formatDate(user.createdAt)}</td>
                      <td>
                        <button
                          type="button"
                          className={styles.iconBtnDelete}
                          onClick={() => deleteUser(user._id, user.name)}
                          disabled={deletingId === user._id}
                          title="Delete User"
                        >
                          <Trash2 size={18} />
                        </button>
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
          total={total}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          pageSizeOptions={[5, 10, 20, 50]}
        />
      </div>
    </div>
  );
}
