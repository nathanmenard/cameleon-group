"use client";

import type { ReactNode } from "react";
import { Navbar } from "@/components/strategic-note";
import { CommentsSidebar, CommentLayer, SelectionHandles } from "@/components/comments";
import type { ClientConfig } from "@/types";

interface StrategicNoteLayoutProps {
  client: ClientConfig;
  children: ReactNode;
}

export function StrategicNoteLayout({
  client,
  children,
}: StrategicNoteLayoutProps) {
  return (
    <div className="min-h-screen bg-blanc">
      <Navbar client={client} />
      <main className="pt-16">{children}</main>
      <CommentsSidebar documentId={client.documentId} />
      <CommentLayer />
      <SelectionHandles />
    </div>
  );
}

export default StrategicNoteLayout;
