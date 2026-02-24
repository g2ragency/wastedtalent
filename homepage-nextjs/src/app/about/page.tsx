import { getHeaderData, getAboutData } from "@/lib/api";
import HeaderDynamic from "@/components/HeaderDynamic";
import AboutContent from "@/components/AboutContent";

export default async function AboutPage() {
  const [headerData, aboutData] = await Promise.all([
    getHeaderData(),
    getAboutData(),
  ]);

  return (
    <>
      <HeaderDynamic data={headerData} />
      <AboutContent data={aboutData} />
    </>
  );
}
