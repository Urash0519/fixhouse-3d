"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ModelPreview } from "./ModelPreview";
import { Icon } from "./Icon";
import { nextNode } from "@/src/data/tutorials";
import { problems, deviceLabels } from "@/src/data/problems";
import { partLabels } from "@/src/data/parts";
import { useProgress } from "@/src/data/progress";
import type { Answer, PartId, Problem, Tutorial } from "@/src/types/problem";

export function ProblemTutorial({
  problem,
  tutorial,
}: {
  problem: Problem;
  tutorial: Tutorial;
}) {
  const [state, setState] = useState("intro");
  const [chapter, setChapter] = useState(0);
  const [selected, setSelected] = useState<PartId>(tutorial.chapters[0].part);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [acknowledged, setAcknowledged] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");
  const { save, summaries } = useProgress();
  const previousSummary = summaries.find((s) => s.id === problem.id);
  const heading = useRef<HTMLHeadingElement>(null);
  const modelColumn = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLElement>(null);
  const node = state === "intro" ? undefined : tutorial.nodes[state];
  const isResult = node?.kind === "result";
  const nextProblem =
    problems[
      (problems.findIndex((p) => p.id === problem.id) + 1) % problems.length
    ];
  useEffect(() => {
    if (state !== "intro") heading.current?.focus();
  }, [state]);

  const go = (id: string) => {
    setState(id);
    if (tutorial.nodes[id]) setSelected(tutorial.nodes[id].part);
    setSaveStatus("");
  };
  const answer = (value: Answer["value"]) => {
    setAnswers([...answers, { node: state, value }]);
    go(nextNode(tutorial, state, value));
  };
  const back = () => {
    if (!answers.length) {
      setState("intro");
      setSelected(tutorial.chapters[chapter].part);
      return;
    }
    const previous = answers[answers.length - 1];
    setAnswers(answers.slice(0, -1));
    go(previous.node);
  };
  const restart = () => {
    setState("intro");
    setAnswers([]);
    setAcknowledged(false);
    setChapter(0);
    setSelected(tutorial.chapters[0].part);
    setSaveStatus("");
  };
  const summaryText = () => {
    if (node?.kind !== "result") return "";
    return [
      "FixFlow 3D｜檢查摘要",
      problem.title,
      "",
      ...answers.map((a, i) => {
        const question = tutorial.nodes[a.node];
        return (
          String(i + 1) +
          ". " +
          (question.kind === "question" ? question.question : question.title) +
          " → " +
          { yes: "是", no: "否", unsure: "無法確認" }[a.value]
        );
      }),
      "",
      "初步方向：" + node.title,
      node.description,
      "",
      "建議下一步：",
      ...node.actions.map((a, i) => String(i + 1) + ". " + a),
      "",
      "此摘要依使用者回答整理，未經現場確認，並非確診或修復完成證明。",
      "教學：" + window.location.href,
    ].join("\n");
  };
  const download = (text: string) => {
    const blob = new Blob(["\uFEFF", text], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "FixFlow-" + problem.id + ".txt";
    a.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div className="lesson-page">
      <div className="lesson-breadcrumb">
        <Link href="/problems">
          <Icon name="back" size={16} /> 教學地圖
        </Link>
        <span>/</span>
        <span>{problem.category === "water" ? "水的問題" : "電的問題"}</span>
        <span>/</span>
        <span>{problem.title}</span>
      </div>
      <header className="lesson-header">
        <div>
          <p className="eyebrow">
            {problem.category === "water" ? "WATER" : "POWER"} /{" "}
            {String(
              problems.findIndex((p) => p.id === problem.id) + 1,
            ).padStart(2, "0")}{" "}
            · {deviceLabels[problem.device]}
          </p>
          <h1>{problem.title}</h1>
          <p>{problem.description}</p>
        </div>
        <span className="lesson-duration">
          <Icon name="clock" size={17} /> 約 {problem.duration} 分鐘{" "}
          <span>·</span> 互動教學
        </span>
      </header>
      <div className="lesson-layout">
        <div className="lesson-stage-column" ref={modelColumn}>
          <ModelPreview
            device={problem.device}
            selectedPart={selected}
            onPartClick={setSelected}
          />
          {state !== "intro" && (
            <button
              className="mobile-model-jump"
              onClick={() => panel.current?.scrollIntoView({ block: "start" })}
            >
              回到目前檢查 <Icon name="arrow" size={16} />
            </button>
          )}
          <div className="chapter-section">
            <div className="mini-heading">
              <span>原理速覽</span>
              <span>隨時切換，重看一次</span>
            </div>
            <div className="lesson-chapters">
              {tutorial.chapters.map((c, i) => (
                <button
                  key={c.title}
                  aria-pressed={chapter === i}
                  onClick={() => {
                    setChapter(i);
                    setSelected(c.part);
                  }}
                >
                  <span>0{i + 1}</span>
                  {c.title}
                </button>
              ))}
            </div>
            <p className="chapter-description" aria-live="polite">
              {tutorial.chapters[chapter].description}
            </p>
          </div>
        </div>
        <aside className="diagnosis-panel" aria-label="互動檢查" ref={panel}>
          <div className="lesson-tabs">
            <span className={state === "intro" ? "current" : "done"}>
              <i>1</i> 看懂原理
            </span>
            <span
              className={
                node?.kind === "question" ? "current" : isResult ? "done" : ""
              }
            >
              <i>2</i> 跟著檢查
            </span>
            <span className={isResult ? "current" : ""}>
              <i>3</i> 取得方向
            </span>
          </div>
          <div className="diagnosis-content">
            {state === "intro" ? (
              <>
                <p className="eyebrow">BEFORE WE START</p>
                <h2 ref={heading} tabIndex={-1}>
                  先看懂，再開始。
                </h2>
                <p className="principle">{tutorial.principle}</p>
                <div className="observation-note">
                  <Icon name="cube" size={20} />
                  <p>
                    點選模型或零件名稱，看看它的作用。切換「正常運作」與「異常示意」，比較差異。
                  </p>
                </div>
                <div className="safety-box">
                  <h3>
                    <Icon name="shield" size={18} /> 開始前，記住這幾件事
                  </h3>
                  <ul>
                    {tutorial.safety.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                </div>
                <label className="safety-check">
                  <input
                    type="checkbox"
                    checked={acknowledged}
                    onChange={(e) => setAcknowledged(e.target.checked)}
                  />
                  我已閱讀安全提醒，先從外觀觀察開始
                </label>
                <button
                  className="button primary wide"
                  disabled={!acknowledged}
                  onClick={() => go(tutorial.start)}
                >
                  開始互動檢查 <Icon name="arrow" size={18} />
                </button>
                <p className="privacy-note">不需登入 · 回答只留在這次頁面中</p>
                {previousSummary && (
                  <details className="answer-record saved-record">
                    <summary>查看上次留存摘要</summary>
                    <strong>{previousSummary.result}</strong>
                    <pre>{previousSummary.text || previousSummary.result}</pre>
                    <button
                      className="text-link"
                      onClick={() =>
                        download(previousSummary.text || previousSummary.result)
                      }
                    >
                      <Icon name="download" size={14} /> 下載上次摘要
                    </button>
                  </details>
                )}
              </>
            ) : node?.kind === "question" ? (
              <>
                <div className="step-meta">
                  <span className="eyebrow">
                    OBSERVE / {String(answers.length + 1).padStart(2, "0")}
                  </span>
                  <span>已記錄 {answers.length} 項觀察</span>
                </div>
                <h2 ref={heading} tabIndex={-1}>
                  {node.title}
                </h2>
                <p className="principle">{node.description}</p>
                <div className="focus-callout">
                  <span className="pulse-ring" />
                  <div>
                    <small>這一步，請看</small>
                    <strong>{partLabels[node.part]}</strong>
                  </div>
                  <button
                    className="text-link"
                    onClick={() => {
                      setSelected(node.part);
                      if (window.innerWidth <= 820)
                        modelColumn.current?.scrollIntoView({ block: "start" });
                    }}
                  >
                    在模型標示 <Icon name="arrow" size={16} />
                  </button>
                </div>
                <div className="question-block">
                  <span>對照實際設備回答</span>
                  <h3>{node.question}</h3>
                  <div className="answer-buttons">
                    <button onClick={() => answer("yes")}>
                      <span>是</span>
                      {node.yesLabel || "有，符合我的情況"}
                      <Icon name="arrow" size={17} />
                    </button>
                    <button onClick={() => answer("no")}>
                      <span>否</span>
                      {node.noLabel || "沒有這個情況"}
                      <Icon name="arrow" size={17} />
                    </button>
                  </div>
                </div>
                <button
                  className="unsure-button"
                  onClick={() => answer("unsure")}
                >
                  無法確認，先取得安全建議
                </button>
                <div className="lesson-bottom-actions">
                  <button onClick={back}>
                    <Icon name="back" size={16} /> 上一步
                  </button>
                  <button onClick={restart}>重新開始</button>
                </div>
                <p className="inline-safety">
                  <Icon name="shield" size={15} />{" "}
                  {problem.risk === "observe"
                    ? "僅從外部觀察，不拆蓋、不接觸配線。"
                    : "先觀察，任何拆卸前先停止供水。"}
                </p>
              </>
            ) : node?.kind === "result" ? (
              <>
                <div className={"result-mark " + node.severity}>
                  <Icon
                    name={node.severity === "danger" ? "shield" : "check"}
                    size={25}
                  />
                </div>
                <p className="eyebrow">
                  {node.severity === "danger"
                    ? "SAFETY FIRST"
                    : "YOUR NEXT STEP"}
                </p>
                <h2 ref={heading} tabIndex={-1}>
                  {node.title}
                </h2>
                <p className="principle">{node.description}</p>
                <ol className="result-actions">
                  {node.actions.map((action, i) => (
                    <li key={action}>
                      <span>0{i + 1}</span>
                      {action}
                    </li>
                  ))}
                </ol>
                <details className="answer-record">
                  <summary>查看這次的 {answers.length} 項回答</summary>
                  <ol>
                    {answers.map((a, i) => {
                      const n = tutorial.nodes[a.node];
                      return (
                        <li key={a.node + i}>
                          {n.kind === "question" ? n.question : n.title}
                          <strong>
                            {
                              { yes: "是", no: "否", unsure: "無法確認" }[
                                a.value
                              ]
                            }
                          </strong>
                        </li>
                      );
                    })}
                  </ol>
                </details>
                <p className="result-disclaimer">
                  依你的回答提供初步方向，不能取代現場檢查。完成教學不代表設備已修復。
                </p>
                <div className="summary-buttons">
                  <button
                    className="button primary"
                    onClick={() =>
                      setSaveStatus(
                        save(problem.id, node.title, summaryText())
                          ? "已將結果留存在這台裝置。"
                          : "瀏覽器無法儲存，請下載摘要保留。",
                      )
                    }
                  >
                    <Icon name="check" size={16} /> 留存結果
                  </button>
                  <button
                    className="button secondary"
                    onClick={() => download(summaryText())}
                  >
                    <Icon name="download" size={16} /> 下載摘要
                  </button>
                </div>
                <p className="save-status" role="status">
                  {saveStatus}
                </p>
                <div className="lesson-bottom-actions">
                  <button onClick={back}>
                    <Icon name="back" size={16} /> 修改上一個回答
                  </button>
                  <button onClick={restart}>重新開始</button>
                </div>
              </>
            ) : null}
          </div>
        </aside>
      </div>
      <section className="lesson-extra">
        <div>
          <h2>
            <Icon name="shield" size={20} /> 每一步，都以安全為前提
          </h2>
          <p>
            模型展示的是簡化原理，操作方式依品牌與型號而異。無法確認時，保留觀察紀錄並聯絡專業人員。
          </p>
          {tutorial.sources.length > 0 && (
            <details className="source-links">
              <summary>原理與安全參考資料</summary>
              {tutorial.sources.map((s) => (
                <a href={s.url} key={s.url} target="_blank" rel="noreferrer">
                  {s.title} ↗
                </a>
              ))}
            </details>
          )}
        </div>
        <Link href={"/problem/" + nextProblem.id} className="next-lesson">
          <span>
            繼續探索 <Icon name="arrow" size={17} />
          </span>
          <strong>{nextProblem.title}</strong>
          <small>{nextProblem.description}</small>
        </Link>
      </section>
    </div>
  );
}
