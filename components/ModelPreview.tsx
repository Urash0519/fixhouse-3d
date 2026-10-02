"use client";
import dynamic from "next/dynamic";
import { Icon } from "./Icon";
export const ModelPreview = dynamic(
  () => import("./three/ModelViewer").then((m) => m.ModelViewer),
  {
    ssr: false,
    loading: () => (
      <div className="model-placeholder">
        <Icon name="cube" size={36} />
        <p>準備 3D 互動畫面</p>
      </div>
    ),
  },
);
