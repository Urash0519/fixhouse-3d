import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "FixFlow 3D",
  description: "3D 互動式馬桶漏水診斷 MVP",
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="zh-Hant">
      <body>
        <div className="app-shell">
          <header className="site-header">
            <Link href="/" className="logo-link">
              FixFlow 3D
            </Link>
            <nav className="header-nav">
              <Link href="/" className="nav-link">
                首頁
              </Link>
              <Link href="/problems" className="nav-link">
                問題列表
              </Link>
            </nav>
          </header>
          <main className="content-wrap">{children}</main>
        </div>
      </body>
    </html>
  );
}
