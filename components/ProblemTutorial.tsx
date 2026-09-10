"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ModelViewer } from "./three/ModelViewer";
import {
  type Problem,
  type ToiletRunningWaterTutorial,
  type TutorialNode,
  type TutorialStateKey,
} from "@/src/types/problem";
import { TutorialPanel } from "./TutorialPanel";

const FLOW_NODES: Record<TutorialStateKey, TutorialNode> = {
  "open-tank": {
    key: "open-tank",
    mode: "info",
    title: "步驟 1：打開馬桶水箱上蓋",
    description: "將水箱上蓋輕輕取下。",
    targetPart: "tank",
    ctaLabel: "下一步",
    continueNext: "ask-flow",
  },
  "ask-flow": {
    key: "ask-flow",
    mode: "question",
    title: "步驟 2：觀察水箱內部",
    description: "水是否持續流入馬桶？",
    question: "水是否持續流入馬桶？",
    targetPart: "fill_valve",
    yesNext: "ask-flapper",
    noNext: "ask-float",
  },
  "ask-flapper": {
    key: "ask-flapper",
    mode: "question",
    title: "步驟 3：檢查止水皮",
    description: "確認止水皮是否完整密合。",
    question: "止水皮是否有歪斜、變形或沒有密合？",
    targetPart: "flapper",
    yesNext: "result-flapper",
    noNext: "ask-float",
  },
  "result-flapper": {
    key: "result-flapper",
    mode: "result",
    title: "結果 A：止水皮問題",
    description: "確認到止水皮密合異常。",
    targetPart: "flapper",
    causes: ["止水皮老化或沒有完全密合。"],
    recommendation:
      "可以先重新調整止水皮位置。若止水皮已經硬化、破損或變形，建議更換新的止水皮。",
    ctaLabel: "完成本題",
  },
  "ask-float": {
    key: "ask-float",
    mode: "question",
    title: "步驟 4：檢查浮球",
    description: "浮球是否已經升到正常停止進水的位置？",
    question: "浮球是否已經升到正常停止進水的位置？",
    targetPart: "float",
    yesNext: "check-fill-valve",
    noNext: "result-float",
  },
  "check-fill-valve": {
    key: "check-fill-valve",
    mode: "info",
    title: "步驟 5：檢查進水閥",
    description: "如果仍持續進水，可能是進水閥異常。",
    targetPart: "fill_valve",
    ctaLabel: "確認結果",
    continueNext: "result-fill-valve",
  },
  "result-float": {
    key: "result-float",
    mode: "result",
    title: "結果 B：浮球問題",
    description: "浮球位置設定異常。",
    targetPart: "float",
    causes: ["浮球位置設定異常。"],
    recommendation: "建議重新調整浮球高度與浮力桿，確認浮球可正常停住進水。",
    ctaLabel: "完成本題",
  },
  "result-fill-valve": {
    key: "result-fill-valve",
    mode: "result",
    title: "結果 C：進水閥問題",
    description: "浮球正常但仍持續進水。",
    targetPart: "fill_valve",
    causes: ["進水閥可能故障。"],
    recommendation: "先關閉止水閥並檢查進水閥是否阻塞、卡滯或損壞。",
    ctaLabel: "完成本題",
  },
  completed: {
    key: "completed",
    mode: "result",
    title: "診斷完成",
    description: "你已完成本次檢查流程。",
    targetPart: "toilet_body",
    causes: ["完成馬桶一直流水的初步判斷。"],
    recommendation: "若尚有異常，建議依建議項目處理，並在無法改善時請專業師傅協助。",
    ctaLabel: "重新開始",
    continueNext: "open-tank",
  },
};

export function ProblemTutorial({
  problem,
  tutorial,
}: {
  problem: Problem;
  tutorial: ToiletRunningWaterTutorial;
}) {
  const [stateKey, setStateKey] = useState<TutorialStateKey>("open-tank");
  const currentNode = FLOW_NODES[stateKey];

  const selectedPart = useMemo(() => currentNode.targetPart, [currentNode]);

  const handleAnswer = (value: "yes" | "no") => {
    if (currentNode.mode !== "question") return;
    if (value === "yes" && currentNode.yesNext) {
      setStateKey(currentNode.yesNext);
      return;
    }
    if (value === "no" && currentNode.noNext) {
      setStateKey(currentNode.noNext);
    }
  };

  const handleContinue = () => {
    if (currentNode.mode === "question") return;
    setStateKey(currentNode.continueNext ?? "completed");
  };

  const handleRestart = () => {
    setStateKey("open-tank");
  };

  const partClickHint = useMemo(() => {
    const partNameMap: Record<string, string> = {
      tank: "水箱",
      fill_valve: "進水閥",
      float: "浮球",
      flapper: "止水皮",
      flush_valve: "沖水閥",
      shutoff_valve: "止水閥",
      toilet_body: "馬桶本體",
      tank_lid: "水箱上蓋",
    };
    if (currentNode.mode === "result") {
      const partLabel = partNameMap[currentNode.targetPart];
      return `可點選模型確認${partLabel ?? currentNode.targetPart}`;
    }
    return "";
  }, [currentNode]);

  return (
    <section className="tutorial-layout">
      <div className="viewer-wrap">
        <ModelViewer selectedPart={selectedPart} />
      </div>
      <TutorialPanel
        problem={problem}
        tutorial={tutorial}
        node={currentNode}
        onAnswer={handleAnswer}
        onContinue={handleContinue}
        onRestart={handleRestart}
      />
      {partClickHint && (
        <p style={{ margin: "0.35rem 0 0", color: "#4a5568", fontSize: "0.85rem" }}>
          {partClickHint}
        </p>
      )}
      <Link href="/problems" className="back-link">
        返回問題列表
      </Link>
    </section>
  );
}
