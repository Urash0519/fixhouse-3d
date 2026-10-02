import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { Icon } from "@/components/Icon";
import "./globals.css";
export const metadata: Metadata = {
  metadataBase: new URL("https://urash0519.github.io/fixhouse-3d/"),
  title: {
    default: "FixFlow 3D｜看懂家的每個小問題",
    template: "%s｜FixFlow 3D",
  },
  description:
    "從水流到電路，透過可旋轉的 3D 模型、動態示意與互動檢查，看懂 10 種居家水電問題。",
};
export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="zh-Hant">
      <body>
        <a href="#main-content" className="skip-link">
          跳至主要內容
        </a>
        <div className="site-shell">
          <SiteHeader />
          <main id="main-content">{children}</main>
          <footer className="site-footer">
            <Link href="/" className="footer-brand">
              <Icon name="home" /> FixFlow <span>3D</span>
            </Link>
            <p>先看懂，再動手。知道何時交給專業，也是修繕的第一步。</p>
            <span>居家問題互動學院 · 2026</span>
          </footer>
        </div>
      </body>
    </html>
  );
}
