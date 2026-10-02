"use client";
import Link from "next/link";
import { useState } from "react";
import { ModelPreview } from "./ModelPreview";
import { Icon } from "./Icon";
import { tutorials } from "@/src/data/tutorials";
import type { PartId } from "@/src/types/problem";
export function HomeHero() {
  const [chapter, setChapter] = useState(0);
  const [selected, setSelected] = useState<PartId>("fill");
  const lesson = tutorials["toilet-running-water"];
  return (
    <section className="home-hero">
      <div className="hero-copy">
        <p className="eyebrow">
          <span className="tiny-line" /> A LITTLE KNOW-HOW. A BETTER HOME.
        </p>
        <h1>
          家的小問題，
          <br />
          <em>看懂</em>就有方向。
        </h1>
        <p className="hero-description">
          水為什麼一直流？燈為什麼不亮？
          <br />
          轉個角度，用 3D 看見原因，
          <br className="mobile-break" />
          一步步找到接下來該做的事。
        </p>
        <div className="hero-actions">
          <Link href="/problem/toilet-running-water" className="button primary">
            <Icon name="play" size={16} /> 開始第一個互動教學{" "}
            <Icon name="arrow" size={18} />
          </Link>
          <Link href="#browse" className="text-link">
            探索所有問題 <Icon name="arrow" size={17} />
          </Link>
        </div>
        <div className="hero-promises">
          <span>
            <Icon name="check" size={14} /> 不需要專業知識
          </span>
          <span>
            <Icon name="check" size={14} /> 隨時暫停、反覆看
          </span>
        </div>
        <div className="hero-annotation">
          <span className="annotation-line" />
          先試著點一下右邊的零件。<span className="hand-arrow">↗</span>
        </div>
      </div>
      <div className="hero-demo">
        <div className="demo-heading">
          <span>
            試看一堂 <span className="dot-separator">·</span> 馬桶一直流水
          </span>
          <span className="demo-live">互動體驗</span>
        </div>
        <ModelPreview
          device="toilet"
          selectedPart={selected}
          onPartClick={setSelected}
          compact
        />
        <div className="hero-chapters" role="group" aria-label="試看章節">
          {lesson.chapters.map((c, i) => (
            <button
              key={c.title}
              aria-pressed={chapter === i}
              onClick={() => {
                setChapter(i);
                setSelected(c.part);
              }}
            >
              <span>0{i + 1}</span>
              {["進水", "水位", "止水"][i]}
              <i />
            </button>
          ))}
        </div>
        <div className="demo-caption" aria-live="polite">
          <span>0{chapter + 1}</span>
          <div>
            <strong>{lesson.chapters[chapter].title}</strong>
            <p>{lesson.chapters[chapter].description}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
