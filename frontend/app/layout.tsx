import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CookieGuard",
  description: "Interactive Cookie & Session Security Lab",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
