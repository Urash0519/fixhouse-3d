"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { type RefObject, useCallback, useEffect, useRef } from "react";
import { Group } from "three";
import * as THREE from "three";
import { CameraController } from "./CameraController";
import { ToiletModel } from "./ToiletModel";

type ModelViewerProps = {
  selectedPart?: string;
  onPartClick?: (part: string) => void;
};

function ViewerScene({
  selectedPart,
  onPartClick,
  controlsRef,
  modelRef,
  registerInitialCamera,
}: {
  selectedPart?: string;
  onPartClick?: (part: string) => void;
  controlsRef: RefObject<any>;
  modelRef: RefObject<Group>;
  registerInitialCamera: (camera: THREE.PerspectiveCamera) => void;
}) {
  const { camera } = useThree();

  useEffect(() => {
    registerInitialCamera(camera as THREE.PerspectiveCamera);
  }, [camera, registerInitialCamera]);

  return (
    <>
      <ambientLight intensity={0.75} />
      <directionalLight intensity={1.2} position={[4, 5, 4]} castShadow />
      <ToiletModel
        ref={modelRef}
        selectedPart={selectedPart}
        onPartClick={onPartClick}
      />
      <CameraController
        ref={controlsRef}
        enableDamping
        dampingFactor={0.11}
      />
    </>
  );
}

export function ModelViewer({ selectedPart, onPartClick }: ModelViewerProps) {
  const controlsRef = useRef<any>(null);
  const modelRef = useRef<Group>(null);
  const initialCamera = useRef({
    position: new THREE.Vector3(0, 1.3, 3.6),
    target: new THREE.Vector3(0, 0.78, 0.06),
  });

  const registerInitialCamera = useCallback((camera: THREE.PerspectiveCamera) => {
    initialCamera.current = {
      position: camera.position.clone(),
      target: new THREE.Vector3(0, 0.78, 0.06),
    };
  }, []);

  const handleReset = () => {
    const controls = controlsRef.current;
    if (!controls?.object) return;
    controls.reset();
    controls.target.copy(initialCamera.current.target);
    controls.object.position.copy(initialCamera.current.position);
    controls.object.lookAt(initialCamera.current.target);
    controls.update();
  };

  const focusOnSelectedPart = () => {
    const controls = controlsRef.current;
    const model = modelRef.current;
    if (!controls?.object || !model) return;

    const targetName = selectedPart ?? "toilet_body";
    const targetPart = model.getObjectByName(targetName);
    if (!targetPart) {
      return;
    }

    const point = new THREE.Vector3();
    targetPart.getWorldPosition(point);
    controls.target.copy(point);
    const distance = 1.2;
    controls.object.position.copy(point.clone().add(new THREE.Vector3(distance, distance * 0.7, distance + 0.9)));
    controls.object.lookAt(point);
    controls.update();
  };

  useEffect(() => {
    if (selectedPart) {
      focusOnSelectedPart();
    }
  }, [selectedPart]);

  return (
    <div className="viewer-wrap">
      <Canvas className="canvas-host" camera={{ position: [0, 1.3, 3.6], fov: 45 }}>
        <ViewerScene
          selectedPart={selectedPart}
          onPartClick={onPartClick}
          controlsRef={controlsRef}
          modelRef={modelRef}
          registerInitialCamera={registerInitialCamera}
        />
      </Canvas>
      <div className="viewer-toolbar">
        <button type="button" onClick={focusOnSelectedPart}>
          Focus
        </button>
        <button type="button" onClick={handleReset}>
          Reset Camera
        </button>
      </div>
    </div>
  );
}
