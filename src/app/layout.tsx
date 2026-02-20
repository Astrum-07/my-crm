// src/app/layout.tsx
import "./globals.css";
import QueryProvider from "../../providers/QueryProvider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz">
      <body className="antialiased font-sans">
        <QueryProvider>
          {/* Sidebar yo'q, hamma sahifa shu yerga keladi */}
          {children} 
        </QueryProvider>
      </body>
    </html>
  );
}