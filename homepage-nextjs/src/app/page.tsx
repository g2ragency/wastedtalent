import HeroSection from "@/components/HeroSection";
import FeaturedProducts from "@/components/FeaturedProducts";
import HeaderDynamic from "@/components/HeaderDynamic";
import { getHomepageData, getHeaderData } from "@/lib/api";

export const revalidate = 60; // Rivalidazione ISR ogni 60 secondi

export default async function Home() {
  const homepageData = await getHomepageData();
  const headerData = await getHeaderData();

  return (
    <>
      <HeaderDynamic data={headerData} />
      <main className="min-h-screen">
        <HeroSection data={homepageData.hero} />
        {/* Uncomment per mostrare prodotti */}
        {/* <FeaturedProducts data={homepageData.featured_products} /> */}
      </main>
    </>
  );
}
