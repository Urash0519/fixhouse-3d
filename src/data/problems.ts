import type { Problem } from "@/src/types/problem";

export const problems: Problem[] = [
  {
    id: "toilet-running-water",
    title: "馬桶一直流水",
    category: "water",
    device: "toilet",
    available: true,
  },
  {
    id: "faucet-leak",
    title: "水龍頭漏水",
    category: "water",
    device: "faucet",
    available: false,
  },
  {
    id: "sink-clogged",
    title: "洗手台堵塞",
    category: "water",
    device: "sink",
    available: false,
  },
  {
    id: "toilet-clogged",
    title: "馬桶堵塞",
    category: "water",
    device: "toilet",
    available: false,
  },
  {
    id: "shower-low-pressure",
    title: "蓮蓬頭水壓不足",
    category: "water",
    device: "shower",
    available: false,
  },
  {
    id: "pipe-leak",
    title: "水管漏水",
    category: "water",
    device: "pipe",
    available: false,
  },
  {
    id: "water-heater-no-hot-water",
    title: "熱水器沒有熱水",
    category: "water",
    device: "water-heater",
    available: false,
  },
  {
    id: "outlet-no-power",
    title: "插座沒電",
    category: "electrical",
    device: "outlet",
    available: false,
  },
  {
    id: "breaker-trip",
    title: "跳電",
    category: "electrical",
    device: "breaker",
    available: false,
  },
  {
    id: "light-not-working",
    title: "燈不亮",
    category: "electrical",
    device: "light",
    available: false,
  },
];

