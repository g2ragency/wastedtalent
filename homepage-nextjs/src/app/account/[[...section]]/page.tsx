import { getHeaderData, getContactInfo } from "@/lib/api";
import HeaderDynamic from "@/components/HeaderDynamic";
import AccountContent from "@/components/AccountContent";

type AccountSection = "account" | "orders" | "delivery" | "billing";

const validSections: AccountSection[] = [
  "account",
  "orders",
  "delivery",
  "billing",
];

function resolveSection(params: { section?: string[] }): AccountSection {
  const slug = params.section?.[0];
  if (slug && validSections.includes(slug as AccountSection)) {
    return slug as AccountSection;
  }
  return "account";
}

export default async function AccountPage({
  params,
}: {
  params: { section?: string[] };
}) {
  const section = resolveSection(params);

  const [headerData, contactInfo] = await Promise.all([
    getHeaderData(),
    getContactInfo(),
  ]);

  return (
    <>
      <HeaderDynamic data={headerData} />
      <AccountContent contactInfo={contactInfo} section={section} />
    </>
  );
}
