"use client";
import { useMemo, type ReactNode } from "react";
import { RoundedBox } from "@react-three/drei";
import { CatmullRomCurve3, DoubleSide, Vector2, Vector3 } from "three";
import type { Device, PartId, Point3 } from "@/src/types/problem";

type Props = {
  device: Device;
  selected: PartId;
  cutaway: boolean;
  faulty: boolean;
  progress: number;
  onSelect: (id: PartId) => void;
};
const ceramic = "#dfe8e1",
  metal = "#7d979b",
  aqua = "#63d6d3",
  amber = "#e4b26d",
  coral = "#ec8c78";

function Box({
  at,
  size,
  color = ceramic,
  opacity = 1,
}: {
  at: Point3;
  size: Point3;
  color?: string;
  opacity?: number;
}) {
  return (
    <RoundedBox args={size} radius={0.035} smoothness={3} position={at}>
      <meshStandardMaterial
        color={color}
        roughness={0.32}
        metalness={0.08}
        transparent={opacity < 1}
        opacity={opacity}
        depthWrite={opacity === 1}
      />
    </RoundedBox>
  );
}
function Tube({
  points,
  color = metal,
  radius = 0.045,
}: {
  points: Point3[];
  color?: string;
  radius?: number;
}) {
  const pointsKey = JSON.stringify(points);
  const curve = useMemo(
    () =>
      new CatmullRomCurve3(
        (JSON.parse(pointsKey) as Point3[]).map((p) => new Vector3(...p)),
      ),
    [pointsKey],
  );
  return (
    <mesh>
      <tubeGeometry args={[curve, 36, radius, 12, false]} />
      <meshStandardMaterial color={color} metalness={0.55} roughness={0.3} />
    </mesh>
  );
}
function Cylinder({
  at,
  radius,
  height,
  color = metal,
  rotation = [0, 0, 0],
}: {
  at: Point3;
  radius: number;
  height: number;
  color?: string;
  rotation?: Point3;
}) {
  return (
    <mesh position={at} rotation={rotation}>
      <cylinderGeometry args={[radius, radius, height, 32]} />
      <meshStandardMaterial color={color} roughness={0.3} metalness={0.3} />
    </mesh>
  );
}
function Part({
  id,
  selected,
  onSelect,
  children,
}: {
  id: PartId;
  selected: PartId;
  onSelect: Props["onSelect"];
  children: ReactNode;
}) {
  return (
    <group
      name={id}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(id);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "";
      }}
    >
      {children}
      {selected === id && (
        <pointLight color="#b9f2ce" intensity={0.55} distance={1.2} />
      )}
    </group>
  );
}
function Drops({
  points,
  progress,
  active = true,
  color = aqua,
  count = 12,
}: {
  points: Point3[];
  progress: number;
  active?: boolean;
  color?: string;
  count?: number;
}) {
  const pointsKey = JSON.stringify(points);
  const curve = useMemo(
    () =>
      new CatmullRomCurve3(
        (JSON.parse(pointsKey) as Point3[]).map((p) => new Vector3(...p)),
      ),
    [pointsKey],
  );
  return (
    <group visible={active}>
      {Array.from({ length: count }, (_, i) => {
        const p = curve.getPoint((progress * 4 + i / count) % 1);
        return (
          <mesh key={i} position={p}>
            <sphereGeometry args={[0.025, 8, 8]} />
            <meshBasicMaterial color={color} />
          </mesh>
        );
      })}
    </group>
  );
}

export function DeviceScene({
  device,
  selected,
  cutaway,
  faulty,
  progress,
  onSelect,
}: Props) {
  const part = (id: PartId, children: ReactNode) => (
    <Part id={id} selected={selected} onSelect={onSelect}>
      {children}
    </Part>
  );
  const phase = Math.sin(progress * Math.PI * 2);
  const bowl = useMemo(
    () => [
      new Vector2(0.18, 0),
      new Vector2(0.28, 0.1),
      new Vector2(0.43, 0.22),
      new Vector2(0.51, 0.36),
      new Vector2(0.53, 0.42),
    ],
    [],
  );
  const highlight = (id: PartId, base: string) =>
    selected === id ? "#bce8ad" : base;
  return (
    <group>
      <mesh position={[0, -0.04, 0]}>
        <cylinderGeometry args={[1.48, 1.55, 0.12, 64]} />
        <meshStandardMaterial color="#263c3c" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.025, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.31, 1.32, 64]} />
        <meshBasicMaterial color="#647b70" />
      </mesh>
      {device === "toilet" && (
        <>
          {part(
            "body",
            <>
              <Box at={[0, 0.15, 0.22]} size={[0.73, 0.23, 1.05]} />
              <Box at={[0, 0.72, -0.38]} size={[0.57, 0.62, 0.52]} />
              <Cylinder
                at={[0, 0.32, 0.32]}
                radius={0.27}
                height={0.5}
                color={ceramic}
              />
              <mesh position={[0, 0.34, 0.45]} scale={[1, 1, 1.32]}>
                <latheGeometry args={[bowl, 48]} />
                <meshStandardMaterial
                  color={ceramic}
                  roughness={0.24}
                  side={DoubleSide}
                />
              </mesh>
              <mesh
                position={[0, 0.78, 0.45]}
                rotation={[Math.PI / 2, 0, 0]}
                scale={[1, 1.32, 1]}
              >
                <torusGeometry args={[0.5, 0.063, 14, 48]} />
                <meshStandardMaterial color="#eef2e9" roughness={0.2} />
              </mesh>
            </>,
          )}
          <Box at={[0, 1.03, -0.35]} size={[1.34, 0.11, 0.68]} />
          <Box at={[0, 1.45, -0.69]} size={[1.34, 0.85, 0.08]} />
          <Box
            at={[-0.65, 1.45, -0.35]}
            size={[0.08, 0.85, 0.68]}
            opacity={cutaway ? 0.24 : 1}
          />
          <Box
            at={[0.65, 1.45, -0.35]}
            size={[0.08, 0.85, 0.68]}
            opacity={cutaway ? 0.24 : 1}
          />
          <Box
            at={[0, 1.45, 0]}
            size={[1.34, 0.85, 0.07]}
            opacity={cutaway ? 0.1 : 1}
          />
          {part(
            "lid",
            <Box
              at={[0, cutaway ? 2.18 : 1.91, -0.35]}
              size={[1.42, 0.1, 0.78]}
            />,
          )}
          <Box
            at={[0, 1.27 + (faulty ? 0 : phase * 0.07), -0.34]}
            size={[1.17, 0.29, 0.54]}
            color={aqua}
            opacity={0.18}
          />
          {part(
            "fill",
            <>
              <Cylinder
                at={[-0.47, 1.43, -0.36]}
                radius={0.07}
                height={0.64}
                color={highlight("fill", aqua)}
              />
              <Box
                at={[-0.47, 1.78, -0.36]}
                size={[0.23, 0.11, 0.19]}
                color={highlight("fill", aqua)}
              />
            </>,
          )}
          {part(
            "float",
            <group
              position={[
                0,
                faulty && selected === "float" ? -0.13 : phase * 0.04,
                0,
              ]}
            >
              <Tube
                points={[
                  [-0.45, 1.67, -0.3],
                  [-0.03, 1.67, -0.3],
                  [0.32, 1.56, -0.3],
                ]}
                radius={0.018}
              />
              <mesh position={[0.38, 1.57, -0.3]}>
                <sphereGeometry args={[0.14, 24, 24]} />
                <meshStandardMaterial
                  color={highlight("float", amber)}
                  roughness={0.4}
                />
              </mesh>
            </group>,
          )}
          <Cylinder at={[0.14, 1.4, -0.43]} radius={0.047} height={0.63} />
          {part(
            "seal",
            <group
              position={[0, 1.11, -0.18]}
              rotation={[0, 0, faulty ? -0.24 : 0]}
            >
              <Cylinder
                at={[0, 0, 0]}
                radius={0.14}
                height={0.036}
                color={highlight("seal", coral)}
              />
              <Tube
                points={[
                  [0, 0.04, 0],
                  [0.02, 0.37, -0.04],
                  [0.16, 0.62, -0.06],
                ]}
                radius={0.009}
              />
            </group>,
          )}
          {part(
            "valve",
            <>
              <Tube
                points={[
                  [-0.47, 1.08, -0.36],
                  [-0.55, 0.42, -0.36],
                  [-0.85, 0.44, -0.3],
                ]}
              />
              <Cylinder
                at={[-0.85, 0.51, -0.3]}
                radius={0.095}
                height={0.045}
                color={highlight("valve", coral)}
              />
            </>,
          )}
          {part(
            "drain",
            <mesh
              position={[0, faulty && selected === "drain" ? 0.74 : 0.6, 0.45]}
              rotation={[-Math.PI / 2, 0, 0]}
              scale={[1, 1.3, 1]}
            >
              <circleGeometry args={[0.37, 36]} />
              <meshStandardMaterial
                color={highlight("drain", aqua)}
                transparent
                opacity={0.55}
              />
            </mesh>,
          )}
          <Drops
            points={[
              [-0.47, 1.78, -0.33],
              [-0.47, 1.45, -0.3],
              [-0.25, 1.4, -0.28],
            ]}
            progress={progress}
            active={faulty || progress < 0.55}
            count={8}
          />
          <Drops
            points={[
              [0, 1.1, -0.16],
              [0, 0.92, 0],
              [0, 0.7, 0.42],
            ]}
            progress={progress}
            active={faulty && selected !== "valve"}
            color={coral}
            count={7}
          />
        </>
      )}
      {device === "faucet" && (
        <>
          <Box at={[0, 0.32, 0]} size={[1.65, 0.13, 1]} color="#59716b" />
          {part(
            "joint",
            <Cylinder
              at={[0, 0.45, 0]}
              radius={0.2}
              height={0.16}
              color={highlight("joint", metal)}
            />,
          )}
          {part(
            "cartridge",
            <>
              <Cylinder
                at={[0, 0.95, 0]}
                radius={0.15}
                height={0.9}
                color={highlight("cartridge", metal)}
              />
              <Cylinder
                at={[0, cutaway ? 1.63 : 1.43, 0]}
                radius={0.1}
                height={0.2}
                color={amber}
              />
              <Box
                at={[0.13, cutaway ? 1.84 : 1.61, 0]}
                size={[0.45, 0.055, 0.12]}
                color={metal}
              />
            </>,
          )}
          {part(
            "spout",
            <Tube
              points={[
                [0, 1.35, 0],
                [0.33, 1.45, 0],
                [0.62, 1.42, 0],
                [0.62, 1.3, 0],
              ]}
              radius={0.085}
              color={highlight("spout", metal)}
            />,
          )}
          <Drops
            points={[
              [0.62, 1.29, 0],
              [0.62, 0.9, 0],
              [0.62, 0.42, 0],
            ]}
            progress={progress}
            active={faulty}
            count={4}
          />
        </>
      )}
      {device === "sink" && (
        <>
          <Box
            at={[0, 1.3, 0]}
            size={[1.7, 0.19, 0.95]}
            color={ceramic}
            opacity={cutaway ? 0.3 : 1}
          />
          <Box at={[-0.8, 1.47, 0]} size={[0.1, 0.3, 0.95]} />
          <Box at={[0.8, 1.47, 0]} size={[0.1, 0.3, 0.95]} />
          <Box at={[0, 1.47, -0.43]} size={[1.65, 0.3, 0.1]} />
          {part(
            "drain",
            <Cylinder
              at={[0, 1.25, 0]}
              radius={0.13}
              height={0.2}
              color={highlight("drain", metal)}
            />,
          )}
          {part(
            "joint",
            <Tube
              points={[
                [0, 1.2, 0],
                [0, 0.58, 0],
                [0.23, 0.38, 0],
                [0.49, 0.58, 0],
                [0.5, 0.78, 0],
              ]}
              radius={0.1}
              color={highlight("joint", metal)}
            />,
          )}
          {part(
            "supply",
            <Tube
              points={[
                [0.5, 0.78, 0],
                [0.7, 0.83, 0],
                [1.05, 0.83, -0.1],
              ]}
              radius={0.1}
              color={highlight("supply", metal)}
            />,
          )}
          {faulty && (
            <mesh position={[0, 1.36, 0]}>
              <sphereGeometry args={[0.11, 12, 12]} />
              <meshStandardMaterial color={coral} />
            </mesh>
          )}
          <Drops
            points={[
              [0, 1.6, 0],
              [0, faulty ? 1.42 : 0.6, 0],
              [faulty ? 0 : 0.5, faulty ? 1.39 : 0.72, 0],
            ]}
            progress={progress}
            count={10}
          />
        </>
      )}
      {device === "shower" && (
        <>
          <Cylinder at={[-0.35, 1.1, -0.22]} radius={0.035} height={1.7} />
          {part(
            "head",
            <group
              position={[0, cutaway ? 1.94 : 1.75, 0]}
              rotation={[0.35, 0, 0]}
            >
              <Cylinder
                at={[0, 0, 0]}
                radius={0.31}
                height={0.07}
                color={highlight("head", metal)}
              />
              {Array.from({ length: 8 }, (_, i) => (
                <mesh
                  key={i}
                  position={[
                    Math.cos((i * Math.PI) / 4) * 0.2,
                    -0.043,
                    Math.sin((i * Math.PI) / 4) * 0.2,
                  ]}
                >
                  <sphereGeometry args={[0.018, 8, 8]} />
                  <meshBasicMaterial
                    color={faulty && i % 2 ? amber : "#253a3d"}
                  />
                </mesh>
              ))}
            </group>,
          )}
          {part(
            "hose",
            <Tube
              points={[
                [0, 1.73, 0],
                [0.4, 1.08, 0],
                [0.35, 0.3, 0],
                [-0.35, 0.48, 0],
              ]}
              radius={0.046}
              color={highlight("hose", metal)}
            />,
          )}
          {part(
            "valve",
            <Box
              at={[-0.35, 0.55, 0]}
              size={[0.55, 0.14, 0.18]}
              color={highlight("valve", metal)}
            />,
          )}
          {[-0.18, 0, 0.18].map((x, i) => (
            <Drops
              key={i}
              points={[
                [x, 1.72, 0],
                [x, faulty ? 1.08 : 0.8, 0.26],
                [x, faulty ? 0.9 : 0.18, 0.45],
              ]}
              progress={progress + i * 0.05}
              count={faulty ? 3 : 7}
            />
          ))}
        </>
      )}
      {device === "pipe" && (
        <>
          {part(
            "body",
            <Tube
              points={[
                [-1.08, 1.12, 0],
                [0, 1.12, 0],
                [0.85, 1.12, 0],
                [1, 0.55, 0],
              ]}
              radius={0.12}
              color={highlight("body", metal)}
            />,
          )}
          {part(
            "joint",
            <Cylinder
              at={[0, 1.12, 0]}
              radius={0.17}
              height={0.25}
              rotation={[0, 0, Math.PI / 2]}
              color={highlight("joint", amber)}
            />,
          )}
          {part(
            "valve",
            <>
              <Cylinder at={[-0.7, 1.32, 0]} radius={0.05} height={0.3} />
              <Box
                at={[-0.7, 1.5, 0]}
                size={[0.38, 0.06, 0.1]}
                color={highlight("valve", coral)}
              />
            </>,
          )}
          <Drops
            points={[
              [0.02, 1.06, 0.13],
              [0.02, 0.6, 0.13],
              [0.02, 0.08, 0.13],
            ]}
            progress={progress}
            active={faulty}
            count={5}
          />
          <Drops
            points={[
              [-1, 1.13, 0.13],
              [0, 1.13, 0.17],
              [0.9, 1.05, 0.13],
            ]}
            progress={progress}
            active={cutaway}
          />
        </>
      )}
      {device === "water-heater" && (
        <>
          <Box
            at={[0, 1.2, -0.12]}
            size={[1.2, 1.55, 0.5]}
            opacity={cutaway ? 0.15 : 1}
          />
          {part(
            "heater",
            <>
              <Box
                at={[0, 1.48, 0]}
                size={[0.9, 0.55, 0.22]}
                color={highlight("heater", faulty ? metal : amber)}
              />
              {[-0.3, -0.15, 0, 0.15, 0.3].map((x) => (
                <Cylinder
                  key={x}
                  at={[x, 1.48, 0.16]}
                  radius={0.045}
                  height={0.55}
                  color={faulty ? metal : coral}
                />
              ))}
            </>,
          )}
          {part(
            "control",
            <Box
              at={[0, 0.91, cutaway ? 0.45 : 0.17]}
              size={[0.65, 0.28, 0.07]}
              color={highlight("control", "#233d3a")}
            />,
          )}
          {part(
            "supply",
            <>
              {[-0.32, 0.32].map((x, i) => (
                <Tube
                  key={x}
                  points={[
                    [x, 0.62, 0],
                    [x, 0.3, 0],
                    [x * 1.6, 0.22, 0],
                  ]}
                  radius={0.065}
                  color={i && !faulty ? coral : aqua}
                />
              ))}
            </>,
          )}
          <Drops
            points={[
              [-0.32, 0.22, 0.07],
              [-0.32, 1.4, 0.18],
              [0.32, 1.4, 0.18],
              [0.32, 0.22, 0.07],
            ]}
            progress={progress}
            color={faulty ? aqua : amber}
          />
        </>
      )}
      {device === "outlet" && (
        <>
          {part(
            "socket",
            <>
              <Box
                at={[0, 1.14, 0]}
                size={[0.9, 1.25, 0.17]}
                color={highlight("socket", ceramic)}
              />
              {[0.83, 1.4].map((y) => (
                <group key={y}>
                  {[-0.14, 0.14].map((x) => (
                    <Box
                      key={x}
                      at={[x, y, 0.1]}
                      size={[0.045, 0.17, 0.04]}
                      color="#203436"
                    />
                  ))}
                  <Cylinder
                    at={[0, y - 0.17, 0.11]}
                    radius={0.045}
                    height={0.04}
                    rotation={[Math.PI / 2, 0, 0]}
                    color="#203436"
                  />
                </group>
              ))}
            </>,
          )}
          {part(
            "switch",
            <Box
              at={[0.73, 1.13, 0.04]}
              size={[0.25, 0.43, 0.17]}
              color={highlight("switch", faulty ? coral : aqua)}
            />,
          )}
          {part(
            "supply",
            <Tube
              points={[
                [-1, 0.28, -0.1],
                [-0.75, 1.1, -0.1],
                [-0.45, 1.1, -0.1],
              ]}
              color={highlight("supply", amber)}
            />,
          )}
          <Drops
            points={[
              [-1, 0.28, -0.08],
              [-0.75, 1.1, -0.08],
              [-0.48, 1.1, 0],
            ]}
            progress={progress}
            color={amber}
            active={!faulty}
          />
        </>
      )}
      {device === "breaker" && (
        <>
          {part(
            "body",
            <Box
              at={[0, 1.1, -0.13]}
              size={[1.35, 1.65, 0.3]}
              color={highlight("body", metal)}
            />,
          )}
          <Box at={[0, 1.11, 0.05]} size={[1.13, 1.37, 0.13]} color="#273c3c" />
          {part(
            "switch",
            <>
              {[-0.35, 0, 0.35].map((x, i) => (
                <group key={x}>
                  <Box
                    at={[x, 1.27, 0.18]}
                    size={[0.28, 0.62, 0.17]}
                    color={ceramic}
                  />
                  <Box
                    at={[x, faulty && i === 1 ? 1.17 : 1.4, 0.3]}
                    size={[0.17, 0.18, 0.12]}
                    color={highlight(
                      "switch",
                      faulty && i === 1 ? coral : "#344b4c",
                    )}
                  />
                </group>
              ))}
            </>,
          )}
          {part(
            "supply",
            <>
              {[-0.35, 0, 0.35].map((x) => (
                <Tube
                  key={x}
                  points={[
                    [x, 0.92, 0.2],
                    [x, 0.62, 0.2],
                    [x, 0.32, 0.05],
                  ]}
                  color={amber}
                  radius={0.022}
                />
              ))}
            </>,
          )}
          <Drops
            points={[
              [0, 0.34, 0.12],
              [0, 0.8, 0.24],
              [0, 1.45, 0.35],
            ]}
            progress={progress}
            active={!faulty}
            color={amber}
          />
        </>
      )}
      {device === "light" && (
        <>
          {part(
            "supply",
            <>
              <Cylinder at={[0, 1.92, 0]} radius={0.025} height={0.62} />
              <Cylinder
                at={[0, 1.6, 0]}
                radius={0.18}
                height={0.22}
                color={metal}
              />
            </>,
          )}
          {part(
            "bulb",
            <>
              <mesh position={[0, 1.24, 0]}>
                <sphereGeometry args={[0.33, 32, 32]} />
                <meshStandardMaterial
                  color={highlight("bulb", faulty ? "#9caaa3" : "#fae3a8")}
                  emissive={faulty ? "#000000" : "#edbb66"}
                  emissiveIntensity={0.75}
                  roughness={0.22}
                  transparent
                  opacity={cutaway ? 0.45 : 1}
                />
              </mesh>
              {!faulty && (
                <pointLight
                  position={[0, 1.2, 0]}
                  color="#f9d992"
                  intensity={1}
                  distance={3}
                />
              )}
              <Tube
                points={[
                  [-0.08, 1.52, 0],
                  [-0.07, 1.23, 0],
                  [0.07, 1.23, 0],
                  [0.08, 1.52, 0],
                ]}
                radius={0.01}
                color={faulty ? metal : amber}
              />
            </>,
          )}
          {part(
            "switch",
            <>
              <Box at={[0.82, 0.64, 0]} size={[0.35, 0.52, 0.13]} />
              <Box
                at={[0.82, 0.66, 0.11]}
                size={[0.17, 0.29, 0.09]}
                color={highlight("switch", metal)}
              />
            </>,
          )}
          <Drops
            points={[
              [0, 2.1, 0.05],
              [0, 1.7, 0.05],
              [0, 1.3, 0.08],
            ]}
            progress={progress}
            active={!faulty}
            color={amber}
            count={6}
          />
        </>
      )}
    </group>
  );
}
