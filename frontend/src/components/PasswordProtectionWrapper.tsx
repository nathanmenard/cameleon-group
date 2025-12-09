"use client";

import { PasswordProtection } from "./PasswordProtection";

interface Props {
  slug: string;
  title: string;
  children: React.ReactNode;
}

export function PasswordProtectionWrapper({ slug, title, children }: Props) {
  return (
    <PasswordProtection slug={slug} title={title}>
      {children}
    </PasswordProtection>
  );
}
