import type { ReactNode } from 'react';
// Root layout is a pass-through; <html> lives in [locale]/layout.tsx (next-intl pattern).
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
