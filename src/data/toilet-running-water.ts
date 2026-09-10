import type { ToiletRunningWaterTutorial } from "@/src/types/problem";

export const toiletRunningWaterTutorial: ToiletRunningWaterTutorial = {
  id: "toilet-running-water",
  title: "馬桶一直流水",
  description:
    "馬桶沖水完成後仍然持續有流水聲，或水箱一直重新進水。",
  riskLevel: "low",
  causes: ["止水皮沒有密合", "浮球位置異常", "進水閥異常"],
  safetyTips: [
    "維修前建議先關閉馬桶止水閥。",
    "如果出現大量漏水，請立即關閉水源。",
  ],
  steps: [
    {
      id: "open-tank",
      title: "打開水箱",
      description: "取下馬桶水箱上蓋。",
      targetPart: "tank",
    },
    {
      id: "check-flapper",
      title: "檢查止水皮",
      description: "檢查止水皮是否完整密合。",
      targetPart: "flapper",
    },
    {
      id: "check-float",
      title: "檢查浮球",
      description: "觀察浮球是否正常升起。",
      targetPart: "float",
    },
    {
      id: "check-fill-valve",
      title: "檢查進水閥",
      description: "如果仍持續進水，可能是進水閥異常。",
      targetPart: "fill_valve",
    },
  ],
};

