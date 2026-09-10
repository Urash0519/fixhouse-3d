import Link from "next/link";

export function ComingSoon({ title }: { title: string }) {
  return (
    <section className="coming-soon">
      <h1>{title}</h1>
      <p>此項目正在製作中。</p>
      <Link href="/problems" className="back-link">
        返回問題列表
      </Link>
    </section>
  );
}

