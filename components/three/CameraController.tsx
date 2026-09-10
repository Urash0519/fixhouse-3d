"use client";

import { OrbitControls } from "@react-three/drei";
import { type ComponentProps, forwardRef } from "react";

type CameraControllerProps = Omit<ComponentProps<typeof OrbitControls>, "ref">;

export const CameraController = forwardRef<any, CameraControllerProps>((props, ref) => {
  return <OrbitControls ref={ref} enablePan={false} minDistance={1.8} maxDistance={8} {...props} />;
});

CameraController.displayName = "CameraController";
