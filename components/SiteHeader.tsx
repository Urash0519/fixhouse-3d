"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "./Icon";
export function SiteHeader() {
  const pathname = usePathname();
  return (
    <header className="site-header">
      <Link href="/" className="brand" aria-label="FixFlow 3D 首頁">
        <span className="brand-symbol">
          <Icon name="home" size={23} />
        </span>
        <span>
          FixFlow<span className="brand-3d">3D</span>
          <small>看懂家的每個小問題</small>
        </span>
      </Link>
      <nav aria-label="主要導覽">
        <Link href="/" aria-current={pathname === "/" ? "page" : undefined}>
          探索首頁
        </Link>
        <Link
          href="/problems"
          aria-current={pathname.startsWith("/problem") ? "page" : undefined}
        >
          所有教學<span className="nav-count">10</span>
        </Link>
        <Link href="/#how-it-works" className="nav-about">
          如何使用
        </Link>
      </nav>
      <Link href="/problem/toilet-running-water" className="header-cta">
        從第一課開始 <Icon name="arrow" size={16} />
      </Link>
    </header>
  );
}
