"use client";

import { type ThreeElements, useThree } from "@react-three/fiber";
import { forwardRef, useMemo } from "react";
import * as THREE from "three";

type PartShape = "box" | "cylinder";

interface PartDefinition {
  name:
    | "toilet_body"
    | "tank"
    | "tank_lid"
    | "fill_valve"
    | "float"
    | "flapper"
    | "flush_valve"
    | "shutoff_valve";
  shape: PartShape;
  args: [number, number, number] | [number, number, number, number];
  position: [number, number, number];
  rotation?: [number, number, number];
  color: string;
}

export interface ToiletModelProps {
  selectedPart?: string;
  onPartClick?: (part: string) => void;
}

const partDefinitions: PartDefinition[] = [
  {
    name: "toilet_body",
    shape: "box",
    args: [1.3, 0.45, 1.05],
    position: [0, 0.32, 0.16],
    color: "#8e8c8a",
  },
  {
    name: "tank",
    shape: "box",
    args: [0.72, 0.38, 0.36],
    position: [0, 1.08, 0.34],
    color: "#d3d1ce",
  },
  {
    name: "tank_lid",
    shape: "box",
    args: [0.78, 0.04, 0.36],
    position: [0, 1.31, 0.34],
    color: "#faf7f2",
  },
  {
    name: "fill_valve",
    shape: "cylinder",
    args: [0.06, 0.06, 0.28, 24],
    position: [0.16, 1.08, 0.3],
    color: "#3f7cff",
  },
  {
    name: "float",
    shape: "cylinder",
    args: [0.08, 0.08, 0.26, 24],
    position: [0.11, 0.76, 0.35],
    rotation: [Math.PI / 2, 0, 0],
    color: "#f6cc66",
  },
  {
    name: "flapper",
    shape: "box",
    args: [0.34, 0.05, 0.48],
    position: [0, 0.62, -0.32],
    rotation: [Math.PI / 10, 0, 0],
    color: "#7a7a7a",
  },
  {
    name: "flush_valve",
    shape: "cylinder",
    args: [0.1, 0.1, 0.18, 24],
    position: [0, 0.58, -0.52],
    color: "#b4b4b4",
  },
  {
    name: "shutoff_valve",
    shape: "cylinder",
    args: [0.07, 0.07, 0.28, 24],
    position: [0.42, 1.06, 0.22],
    rotation: [Math.PI / 2, 0, 0],
    color: "#6a5adf",
  },
];

const getMaterial = (partName: string, selectedPart?: string) => {
  const isHighlighted = selectedPart === partName;
  const fallbackOpacity = selectedPart ? 0.22 : 1;
  return {
    color: isHighlighted ? "#ffbf47" : "#8e8e8e",
    emissive: isHighlighted ? "#ffbe4f" : "#000000",
    emissiveIntensity: isHighlighted ? 0.35 : 0,
    opacity: isHighlighted ? 1 : fallbackOpacity,
    transparent: fallbackOpacity < 1,
  };
};

const getBaseColor = (name: string) => {
  const item = partDefinitions.find((p) => p.name === name);
  return item?.color ?? "#9ba0a6";
};

export const ToiletModel = forwardRef<THREE.Group, ToiletModelProps>(
  ({ selectedPart, onPartClick }, ref) => {
    const { viewport } = useThree();
    const scale = useMemo(() => Math.max(viewport.width, viewport.height) * 0.35, [viewport.width, viewport.height]);

    return (
      <group ref={ref} scale={scale / 2.8}>
        {partDefinitions.map((part) => {
          const material = getMaterial(part.name, selectedPart);
          const baseColor = getBaseColor(part.name);
          const commonProps: Omit<ThreeElements["mesh"], "geometry" | "material"> = {
            name: part.name,
            position: part.position,
            rotation: part.rotation,
            onPointerOver: (event) => {
              event.stopPropagation();
              event.object.scale.setScalar(1.04);
            },
            onPointerOut: (event) => {
              event.object.scale.setScalar(1);
            },
            onPointerDown: (event) => {
              event.stopPropagation();
              onPartClick?.(part.name);
            },
          };

          return (
            <mesh key={part.name} {...commonProps}>
              {part.shape === "box" ? (
                <boxGeometry args={part.args as [number, number, number]} />
              ) : (
                <cylinderGeometry
                  args={part.args as [number, number, number, number]}
                />
              )}
              <meshStandardMaterial
                color={selectedPart === part.name ? material.color : baseColor}
                emissive={material.emissive}
                emissiveIntensity={material.emissiveIntensity}
                transparent={material.transparent}
                opacity={material.opacity}
                roughness={0.35}
              />
            </mesh>
          );
        })}
      </group>
    );
  }
);

ToiletModel.displayName = "ToiletModel";
