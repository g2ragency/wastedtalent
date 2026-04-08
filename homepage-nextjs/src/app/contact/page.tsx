import { getHeaderData, getContactData, getContactInfo } from "@/lib/api";
import HeaderDynamic from "@/components/HeaderDynamic";
import ContactContent from "@/components/ContactContent";

export const revalidate = 60;

export default async function ContactPage() {
  const [headerData, contactData, contactInfo] = await Promise.all([
    getHeaderData(),
    getContactData(),
    getContactInfo(),
  ]);

  return (
    <>
      <HeaderDynamic data={headerData} />
      <ContactContent formHtml={contactData.form_html} contactInfo={contactInfo} />
    </>
  );
}
