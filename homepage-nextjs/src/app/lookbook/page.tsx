import { getHeaderData, getLookbooks } from "@/lib/api";
import HeaderDynamic from "@/components/HeaderDynamic";
import LookbookContent from "@/components/LookbookContent";

export default async function LookbookPage() {
  const [headerData, lookbooks] = await Promise.all([
    getHeaderData(),
    getLookbooks(),
  ]);

  return (
    <>
      <HeaderDynamic data={headerData} />
      <LookbookContent lookbooks={lookbooks} />
    </>
  );
}
