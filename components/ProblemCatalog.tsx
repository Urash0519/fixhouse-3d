"use client";
import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { problems, deviceLabels } from "@/src/data/problems";
import { useProgress } from "@/src/data/progress";
import type { ProblemCategory } from "@/src/types/problem";
import { ProblemCard } from "./ProblemCard";
import { Icon } from "./Icon";
function CatalogControls({ preview = false }: { preview?: boolean }) {
  const params = useSearchParams();
  const [categoryOverride, setCategory] = useState<
    "all" | ProblemCategory | null
  >(null);
  const value = params.get("category");
  const category =
    categoryOverride ??
    (value === "water" || value === "electrical" ? value : "all");
  const [queryOverride, setQuery] = useState<string | null>(null);
  const query = queryOverride ?? params.get("q") ?? "";
  const [onlySaved, setOnlySaved] = useState(false);
  const { summaries } = useProgress();
  const filtered = useMemo(
    () =>
      problems.filter(
        (p) =>
          (category === "all" || p.category === category) &&
          (!onlySaved || summaries.some((s) => s.id === p.id)) &&
          [p.title, p.description, deviceLabels[p.device], ...p.keywords]
            .join(" ")
            .toLowerCase()
            .includes(query.trim().toLowerCase()),
      ),
    [category, query, onlySaved, summaries],
  );
  const visible =
    preview && !query && category === "all" ? filtered.slice(0, 6) : filtered;
  const reset = () => {
    setQuery("");
    setCategory("all");
    setOnlySaved(false);
  };
  return (
    <section className="catalog" id="browse" aria-labelledby="catalog-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">02 / EXPLORE THE EVERYDAY</p>
          <h2 id="catalog-title">
            {preview ? "你家，遇到了什麼問題？" : "找到你想看懂的問題"}
          </h2>
        </div>
        {preview && (
          <Link href="/problems" className="text-link">
            全部 10 個教學 <Icon name="arrow" size={18} />
          </Link>
        )}
      </div>
      <div className="catalog-toolbar">
        <div className="filter-tabs" role="group" aria-label="問題分類">
          {(
            [
              { id: "all", label: "所有問題", count: 10 },
              { id: "water", label: "水的問題", count: 7 },
              { id: "electrical", label: "電的問題", count: 3 },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              aria-pressed={category === tab.id}
              onClick={() => setCategory(tab.id)}
            >
              {tab.id !== "all" && <Icon name={tab.id} size={16} />}
              {tab.label}
              <span>{tab.count}</span>
            </button>
          ))}
        </div>
        <label className="search-field">
          <Icon name="search" size={18} />
          <input
            type="search"
            placeholder="搜尋問題、設備或症狀…"
            aria-label="搜尋問題、設備或症狀"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
      </div>
      {!preview && (
        <div className="catalog-status">
          <span role="status">找到 {filtered.length} 個教學</span>
          <label>
            <input
              type="checkbox"
              checked={onlySaved}
              onChange={(e) => setOnlySaved(e.target.checked)}
            />{" "}
            只看已留存摘要（{summaries.length}）
          </label>
        </div>
      )}
      {visible.length ? (
        <div className="problem-grid">
          {visible.map((p) => (
            <ProblemCard
              key={p.id}
              problem={p}
              styleIndex={problems.indexOf(p)}
              completed={summaries.some((s) => s.id === p.id)}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Icon name="search" size={32} />
          <h3>{onlySaved ? "還沒有符合條件的摘要" : "沒有找到相符的問題"}</h3>
          <p>試試「漏水」、「燈泡」或「浴室」，也可以重新查看全部教學。</p>
          <button className="button secondary" onClick={reset}>
            清除篩選
          </button>
        </div>
      )}
      {preview && visible.length < filtered.length && (
        <Link href="/problems" className="all-courses">
          繼續探索所有問題 <Icon name="arrow" size={18} />
        </Link>
      )}
    </section>
  );
}

export function ProblemCatalog({ preview = false }: { preview?: boolean }) {
  return (
    <Suspense
      fallback={
        <section className="catalog">
          <div className="section-heading">
            <h2>探索居家問題</h2>
          </div>
          <div className="problem-grid">
            {(preview ? problems.slice(0, 6) : problems).map((p, i) => (
              <ProblemCard key={p.id} problem={p} styleIndex={i} />
            ))}
          </div>
        </section>
      }
    >
      <CatalogControls preview={preview} />
    </Suspense>
  );
}
