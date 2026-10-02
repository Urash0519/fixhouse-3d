import Link from "next/link";
import { HomeHero } from "@/components/HomeHero";
import { ProblemCatalog } from "@/components/ProblemCatalog";
import { Icon } from "@/components/Icon";
export default function HomePage() {
  return (
    <>
      <HomeHero />
      <div className="facts-strip">
        <div>
          <strong>
            10<span>個</span>
          </strong>
          <p>常見居家問題</p>
        </div>
        <div>
          <strong>3D</strong>
          <p>看得見的運作原理</p>
        </div>
        <div>
          <strong>
            2–3<span>分鐘</span>
          </strong>
          <p>從看懂到初步判斷</p>
        </div>
        <div className="facts-note">
          <Icon name="shield" size={28} />
          <p>
            從安全觀察開始
            <br />
            <span>清楚知道，哪一步需要專業</span>
          </p>
        </div>
      </div>
      <section className="learning-paths" id="how-it-works">
        <div className="section-heading">
          <div>
            <p className="eyebrow">01 / SEE. UNDERSTAND. TAKE ACTION.</p>
            <h2>把不熟悉，變成看得懂。</h2>
          </div>
          <p className="section-intro">
            不用先記住零件名稱。
            <br />
            跟著畫面，一次理解一件事。
          </p>
        </div>
        <div className="path-grid">
          {[
            {
              n: "01",
              icon: "cube",
              title: "先看見原理",
              text: "旋轉、拆解、比較正常與異常，讓藏在設備裡的運作浮現。",
            },
            {
              n: "02",
              icon: "search",
              title: "跟著線索檢查",
              text: "對照眼前的設備回答問題，模型會亮起當下該觀察的零件。",
            },
            {
              n: "03",
              icon: "shield",
              title: "知道下一步",
              text: "取得可能原因與處理方向，也知道何時該停手、交給專業。",
            },
          ].map((item) => (
            <article key={item.n} className="path-card">
              <div>
                <span>{item.n}</span>
                <Icon name={item.icon} size={25} />
              </div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>
      <ProblemCatalog preview />
      <section className="safety-banner">
        <span className="safety-symbol">
          <Icon name="shield" size={30} />
        </span>
        <div>
          <p className="eyebrow">KNOW YOUR LIMITS</p>
          <h2>懂得停手，也是解決問題的一步。</h2>
          <p>
            遇到瓦斯味、焦味、火花或漏水靠近電器，先停止使用。每堂教學都會陪你確認安全界線。
          </p>
        </div>
        <Link href="/problems?category=electrical" className="text-link">
          了解用電問題 <Icon name="arrow" size={18} />
        </Link>
      </section>
    </>
  );
}
