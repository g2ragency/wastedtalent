import { getHeaderData, getLookbooks, getContactInfo } from "@/lib/api";
import HeaderDynamic from "@/components/HeaderDynamic";
import LookbookContent from "@/components/LookbookContent";

export const revalidate = 60;

export default async function LookbookPage() {
  const [headerData, lookbooks, contactInfo] = await Promise.all([
    getHeaderData(),
    getLookbooks(),
    getContactInfo(),
  ]);

  return (
    <>
      <HeaderDynamic data={headerData} />
      <LookbookContent lookbooks={lookbooks} contactInfo={contactInfo} />
    </>
  );
}
