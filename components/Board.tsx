"use client";

import { useMemo } from "react";
import { RoundedBox } from "@react-three/drei";
import { dotGridTexture, floorGridTexture } from "@/lib/textures";

const BOARD = 7;
const BOARD_H = 0.5;

// light grey placeholder tiles on top of the board: [x, z, width, depth]
const TILES: [number, number, number, number][] = [
  [-2.2, 1.3, 1.8, 0.8],
  [0.1, 1.3, 1.8, 0.8],
  [-1.0, 2.6, 1.8, 0.8],
  [1.4, 2.6, 1.8, 0.8],
  [2.4, 0.8, 1.6, 0.8],
  [2.4, -2.7, 1.6, 0.8],
];

function Pill({ x, z, color }: { x: number; z: number; color: string }) {
  return (
    <group position={[x, BOARD_H + 0.03, z]}>
      <RoundedBox args={[0.46, 0.06, 0.24]} radius={0.03} castShadow>
        <meshStandardMaterial color={color} roughness={0.5} />
      </RoundedBox>
      <RoundedBox args={[0.36, 0.07, 0.14]} radius={0.03}>
        <meshStandardMaterial color="#ffffff" roughness={0.6} />
      </RoundedBox>
    </group>
  );
}

export default function Board() {
  const dots = useMemo(() => dotGridTexture(28), []);
  const floor = useMemo(() => floorGridTexture(), []);

  return (
    <group>
      {/* blue grid floor */}
      <mesh rotation-x={-Math.PI / 2} position={[0.8, 0, 0.8]}>
        <planeGeometry args={[22, 22]} />
        <meshBasicMaterial map={floor} transparent depthWrite={false} />
      </mesh>
      {/* invisible floor that only shows shadows */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.001, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <shadowMaterial opacity={0.14} />
      </mesh>

      {/* white slab */}
      <RoundedBox args={[BOARD, BOARD_H, BOARD]} radius={0.18} smoothness={6} position={[0, BOARD_H / 2, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#fbfbfc" roughness={0.55} />
      </RoundedBox>
      {/* dotted top */}
      <mesh rotation-x={-Math.PI / 2} position={[0, BOARD_H + 0.002, 0]} receiveShadow>
        <planeGeometry args={[BOARD - 0.3, BOARD - 0.3]} />
        <meshStandardMaterial map={dots} roughness={0.7} />
      </mesh>

      {TILES.map(([x, z, w, d], i) => (
        <RoundedBox key={i} args={[w, 0.1, d]} radius={0.05} position={[x, BOARD_H + 0.05, z]} castShadow receiveShadow>
          <meshStandardMaterial color="#ececef" roughness={0.6} />
        </RoundedBox>
      ))}

      <Pill x={-0.9} z={1.95} color="#22a35a" />
      <Pill x={2.5} z={1.95} color="#e5484d" />
    </group>
  );
}

export { BOARD, BOARD_H };