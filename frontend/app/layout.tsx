import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CookieGuard | Web Security Lab",
  description: "Interactive cookie and session security laboratory",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <div className="site-shell">
          <header className="topbar">
            <a className="brand" href="/" aria-label="CookieGuard home">
              <span className="brand-mark">CG</span>
              <span>CookieGuard</span>
            </a>
            <nav className="nav" aria-label="Primary navigation">
              <a href="/">Overview</a>
              <a href="/xss-lab">XSS</a>
              <a href="/csrf-lab">CSRF</a>
              <a href="/secure-lab">HTTPS</a>
            </nav>
          </header>
          {children}
          <footer className="footer">LOCAL SECURITY LAB · CONTROLLED EXPERIMENTS · HTTPS</footer>
        </div>
      </body>
    </html>
  );
}
