import type { Metadata } from "next";
import "./globals.css";
import QueryProvider from "../../providers/QueryProvider"; 
import { ThemeProvider } from "../../components/theme-provider";

export const metadata: Metadata = {
  title: "Admin CRM System",
  description: "Neo-brutalist Admin Panel",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uz" suppressHydrationWarning>
      <body 
        className="antialiased font-sans bg-white dark:bg-zinc-950 text-black dark:text-white transition-colors duration-300" 
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            {children} 
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}