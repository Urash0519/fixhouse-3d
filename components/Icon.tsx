import type { CSSProperties } from "react";
const paths: Record<string, string> = {
  arrow: "M4 12h15m-6-6 6 6-6 6",
  back: "M20 12H5m6-6-6 6 6 6",
  play: "m9 5 11 7-11 7Z",
  pause: "M8 5v14M16 5v14",
  reset: "M4 10a8 8 0 1 1 1 8M4 4v6h6",
  search: "M21 21l-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z",
  check: "m5 12 4 4L19 6",
  close: "m6 6 12 12M6 18 18 6",
  chevron: "m9 5 7 7-7 7",
  water: "M12 3C9 8 5 11 5 15a7 7 0 0 0 14 0c0-4-4-7-7-12ZM8 15c0 2 1 3 3 3",
  electrical: "m14 2-9 12h6l-1 8 9-12h-6Z",
  shield: "m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6Zm-4 9 3 3 5-6",
  cube: "m12 2 9 5v10l-9 5-9-5V7Zm0 10 9-5M12 12 3 7m9 5v10",
  clock: "M12 7v5l4 2m5-2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
  expand: "M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5",
  download: "M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5",
  toilet: "M6 3h12v7H6Zm0 7H4v3c0 4 4 5 5 5v3h7v-4c3-1 4-3 4-7ZM9 6h3",
  faucet: "M5 20v-3h14v3M9 17V9h9v5h3V7c0-1-1-2-3-2h-5V2M8 2h10M8 12H4",
  sink: "M3 10h18v3c0 4-4 5-9 5s-9-1-9-5Zm8-1V5a3 3 0 0 1 6 0M12 18v4",
  shower:
    "M7 22V6a4 4 0 0 1 8 0v2m-4 0h8l2 4H9Zm1 7v2m4-2v2m4-2v2m-8 3v2m4-2v2m4-2v2",
  pipe: "M3 8h11V3h5v10H8v8H3ZM1 7v7m12-12h7M2 19h7",
  "water-heater": "M5 3h14v15H5Zm3 15v4m8-4v4M8 7h8m-8 4h8m-8 3h3",
  outlet: "M5 2h14v20H5ZM9 7v4m6-4v4m-5 5h4m-4 2h4",
  breaker: "M3 3h18v18H3ZM7 7h4v7H7Zm8 0h2m-2 4h2m-2 4h2M7 18h10",
  light: "M9 18h6m-5 3h4m-5-5c0-3-4-4-4-8a7 7 0 0 1 14 0c0 4-4 5-4 8ZM12 1v2",
  home: "m3 11 9-8 9 8M5 9v12h14V9m-10 12v-7h6v7",
  info: "M12 10v7m0-11v1m9 5a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
};
export function Icon({
  name,
  size = 20,
  style,
}: {
  name: string;
  size?: number;
  style?: CSSProperties;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={style}
    >
      <path d={paths[name] || paths.cube} />
    </svg>
  );
}
