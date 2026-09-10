"use client";

import { TutorialStep } from "./TutorialStep";
import type { Problem, ToiletRunningWaterTutorial, TutorialNode } from "@/src/types/problem";

export function TutorialPanel({
  problem,
  tutorial,
  node,
  onAnswer,
  onContinue,
  onRestart,
}: {
  problem: Problem;
  tutorial: ToiletRunningWaterTutorial;
  node: TutorialNode;
  onAnswer: (value: "yes" | "no") => void;
  onContinue: () => void;
  onRestart: () => void;
}) {
  return (
    <section className="tutorial-panel">
      <p className="tutorial-breadcrumb">
        案例：
        <strong>{problem.title}</strong>
      </p>
      <h1 className="problem-title">馬桶一路徹底診斷</h1>
      <div className="tutorial-badge">
        風險等級
        <span className="risk-chip">{tutorial.riskLevel.toUpperCase()}</span>
      </div>
      <p>{tutorial.description}</p>
      <TutorialStep
        title={node.title}
        description={node.description}
        question={node.question}
      >
        {node.mode === "question" ? (
          <>
            <button type="button" onClick={() => onAnswer("yes")}>
              {node.yesLabel ?? "是"}
            </button>
            <button type="button" className="secondary" onClick={() => onAnswer("no")}>
              {node.noLabel ?? "否"}
            </button>
          </>
        ) : node.mode === "result" ? (
          <>
            <div className="results-section">
              {node.causes && (
                <div>
                  <h3>可能原因</h3>
                  <ul>
                    {(node.causes || []).map((cause) => (
                      <li key={cause}>{cause}</li>
                    ))}
                  </ul>
                </div>
              )}
              {node.recommendation && <p>{node.recommendation}</p>}
            </div>
            <button type="button" onClick={onContinue}>
              {node.ctaLabel ?? "查看下一步"}
            </button>
          </>
        ) : (
          <button type="button" onClick={onContinue}>
            {node.ctaLabel ?? "下一步"}
          </button>
        )}
      </TutorialStep>
      <div className="results-section">
        <h3>安全提示</h3>
        <ul>
          {tutorial.safetyTips.map((tip) => (
            <li key={tip}>{tip}</li>
          ))}
        </ul>
      </div>
      {node.mode === "result" && (
        <div className="tutorial-actions" style={{ marginTop: "0.75rem" }}>
          <button type="button" className="secondary" onClick={onRestart}>
            重新開始
          </button>
        </div>
      )}
    </section>
  );
}

