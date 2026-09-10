import { ProblemCard } from "@/components/ProblemCard";
import { problems } from "@/src/data/problems";

const waterProblems = problems.filter((item) => item.category === "water");
const electricalProblems = problems.filter((item) => item.category === "electrical");

export default function ProblemListPage() {
  return (
    <section className="section-stack">
      <header className="panel-section">
        <h1>問題列表</h1>
        <p>第一版先提供 10 個問題，完整教學僅開放「馬桶一直流水」。</p>
      </header>

      <section className="problem-section">
        <h2>水類問題</h2>
        <div className="problem-grid">
          {waterProblems.map((problem, index) => (
            <ProblemCard
              key={problem.id}
              problem={problem}
              styleIndex={index}
            />
          ))}
        </div>
      </section>

      <section className="problem-section">
        <h2>電類問題</h2>
        <div className="problem-grid">
          {electricalProblems.map((problem, index) => (
            <ProblemCard
              key={problem.id}
              problem={problem}
              styleIndex={index}
            />
          ))}
        </div>
      </section>
    </section>
  );
}
