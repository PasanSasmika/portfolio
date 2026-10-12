"use client";

import { forwardRef, useImperativeHandle, useMemo, useRef } from "react";
import * as THREE from "three";
import { RoundedBox } from "@react-three/drei";
import { plateTexture } from "@/lib/textures";

export type OutputHandle = { arrow: THREE.Group; card: THREE.Group };

/** Green arrow + the white card that slides out of the hub */
const OutputCard = forwardRef<OutputHandle, { y: number }>(function OutputCard({ y }, ref) {
  const arrow = useRef<THREE.Group>(null!);
  const card = useRef<THREE.Group>(null!);
  useImperativeHandle(ref, () => ({ arrow: arrow.current, card: card.current }));

  const plate = useMemo(() => plateTexture(), []);
  const green = "#2fb36b";

  return (
    <group>
      {/* arrow: scale.x animates 0 -> 1 (pivot at its start) */}
      <group ref={arrow} position={[0.45, y + 0.04, -1.0]} scale={[0.001, 1, 1]}>
        <mesh position={[0.3, 0, 0]}>
          <boxGeometry args={[0.6, 0.03, 0.05]} />
          <meshStandardMaterial color={green} roughness={0.4} />
        </mesh>
        <mesh position={[0.66, 0, 0]} rotation-z={-Math.PI / 2}>
          <coneGeometry args={[0.09, 0.18, 3]} />
          <meshStandardMaterial color={green} roughness={0.4} />
        </mesh>
      </group>

      {/* card */}
      <group ref={card} position={[2.05, y + 0.06, -1.0]} scale={0.001}>
        <RoundedBox args={[1.7, 0.08, 1.0]} radius={0.04} castShadow receiveShadow>
          <meshStandardMaterial color="#ffffff" roughness={0.5} />
        </RoundedBox>
        <group position={[-0.5, 0.06, 0]}>
          <RoundedBox args={[0.42, 0.06, 0.42]} radius={0.04} castShadow>
            <meshStandardMaterial color="#1c1d21" roughness={0.4} />
          </RoundedBox>
          <mesh rotation-x={-Math.PI / 2} position={[0, 0.031, 0]}>
            <planeGeometry args={[0.36, 0.36]} />
            <meshStandardMaterial map={plate} />
          </mesh>
        </group>
        <RoundedBox args={[0.8, 0.04, 0.12]} radius={0.02} position={[0.28, 0.05, -0.16]}>
          <meshStandardMaterial color="#d9dbe0" />
        </RoundedBox>
        <RoundedBox args={[0.6, 0.04, 0.12]} radius={0.02} position={[0.18, 0.05, 0.16]}>
          <meshStandardMaterial color="#d9dbe0" />
        </RoundedBox>
      </group>
    </group>
  );
});

export default OutputCard;