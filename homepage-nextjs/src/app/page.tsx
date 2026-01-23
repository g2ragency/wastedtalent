import HeroSection from "@/components/HeroSection";
import FeaturedProducts from "@/components/FeaturedProducts";
import HeaderDynamic from "@/components/HeaderDynamic";
import { getHomepageData, getHeaderData } from "@/lib/api";

export const revalidate = 60; // Rivalidazione ISR ogni 60 secondi

export default async function Home() {
  try {
    const homepageData = await getHomepageData();
    const headerData = await getHeaderData();

    return (
      <>
        <HeaderDynamic data={headerData} />
        <main className="min-h-screen">
          <HeroSection data={homepageData.hero} />
          <FeaturedProducts data={homepageData.featured_products} />
        </main>
      </>
    );
  } catch (error) {
    console.error("Error loading data:", error);
    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <h1 className="text-4xl font-light mb-4">Wasted Talent</h1>
          <p className="text-lg">Sito in manutenzione. Torna presto!</p>
        </div>
      </main>
    );
  }
}
