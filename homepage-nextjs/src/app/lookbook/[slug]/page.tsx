import { getHeaderData, getLookbookBySlug, getContactInfo } from "@/lib/api";
import HeaderDynamic from "@/components/HeaderDynamic";
import LookbookDetailContent from "@/components/LookbookDetailContent";
import { notFound } from "next/navigation";

export const revalidate = 60;

interface LookbookDetailPageProps {
  params: { slug: string };
}

export default async function LookbookDetailPage({ params }: LookbookDetailPageProps) {
  const [headerData, lookbook, contactInfo] = await Promise.all([
    getHeaderData(),
    getLookbookBySlug(params.slug),
    getContactInfo(),
  ]);

  if (!lookbook) {
    notFound();
  }

  return (
    <>
      <HeaderDynamic data={headerData} />
      <LookbookDetailContent lookbook={lookbook} contactInfo={contactInfo} />
    </>
  );
}
