import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import HeroSlider from "../components/HeroSlider/HeroSlider";
import CategorySlider from "../components/CategorySlider/CategorySlider";
import PromoBanner from "../components/PromoBanner/PromoBanner";
import HomeCarousel from "../components/HomeCarousel/HomeCarousel";
import SaleBanner from "../components/SaleBanner/SaleBanner";
import TrendingSection from "../components/TrendingSection/TrendingSection";
import CampaignBanner from "../components/CampaignBanner/CampaignBanner";
import styles from "./HomePage.module.css";

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (searchParams.get("auth") === "google_success") {
      toast.success("Successfully logged in with Google!");
      const nextParams = new URLSearchParams(searchParams);
      nextParams.delete("auth");
      setSearchParams(nextParams, { replace: true });

      try {
        const redirectTo = sessionStorage.getItem("auth_redirect_to");
        if (redirectTo) {
          sessionStorage.removeItem("auth_redirect_to");
          navigate(redirectTo, { replace: true });
        }
      } catch {
        void 0;
      }
    }
  }, [searchParams, setSearchParams, navigate]);

  return (
    <main className={styles.main}>
      <HeroSlider />
      <CategorySlider />
      <PromoBanner />
      <HomeCarousel />
      <SaleBanner />
      <TrendingSection />
      <CampaignBanner />
    </main>
  );
}
