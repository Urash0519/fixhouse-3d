import Link from "next/link";
import { Icon } from "@/components/Icon";
export default function NotFound() {
  return (
    <section className="empty-page">
      <Icon name="search" size={48} />
      <p className="eyebrow">404 / PAGE NOT FOUND</p>
      <h1>這個房間還找不到</h1>
      <p>連結可能有誤，回到教學列表繼續探索。</p>
      <Link className="button primary" href="/problems">
        查看所有教學 <Icon name="arrow" />
      </Link>
    </section>
  );
}
