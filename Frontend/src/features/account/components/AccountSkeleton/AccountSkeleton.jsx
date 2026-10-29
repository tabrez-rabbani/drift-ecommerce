import styles from "./AccountSkeleton.module.css";

export default function AccountSkeleton() {
  return (
    <main className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.layout}>
          {/* Skeleton Sidebar */}
          <aside className={styles.sidebar}>
            <div className={styles.skeletonCover} />
            <div className={styles.sidebarProfile}>
              <div className={styles.skeletonAvatar} />
              <div className={`${styles.skeletonLine} ${styles.skeletonName}`} />
              <div className={`${styles.skeletonLine} ${styles.skeletonEmail}`} />
            </div>
            <div className={styles.skeletonNavGroup}>
              <div className={`${styles.skeletonLine} ${styles.skeletonNavItem}`} />
              <div className={`${styles.skeletonLine} ${styles.skeletonNavItem}`} />
              <div className={`${styles.skeletonLine} ${styles.skeletonNavItem}`} />
            </div>
            <div className={styles.sidebarLogoutArea}>
              <div className={`${styles.skeletonLine} ${styles.skeletonLogout}`} />
            </div>
          </aside>

          {/* Skeleton Main Content */}
          <section className={styles.content}>
            <div className={`${styles.skeletonLine} ${styles.skeletonPageTitle}`} />

            <div className={styles.skeletonGreetingWrap}>
              <div className={`${styles.skeletonLine} ${styles.skeletonGreetingTitle}`} />
              <div className={`${styles.skeletonLine} ${styles.skeletonGreetingText}`} />
              <div className={`${styles.skeletonLine} ${styles.skeletonGreetingSubtext}`} />
            </div>

            <div className={styles.statsGrid}>
              <div className={styles.statBox}>
                <div className={`${styles.skeletonIconBox} ${styles.skeletonStatIcon}`} />
                <div className={styles.skeletonStatInfo}>
                  <div className={`${styles.skeletonLine} ${styles.skeletonStatLabel}`} />
                  <div className={`${styles.skeletonLine} ${styles.skeletonStatValue}`} />
                </div>
              </div>
              <div className={styles.statBox}>
                <div className={`${styles.skeletonIconBox} ${styles.skeletonStatIcon}`} />
                <div className={styles.skeletonStatInfo}>
                  <div className={`${styles.skeletonLine} ${styles.skeletonStatLabel}`} />
                  <div className={`${styles.skeletonLine} ${styles.skeletonStatValue}`} />
                </div>
              </div>
            </div>

            <div className={styles.dashInfoCard}>
              <div className={`${styles.skeletonLine} ${styles.skeletonCardTitle}`} />
              <div className={styles.skeletonCardList}>
                <div className={`${styles.skeletonLine} ${styles.skeletonLine60}`} />
                <div className={`${styles.skeletonLine} ${styles.skeletonLine50}`} />
                <div className={`${styles.skeletonLine} ${styles.skeletonLine75}`} />
              </div>
            </div>

            <div className={`${styles.dashInfoCard} ${styles.dashInfoCardMt}`}>
              <div className={`${styles.skeletonLine} ${styles.skeletonCardTitleSm}`} />
              <div className={styles.skeletonCardList}>
                <div className={`${styles.skeletonLine} ${styles.skeletonLine65}`} />
                <div className={`${styles.skeletonLine} ${styles.skeletonLine45}`} />
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
