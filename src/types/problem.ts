export type ProblemCategory = "water" | "electrical";

export interface Problem {
  id: string;
  title: string;
  category: ProblemCategory;
  device: string;
  available: boolean;
}

export interface TutorialStep {
  id: string;
  title: string;
  description: string;
  targetPart: string;
}

export interface ToiletRunningWaterTutorial {
  id: string;
  title: string;
  description: string;
  riskLevel: "low" | "medium" | "high";
  causes: string[];
  steps: TutorialStep[];
  safetyTips: string[];
}

export type TutorialMode = "info" | "question" | "result";

export type TutorialStateKey =
  | "open-tank"
  | "ask-flow"
  | "ask-flapper"
  | "result-flapper"
  | "ask-float"
  | "check-fill-valve"
  | "result-float"
  | "result-fill-valve"
  | "completed";

export interface TutorialNode {
  key: TutorialStateKey;
  mode: TutorialMode;
  title: string;
  description: string;
  targetPart: string;
  question?: string;
  ctaLabel?: string;
  yesLabel?: string;
  noLabel?: string;
  yesNext?: TutorialStateKey;
  noNext?: TutorialStateKey;
  continueNext?: TutorialStateKey;
  causes?: string[];
  recommendation?: string;
}

