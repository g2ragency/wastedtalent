import { getHeaderData, getContactData } from "@/lib/api";
import HeaderDynamic from "@/components/HeaderDynamic";
import ContactContent from "@/components/ContactContent";

export default async function ContactPage() {
  const [headerData, contactData] = await Promise.all([
    getHeaderData(),
    getContactData(),
  ]);

  return (
    <>
      <HeaderDynamic data={headerData} />
      <ContactContent formHtml={contactData.form_html} />
    </>
  );
}
