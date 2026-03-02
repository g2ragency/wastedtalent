import { getHeaderData, getContactInfo } from "@/lib/api";
import HeaderDynamic from "@/components/HeaderDynamic";
import LoginContent from "@/components/LoginContent";

export default async function LoginPage() {
  const [headerData, contactInfo] = await Promise.all([
    getHeaderData(),
    getContactInfo(),
  ]);

  return (
    <>
      <HeaderDynamic data={headerData} />
      <LoginContent contactInfo={contactInfo} />
    </>
  );
}
