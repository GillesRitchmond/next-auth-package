// components/ClientSessionProvider.tsx
"use client"; // Important pour forcer l'exécution côté client

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

export default function ClientSessionProvider({
  children,
}: {
  children: ReactNode;
}) {
  return <SessionProvider>{children}</SessionProvider>;
}
