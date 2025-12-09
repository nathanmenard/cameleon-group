import { Metadata } from "next";
import { PasswordProtectionWrapper } from "@/components/PasswordProtectionWrapper";

// Block search engine indexing for client pages
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default async function ClientLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <PasswordProtectionWrapper slug={slug} title="Document">
      {children}
    </PasswordProtectionWrapper>
  );
}
