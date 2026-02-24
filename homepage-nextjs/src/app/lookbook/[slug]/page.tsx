import { getHeaderData, getLookbookBySlug } from "@/lib/api";
import HeaderDynamic from "@/components/HeaderDynamic";
import LookbookDetailContent from "@/components/LookbookDetailContent";
import { notFound } from "next/navigation";

interface LookbookDetailPageProps {
  params: { slug: string };
}

export default async function LookbookDetailPage({ params }: LookbookDetailPageProps) {
  const [headerData, lookbook] = await Promise.all([
    getHeaderData(),
    getLookbookBySlug(params.slug),
  ]);

  if (!lookbook) {
    notFound();
  }

  return (
    <>
      <HeaderDynamic data={headerData} />
      <LookbookDetailContent lookbook={lookbook} />
    </>
  );
}
