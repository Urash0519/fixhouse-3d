import type { Device, PartId, Point3 } from "../types/problem";
export const partLabels: Record<PartId, string> = {
  body: "設備本體",
  lid: "水箱上蓋",
  fill: "進水閥",
  float: "浮球",
  seal: "止水皮",
  valve: "止水閥",
  drain: "排水口",
  cartridge: "閥芯",
  spout: "出水口",
  joint: "管路接頭",
  head: "噴頭",
  hose: "軟管",
  supply: "供應管路",
  control: "控制面板",
  heater: "加熱區",
  socket: "插座面板",
  switch: "開關",
  bulb: "燈泡",
};
export const deviceParts: Record<
  Device,
  { id: PartId; at: Point3; explanation: string }[]
> = {
  toilet: [
    {
      id: "fill",
      at: [-0.48, 1.65, -0.32],
      explanation: "將供水帶進水箱；水位足夠時應停止進水。",
    },
    {
      id: "float",
      at: [0.4, 1.58, -0.25],
      explanation: "跟著水位升降，控制進水閥的開關。",
    },
    {
      id: "seal",
      at: [0, 1.12, -0.23],
      explanation: "密合水箱底部，防止水持續流入馬桶。",
    },
    {
      id: "valve",
      at: [-0.87, 0.48, -0.25],
      explanation: "控制馬桶的供水。卡住時不要強扭。",
    },
    {
      id: "drain",
      at: [0, 0.63, 0.63],
      explanation: "將污水導向排水管；阻塞會使水位上升。",
    },
  ],
  faucet: [
    {
      id: "cartridge",
      at: [0, 1.12, 0],
      explanation: "把手內的閥芯負責控制流量與關水密封。",
    },
    {
      id: "spout",
      at: [0.6, 1.42, 0],
      explanation: "出水口的持續滴水，可能來自閥芯密封。",
    },
    {
      id: "joint",
      at: [0, 0.48, 0],
      explanation: "底座與供水接頭是另一種常見滲水位置。",
    },
  ],
  sink: [
    {
      id: "drain",
      at: [0, 1.2, 0],
      explanation: "毛髮和皂垢容易堆積在落水頭。",
    },
    {
      id: "joint",
      at: [0, 0.62, 0],
      explanation: "存水彎保留水封，阻止排水管氣味回流。",
    },
    {
      id: "supply",
      at: [0.8, 0.45, 0],
      explanation: "往牆內的排水段需要專業工具檢查。",
    },
  ],
  shower: [
    {
      id: "head",
      at: [0, 1.75, 0],
      explanation: "噴孔水垢會讓水流變細、噴灑不均。",
    },
    {
      id: "hose",
      at: [0.35, 0.78, 0],
      explanation: "軟管折彎或扭結會減少通過的水量。",
    },
    {
      id: "valve",
      at: [-0.35, 0.5, 0],
      explanation: "混水控制與整屋供水，也會影響水流。",
    },
  ],
  pipe: [
    {
      id: "joint",
      at: [0, 1.12, 0],
      explanation: "接頭的密封劣化可能造成局部滲漏。",
    },
    {
      id: "body",
      at: [0.7, 1.12, 0],
      explanation: "管身破損或鏽蝕需更換適合的管件。",
    },
    {
      id: "valve",
      at: [-0.7, 1.38, 0],
      explanation: "先辨認供水閥，安全可及時才關閉。",
    },
  ],
  "water-heater": [
    {
      id: "control",
      at: [0, 1.02, 0.28],
      explanation: "面板可提供模式與錯誤碼，不需拆機查看。",
    },
    {
      id: "supply",
      at: [-0.35, 0.35, 0],
      explanation: "外部管路供應用水；燃氣與電源交由技師確認。",
    },
    {
      id: "heater",
      at: [0, 1.55, 0],
      explanation: "內部加熱區僅供原理展示，請勿自行打開。",
    },
  ],
  outlet: [
    {
      id: "socket",
      at: [0, 1.1, 0.15],
      explanation: "僅觀察面板外觀，不將工具伸入插孔。",
    },
    {
      id: "supply",
      at: [-0.65, 1.1, -0.1],
      explanation: "插座由迴路供電；配線檢查交給合格電工。",
    },
    {
      id: "switch",
      at: [0.65, 1.1, 0.05],
      explanation: "部分插座設有獨立控制開關。",
    },
  ],
  breaker: [
    {
      id: "switch",
      at: [0, 1.22, 0.22],
      explanation: "斷路器跳脫用來保護迴路，不代表應立即復歸。",
    },
    {
      id: "supply",
      at: [-0.5, 0.7, 0],
      explanation: "多台高功率電器共用迴路可能過載。",
    },
    { id: "body", at: [0, 1.7, 0], explanation: "只看面板，不拆配電箱外蓋。" },
  ],
  light: [
    {
      id: "bulb",
      at: [0, 1.12, 0],
      explanation: "燈泡與內部驅動器都可能老化。",
    },
    {
      id: "switch",
      at: [0.8, 0.65, 0],
      explanation: "從正常外部開關確認燈具是否有開啟。",
    },
    {
      id: "supply",
      at: [0, 1.9, 0],
      explanation: "燈座、配線及固定式燈具維修交由電工。",
    },
  ],
};
