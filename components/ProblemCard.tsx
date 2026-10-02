import Link from "next/link";
import type { CSSProperties } from "react";
import type { Problem } from "@/src/types/problem";
import { Icon } from "./Icon";
export function ProblemCard({
  problem,
  styleIndex = 0,
  completed = false,
}: {
  problem: Problem;
  styleIndex?: number;
  completed?: boolean;
}) {
  return (
    <Link
      href={"/problem/" + problem.id}
      className={"problem-card " + problem.category}
      style={{ "--idx": styleIndex } as CSSProperties}
    >
      <div className="card-visual">
        <span className="card-number">
          {problem.category === "water" ? "WATER" : "POWER"} /{" "}
          {String(styleIndex + 1).padStart(2, "0")}
        </span>
        <div className="device-drawing">
          <Icon name={problem.device} size={85} />
        </div>
        <span className="card-dimension">
          <Icon name="cube" size={13} /> 3D 互動
        </span>
        {completed && (
          <span className="completed-tag">
            <Icon name="check" size={12} /> 已留存摘要
          </span>
        )}
      </div>
      <div className="card-copy">
        <div className="card-meta">
          <span>{problem.risk === "basic" ? "基礎觀察" : "安全觀察"}</span>
          <span>
            <Icon name="clock" size={13} /> 約 {problem.duration} 分鐘
          </span>
        </div>
        <h3>
          {problem.title}
          <Icon name="arrow" size={19} />
        </h3>
        <p>{problem.description}</p>
      </div>
    </Link>
  );
}
