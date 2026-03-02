import { getHeaderData, getContactInfo } from "@/lib/api";
import HeaderDynamic from "@/components/HeaderDynamic";
import RegisterContent from "@/components/RegisterContent";

export default async function RegisterPage() {
  const [headerData, contactInfo] = await Promise.all([
    getHeaderData(),
    getContactInfo(),
  ]);

  return (
    <>
      <HeaderDynamic data={headerData} />
      <RegisterContent contactInfo={contactInfo} />
    </>
  );
}
