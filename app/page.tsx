import Link from "next/link";
import { problems } from "@/src/data/problems";
import { ProblemCard } from "@/components/ProblemCard";

const featuredProblems = problems.slice(0, 6);

export default function HomePage() {
  return (
    <section className="section-stack">
      <div className="hero">
        <p className="hero-kicker">FixFlow 3D</p>
        <h1>你遇到什麼問題？</h1>
        <p className="hero-description">
          使用 3D 互動步驟，快速找到馬桶與水電問題可能原因，先用最短路徑完成驗證。
        </p>
      </div>

      <div className="category-pills">
        <span className="category-pill">水類問題</span>
        <span className="category-pill">電類問題</span>
      </div>

      <section className="panel-section">
        <div className="panel-header">
          <h2>熱門問題</h2>
          <Link href="/problems" className="inline-link">
            查看全部問題
          </Link>
        </div>
        <div className="problem-grid">
          {featuredProblems.map((problem, index) => (
            <ProblemCard
              key={problem.id}
              problem={problem}
              styleIndex={index}
            />
          ))}
        </div>
      </section>

      <section className="panel-section">
        <h2>流程引導</h2>
        <p>
          先點進某個問題後，會進入專屬教學頁。現階段完整實作
          <strong>「馬桶一直流水」</strong>，其餘項目顯示
          <strong>Coming Soon</strong>。
        </p>
      </section>
    </section>
  );
}
