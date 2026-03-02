import { getHeaderData, getAboutData, getContactInfo } from "@/lib/api";
import HeaderDynamic from "@/components/HeaderDynamic";
import AboutContent from "@/components/AboutContent";

export default async function AboutPage() {
  const [headerData, aboutData, contactInfo] = await Promise.all([
    getHeaderData(),
    getAboutData(),
    getContactInfo(),
  ]);

  return (
    <>
      <HeaderDynamic data={headerData} />
      <AboutContent data={aboutData} contactInfo={contactInfo} />
    </>
  );
}
