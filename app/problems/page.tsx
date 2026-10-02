import type { Metadata } from "next";
import { ProblemCatalog } from "@/components/ProblemCatalog";
export const metadata: Metadata = { title: "所有互動教學" };
export default function ProblemListPage() {
  return (
    <>
      <header className="page-intro">
        <p className="eyebrow">THE EVERYDAY FIX LIBRARY</p>
        <h1>
          每個小問題，
          <br />
          <em>都有看得懂的線索。</em>
        </h1>
        <p>
          10 個常見居家問題，從運作原理到安全檢查。
          <br />
          選一個你正好需要的，或從好奇開始。
        </p>
        <div className="intro-tags">
          <span>7 個水類教學</span>
          <span>3 個用電教學</span>
          <span>所有內容自由探索</span>
        </div>
      </header>
      <ProblemCatalog />
    </>
  );
}
