import Link from "next/link";
import type { Problem } from "@/src/types/problem";

export function ProblemCard({ problem, styleIndex }: { problem: Problem; styleIndex?: number }) {
  const statusLabel = problem.available ? "可進行教學" : "Coming Soon";
  const statusClass = problem.available ? "problem-card--available" : "problem-card--coming";

  return (
    <article
      className={`problem-card ${statusClass}`}
      style={{ ["--idx" as any]: styleIndex ?? 0 }}
    >
      <span className="problem-badge">{statusLabel}</span>
      <h3>{problem.title}</h3>
      <p className="problem-meta">
        {problem.category === "water" ? "💧 水類問題" : "⚡ 電類問題"}
      </p>
      <p className="problem-meta">
        {problem.available ? "直接開啟互動診斷" : "此項目正在製作中"}
      </p>
      <Link href={`/problem/${problem.id}`} className="problem-card-cta">
        {problem.available ? "進入教學" : "查看狀態"}
      </Link>
    </article>
  );
}

