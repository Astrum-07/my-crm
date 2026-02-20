import type { Metadata } from "next";
import "./globals.css";
import QueryProvider from "../../providers/QueryProvider";

export const metadata: Metadata = {
  title: "Admin CRM System",
  description: "Neo-brutalist Admin Panel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz" suppressHydrationWarning>
      <body className="antialiased font-sans" suppressHydrationWarning>
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}