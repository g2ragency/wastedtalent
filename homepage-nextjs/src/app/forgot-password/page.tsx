import { getHeaderData, getContactInfo } from "@/lib/api";
import HeaderDynamic from "@/components/HeaderDynamic";
import ForgotPasswordContent from "@/components/ForgotPasswordContent";

export default async function ForgotPasswordPage() {
  const [headerData, contactInfo] = await Promise.all([
    getHeaderData(),
    getContactInfo(),
  ]);

  return (
    <>
      <HeaderDynamic data={headerData} />
      <ForgotPasswordContent contactInfo={contactInfo} />
    </>
  );
}
