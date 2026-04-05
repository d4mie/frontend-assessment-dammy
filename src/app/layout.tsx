import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Content Explorer",
    template: "%s · Content Explorer",
  },
  description: "Browse and search products via DummyJSON.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-zinc-900 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/40 dark:focus:bg-zinc-50 dark:focus:text-zinc-950 dark:focus-visible:ring-zinc-50/30"
        >
          Skip to content
        </a>
        <main id="content" className="flex min-h-full flex-1 flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}
