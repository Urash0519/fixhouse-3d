export type ProblemCategory = "water" | "electrical";
export type Device =
  | "toilet"
  | "faucet"
  | "sink"
  | "shower"
  | "pipe"
  | "water-heater"
  | "outlet"
  | "breaker"
  | "light";
export type PartId =
  | "body"
  | "lid"
  | "fill"
  | "float"
  | "seal"
  | "valve"
  | "drain"
  | "cartridge"
  | "spout"
  | "joint"
  | "head"
  | "hose"
  | "supply"
  | "control"
  | "heater"
  | "socket"
  | "switch"
  | "bulb";
export type Point3 = [number, number, number];
export interface Problem {
  id: string;
  title: string;
  category: ProblemCategory;
  device: Device;
  description: string;
  duration: string;
  risk: "basic" | "observe";
  keywords: string[];
}
export interface Chapter {
  title: string;
  description: string;
  part: PartId;
}
export interface QuestionNode {
  kind: "question";
  title: string;
  description: string;
  part: PartId;
  question: string;
  yes: string;
  no: string;
  yesLabel?: string;
  noLabel?: string;
}
export interface ResultNode {
  kind: "result";
  title: string;
  description: string;
  part: PartId;
  severity: "notice" | "professional" | "danger";
  actions: string[];
}
export type FlowNode = QuestionNode | ResultNode;
export interface Tutorial {
  id: string;
  principle: string;
  chapters: [Chapter, Chapter, Chapter];
  safety: string[];
  start: string;
  nodes: Record<string, FlowNode>;
  sources: { title: string; url: string }[];
}
export interface Answer {
  node: string;
  value: "yes" | "no" | "unsure";
}
