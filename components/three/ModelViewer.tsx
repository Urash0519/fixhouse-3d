"use client";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import {
  Component,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { Vector3 } from "three";
import { DeviceScene } from "./DeviceScene";
import { deviceParts, partLabels } from "@/src/data/parts";
import { deviceLabels } from "@/src/data/problems";
import type { Device, PartId, Point3 } from "@/src/types/problem";
import { Icon } from "../Icon";

class SceneBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
// Keep the label in the page's React tree so scene disposal never owns DOM cleanup.
function PartLabelPosition({
  label,
  at,
}: {
  label: RefObject<HTMLSpanElement | null>;
  at: Point3;
}) {
  const point = useRef(new Vector3());
  useFrame(({ camera, size }) => {
    if (!label.current) return;
    point.current.set(...at).project(camera);
    const { x, y, z } = point.current;
    label.current.style.setProperty("left", `${((x + 1) / 2) * size.width}px`);
    label.current.style.setProperty("top", `${((1 - y) / 2) * size.height}px`);
    label.current.style.setProperty(
      "visibility",
      z < -1 || z > 1 ? "hidden" : "visible",
    );
  });
  return null;
}
function CameraRig({
  focus,
  reset,
  device,
  selected,
}: {
  focus: number;
  reset: number;
  device: Device;
  selected: PartId;
}) {
  const controls = useRef<OrbitControlsImpl>(null);
  const { camera } = useThree();
  useEffect(() => {
    if (!focus || !controls.current) return;
    const point = deviceParts[device].find((p) => p.id === selected)?.at || [
      0, 1, 0,
    ];
    controls.current.target.set(...point);
    camera.position.copy(
      new Vector3(...point).add(new Vector3(1.65, 0.9, 2.25)),
    );
    controls.current.update();
  }, [focus, device, camera, selected]);
  useEffect(() => {
    if (!controls.current) return;
    camera.position.set(3, 2.65, 4);
    controls.current.target.set(0, 1.05, 0);
    controls.current.update();
  }, [reset, camera, device]);
  return (
    <OrbitControls
      ref={controls}
      makeDefault
      target={[0, 1.05, 0]}
      enablePan={false}
      minDistance={2}
      maxDistance={7}
      maxPolarAngle={Math.PI / 2.05}
      enableDamping
    />
  );
}
export function ModelViewer({
  device,
  selectedPart,
  onPartClick,
  compact = false,
}: {
  device: Device;
  selectedPart?: PartId;
  onPartClick?: (part: PartId) => void;
  compact?: boolean;
}) {
  const [localPart, setLocalPart] = useState<PartId>(deviceParts[device][0].id);
  const selected = selectedPart || localPart;
  const [cutaway, setCutaway] = useState(true);
  const [faulty, setFaulty] = useState(true);
  const [playing, setPlaying] = useState(
    () =>
      typeof window !== "undefined" &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [progress, setProgress] = useState(0.28);
  const [supported, setSupported] = useState(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
      const available = Boolean(gl);
      gl?.getExtension("WEBGL_lose_context")?.loseContext();
      return available;
    } catch {
      return false;
    }
  });
  const [focus, setFocus] = useState(0);
  const [reset, setReset] = useState(0);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const change = () => {
      if (media.matches) setPlaying(false);
    };
    media.addEventListener("change", change);
    return () => {
      media.removeEventListener("change", change);
      document.body.style.cursor = "";
    };
  }, []);
  useEffect(() => {
    if (!playing) return;
    let last = performance.now();
    const interval = window.setInterval(() => {
      const now = performance.now();
      const delta = Math.min(now - last, 100) / 12000;
      last = now;
      if (document.visibilityState === "visible")
        setProgress((p) => (p + delta) % 1);
    }, 50);
    return () => window.clearInterval(interval);
  }, [playing]);

  const select = (id: PartId) => {
    setLocalPart(id);
    onPartClick?.(id);
  };
  const selectedInfo = deviceParts[device].find((p) => p.id === selected);
  const fallback = (
    <div
      className="scene-fallback"
      role="img"
      aria-label={deviceLabels[device] + "文字示意"}
    >
      <Icon name={device} size={94} />
      <strong>
        {deviceLabels[device]}・{partLabels[selected]}
      </strong>
      <p>{selectedInfo?.explanation || "選擇下方零件，了解它的作用。"}</p>
      <small>此裝置無法啟用 3D，仍可使用下方零件導覽與完整檢查。</small>
    </div>
  );

  return (
    <div
      className={"model-viewer" + (compact ? " model-viewer--compact" : "")}
      data-testid="model-viewer"
    >
      <div className="viewer-topline">
        <span>
          <i className="status-dot" /> LIVE 3D{" "}
          <span className="subtle">／ {deviceLabels[device]}剖面</span>
        </span>
        <span className="micro">可旋轉 · 可縮放</span>
      </div>
      <div
        className="scene-stage"

        role="group"
        aria-label={deviceLabels[device] + "互動 3D 模型"}
      >
        <div className="scene-grid" />
        {supported === null ? (
          <div className="scene-loading">
            <Icon name="cube" size={32} />
            <span>正在準備互動畫面…</span>
          </div>
        ) : !supported ? (
          fallback
        ) : (
          <SceneBoundary fallback={fallback}>
            <Canvas
              frameloop="demand"
              camera={{ position: [3, 2.65, 4], fov: 37 }}
              dpr={[1, 1.6]}
              gl={{ antialias: true, alpha: true }}
              onCreated={({ gl }) => {
                gl.domElement.addEventListener(
                  "webglcontextlost",
                  () => setSupported(false),
                  { once: true },
                );
              }}
            >
              <ambientLight intensity={1.4} />
              <directionalLight
                position={[3, 6, 4]}
                intensity={3}
                color="#f9f1d9"
              />
              <directionalLight
                position={[-4, 3, 1]}
                intensity={1.5}
                color="#78c9c4"
              />
              <DeviceScene
                device={device}
                selected={selected}
                cutaway={cutaway}
                faulty={faulty}
                progress={progress}
                onSelect={select}
              />
              {selectedInfo && (
                <PartLabelPosition label={labelRef} at={selectedInfo.at} />
              )}
              <CameraRig
                focus={focus}
                reset={reset}
                device={device}
                selected={selected}
              />
            </Canvas>
          </SceneBoundary>
        )}
        {supported && (
          <span ref={labelRef} className="part-hotspot scene-part-label">
            <i />
            {partLabels[selected]}
          </span>
        )}
        <div className="scene-toolbar">
          <button
            type="button"
            className={cutaway ? "icon-button active" : "icon-button"}
            aria-pressed={cutaway}
            onClick={() => setCutaway((v) => !v)}
            title="拆解檢視"
            aria-label="拆解檢視"
          >
            <Icon name="cube" />
          </button>
          <button
            type="button"
            className="icon-button"
            onClick={() => setFocus((v) => v + 1)}
            aria-label="聚焦選取零件"
            title="聚焦零件"
            disabled={!supported}
          >
            <Icon name="expand" />
          </button>
          <button
            type="button"
            className="icon-button"
            onClick={() => setReset((v) => v + 1)}
            aria-label="重設視角"
            title="重設視角"
            disabled={!supported}
          >
            <Icon name="reset" />
          </button>
        </div>
        <span className="scene-caption">教學示意模型 · 實際構造依機型而異</span>
        <div className="compare-switch" role="group" aria-label="比較運作狀態">
          <button
            type="button"
            aria-pressed={!faulty}
            onClick={() => setFaulty(false)}
          >
            正常運作
          </button>
          <button
            type="button"
            aria-pressed={faulty}
            onClick={() => setFaulty(true)}
          >
            <i />
            異常示意
          </button>
        </div>
      </div>
      <div className="viewer-playback">
        <button
          type="button"
          className="play-toggle"
          aria-label={playing ? "暫停動畫" : "播放動畫"}
          onClick={() => setPlaying((p) => !p)}
        >
          <Icon name={playing ? "pause" : "play"} size={16} />
        </button>
        <span className="playback-time">
          {Math.floor(progress * 12)
            .toString()
            .padStart(2, "0")}
          <span> / 12s</span>
        </span>
        <input
          type="range"
          min="0"
          max="100"
          step="0.1"
          value={progress * 100}
          aria-label="動畫播放進度"
          onChange={(e) => {
            setPlaying(false);
            setProgress(Number(e.target.value) / 100);
          }}
        />
        <span className="loop-label">循環示意</span>
      </div>
      <div className="part-picker" aria-label="選擇模型零件">
        {deviceParts[device].map((p, i) => (
          <button
            key={p.id}
            type="button"
            aria-pressed={selected === p.id}
            onClick={() => select(p.id)}
          >
            <span>{String(i + 1).padStart(2, "0")}</span>
            {partLabels[p.id]}
          </button>
        ))}
      </div>
      {!compact && (
        <p className="part-explanation" aria-live="polite">
          <Icon name="info" size={16} />
          {selectedInfo?.explanation || "選擇一個零件，看看它的作用。"}
          <span>畫面示意不會代替你的檢查回答。</span>
        </p>
      )}
    </div>
  );
}
